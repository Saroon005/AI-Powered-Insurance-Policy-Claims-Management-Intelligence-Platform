const { sendNotification } = require('../src/services/notificationService');
const { getIO } = require('../src/config/socket');
const { logNotification } = require('../src/utils/logger');

jest.mock('../src/config/socket');
jest.mock('../src/utils/logger');

describe('Notification Service', () => {
  let mockIO;
  let mockSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock Socket.IO instance
    mockSocket = {
      emit: jest.fn(),
      to: jest.fn()
    };
    
    mockIO = {
      to: jest.fn().mockReturnValue(mockSocket)
    };

    getIO.mockReturnValue(mockIO);
  });

  describe('sendNotification', () => {
    it('should send notification to specified room', () => {
      const room = 'claims_manager';
      const event = 'claimFiled';
      const payload = {
        type: 'CLAIM_FILED',
        title: 'New Claim Filed',
        message: 'Test claim'
      };

      sendNotification(room, event, payload);

      expect(mockIO.to).toHaveBeenCalledWith(room);
      expect(mockSocket.emit).toHaveBeenCalledWith(event, payload);
    });

    it('should log notification after sending', () => {
      const room = 'customer_123';
      const event = 'claimStatusUpdated';
      const payload = {
        type: 'CLAIM_STATUS_UPDATED',
        message: 'Your claim has been updated'
      };

      sendNotification(room, event, payload);

      expect(logNotification).toHaveBeenCalledWith(event, payload);
    });

    it('should handle multiple simultaneous notifications', () => {
      const rooms = ['room1', 'room2', 'room3'];
      const event = 'testEvent';
      const payload = { message: 'test' };

      rooms.forEach(room => {
        sendNotification(room, event, payload);
      });

      expect(mockIO.to).toHaveBeenCalledTimes(3);
    });

    it('should send notification with complex payload', () => {
      const room = 'claims_manager';
      const event = 'fraudScoreGenerated';
      const payload = {
        type: 'FRAUD_SCORE_GENERATED',
        title: 'Fraud Risk Alert',
        message: 'High fraud probability detected',
        claimId: 'CLM001',
        fraudProbability: 0.95,
        riskLevel: 'CRITICAL',
        timestamp: new Date(),
        metadata: {
          source: 'AI_MODEL',
          confidence: 0.98
        }
      };

      sendNotification(room, event, payload);

      expect(mockSocket.emit).toHaveBeenCalledWith(event, payload);
      expect(logNotification).toHaveBeenCalledWith(event, payload);
    });

    it('should throw error if Socket.IO not initialized', () => {
      getIO.mockImplementation(() => {
        throw new Error('Socket.IO not initialized');
      });

      expect(() => {
        sendNotification('room', 'event', {});
      }).toThrow('Socket.IO not initialized');
    });

    it('should emit to correct event name', () => {
      const eventTests = [
        { event: 'claimFiled', expected: 'claimFiled' },
        { event: 'claimStatusUpdated', expected: 'claimStatusUpdated' },
        { event: 'fraudScoreGenerated', expected: 'fraudScoreGenerated' },
        { event: 'policyRenewalDue', expected: 'policyRenewalDue' }
      ];

      eventTests.forEach(test => {
        sendNotification('test_room', test.event, { message: 'test' });
        expect(mockSocket.emit).toHaveBeenCalledWith(test.expected, expect.any(Object));
      });
    });
  });
});
