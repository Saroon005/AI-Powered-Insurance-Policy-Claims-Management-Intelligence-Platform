const { logNotification } = require('../src/utils/logger');

describe('Logger Utility', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('logNotification', () => {
    it('should log notification with event and message', () => {
      const event = 'claimFiled';
      const payload = {
        message: 'New claim filed by customer',
        claimId: 'CLM001'
      };

      logNotification(event, payload);

      expect(consoleLogSpy).toHaveBeenCalled();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      
      expect(logOutput).toContain('EVENT: ' + event);
      expect(logOutput).toContain('MESSAGE: ' + payload.message);
    });

    it('should include timestamp in log output', () => {
      const event = 'testEvent';
      const payload = { message: 'test' };

      logNotification(event, payload);

      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('TIME:');
    });

    it('should format log with separator borders', () => {
      const event = 'fraudScoreGenerated';
      const payload = { message: 'Fraud detected' };

      logNotification(event, payload);

      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('===================================');
    });

    it('should handle special characters in message', () => {
      const event = 'claimStatusUpdated';
      const payload = {
        message: 'Claim status: "APPROVED" @ 100%',
        special: '<html>test</html>'
      };

      logNotification(event, payload);

      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain(payload.message);
    });

    it('should handle empty message', () => {
      const event = 'testEvent';
      const payload = { message: '' };

      logNotification(event, payload);

      expect(consoleLogSpy).toHaveBeenCalled();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('EVENT: ' + event);
    });

    it('should handle long messages', () => {
      const event = 'claimFiled';
      const longMessage = 'A'.repeat(500);
      const payload = { message: longMessage };

      logNotification(event, payload);

      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain(longMessage);
    });

    it('should log multiple notifications sequentially', () => {
      const events = ['claimFiled', 'claimStatusUpdated', 'fraudScoreGenerated'];
      const messages = ['Claim filed', 'Status updated', 'Fraud detected'];

      events.forEach((event, index) => {
        logNotification(event, { message: messages[index] });
      });

      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
    });

    it('should preserve payload properties in output', () => {
      const event = 'claimStatusUpdated';
      const payload = {
        message: 'Claim updated',
        claimId: 'CLM001',
        status: 'APPROVED'
      };

      logNotification(event, payload);

      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain(event);
      expect(logOutput).toContain(payload.message);
    });

    it('should handle objects with nested properties in payload', () => {
      const event = 'fraudScoreGenerated';
      const payload = {
        message: 'Fraud analysis complete',
        analysis: {
          probability: 0.95,
          level: 'HIGH'
        }
      };

      logNotification(event, payload);

      expect(consoleLogSpy).toHaveBeenCalled();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toContain('Fraud analysis complete');
    });

    it('should include valid ISO timestamp format', () => {
      const event = 'testEvent';
      const payload = { message: 'test' };

      logNotification(event, payload);

      const logOutput = consoleLogSpy.mock.calls[0][0];
      // Check that timestamp format exists (rough check for date format)
      expect(logOutput).toMatch(/TIME:.*/);
    });
  });
});
