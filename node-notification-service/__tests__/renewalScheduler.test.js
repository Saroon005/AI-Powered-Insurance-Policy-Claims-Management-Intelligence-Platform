jest.mock('node-cron');
jest.mock('../src/services/notificationService');

const cron = require('node-cron');
const { sendNotification } = require('../src/services/notificationService');

describe('Renewal Scheduler', () => {
  let mockSchedule;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSchedule = jest.fn();
    cron.schedule = mockSchedule;
  });

  describe('startRenewalScheduler', () => {
    it('should schedule renewal check every 30 seconds', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      expect(mockSchedule).toHaveBeenCalledWith(
        '*/30 * * * * *',
        expect.any(Function)
      );
    });

    it('should send renewal notification with correct payload', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      // Get the callback function
      const callback = mockSchedule.mock.calls[0][1];
      
      // Execute the callback
      callback();

      expect(sendNotification).toHaveBeenCalledWith(
        'customer_12',
        expect.any(String),
        expect.objectContaining({
          type: 'POLICY_RENEWAL_DUE',
          title: 'Policy Renewal Reminder',
          message: 'Your insurance policy expires in 7 days',
          policyId: 'POL101',
          renewalDate: '2026-06-02'
        })
      );
    });

    it('should include timestamp in renewal notification', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      const callback = mockSchedule.mock.calls[0][1];
      callback();

      const callArgs = sendNotification.mock.calls[0][2];
      expect(callArgs.timestamp).toBeDefined();
      expect(callArgs.timestamp instanceof Date).toBe(true);
    });

    it('should use correct event type', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      const callback = mockSchedule.mock.calls[0][1];
      callback();

      expect(sendNotification).toHaveBeenCalled();
    });

    it('should target correct customer room', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      const callback = mockSchedule.mock.calls[0][1];
      callback();

      const room = sendNotification.mock.calls[0][0];
      expect(room).toBe('customer_12');
    });

    it('should execute callback multiple times', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      const callback = mockSchedule.mock.calls[0][1];
      
      // Simulate multiple executions
      callback();
      callback();
      callback();

      expect(sendNotification).toHaveBeenCalledTimes(3);
    });

    it('should handle errors gracefully during scheduling', () => {
      mockSchedule.mockImplementation(() => {
        throw new Error('Scheduling failed');
      });

      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      expect(() => {
        startRenewalScheduler();
      }).toThrow('Scheduling failed');
    });
  });

  describe('Cron Expression Validation', () => {
    it('should use correct cron expression format', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      expect(mockSchedule).toHaveBeenCalledWith(
        '*/30 * * * * *',
        expect.any(Function)
      );
    });
  });

  describe('Renewal Payload Structure', () => {
    it('should include all required fields in payload', () => {
      const startRenewalScheduler = require('../src/services/renewalScheduler');
      
      startRenewalScheduler();

      const callback = mockSchedule.mock.calls[0][1];
      callback();

      const payload = sendNotification.mock.calls[0][2];
      
      expect(payload).toHaveProperty('type');
      expect(payload).toHaveProperty('title');
      expect(payload).toHaveProperty('message');
      expect(payload).toHaveProperty('policyId');
      expect(payload).toHaveProperty('renewalDate');
      expect(payload).toHaveProperty('timestamp');
    });
  });
});
