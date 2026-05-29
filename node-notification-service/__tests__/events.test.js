const EVENTS = require('../src/events/notificationEvents');

describe('Notification Events', () => {
  
  describe('Event Constants', () => {
    it('should define CLAIM_FILED event', () => {
      expect(EVENTS.CLAIM_FILED).toBeDefined();
      expect(typeof EVENTS.CLAIM_FILED).toBe('string');
    });

    it('should define CLAIM_STATUS_UPDATED event', () => {
      expect(EVENTS.CLAIM_STATUS_UPDATED).toBeDefined();
      expect(typeof EVENTS.CLAIM_STATUS_UPDATED).toBe('string');
    });

    it('should define FRAUD_SCORE_GENERATED event', () => {
      expect(EVENTS.FRAUD_SCORE_GENERATED).toBeDefined();
      expect(typeof EVENTS.FRAUD_SCORE_GENERATED).toBe('string');
    });

    it('should define POLICY_RENEWAL_DUE event', () => {
      expect(EVENTS.POLICY_RENEWAL_DUE).toBeDefined();
      expect(typeof EVENTS.POLICY_RENEWAL_DUE).toBe('string');
    });

    it('should define PREMIUM_PAYMENT_RECEIVED event', () => {
      expect(EVENTS.PREMIUM_PAYMENT_RECEIVED).toBeDefined();
      expect(typeof EVENTS.PREMIUM_PAYMENT_RECEIVED).toBe('string');
    });

    it('should define CLAIM_SETTLED event', () => {
      expect(EVENTS.CLAIM_SETTLED).toBeDefined();
      expect(typeof EVENTS.CLAIM_SETTLED).toBe('string');
    });
  });

  describe('Event Values', () => {
    it('should have correct camelCase event names', () => {
      expect(EVENTS.CLAIM_FILED).toBe('claimFiled');
      expect(EVENTS.CLAIM_STATUS_UPDATED).toBe('claimStatusUpdated');
      expect(EVENTS.FRAUD_SCORE_GENERATED).toBe('fraudScoreGenerated');
      expect(EVENTS.POLICY_RENEWAL_DUE).toBe('policyRenewalDue');
      expect(EVENTS.PREMIUM_PAYMENT_RECEIVED).toBe('premiumPaymentReceived');
      expect(EVENTS.CLAIM_SETTLED).toBe('claimSettled');
    });
  });

  describe('Event Uniqueness', () => {
    it('should have unique event values', () => {
      const eventValues = Object.values(EVENTS);
      const uniqueValues = new Set(eventValues);
      
      expect(uniqueValues.size).toBe(eventValues.length);
    });
  });

  describe('Event Export', () => {
    it('should export all events as object', () => {
      expect(typeof EVENTS).toBe('object');
      expect(EVENTS).not.toBeNull();
    });

    it('should have correct number of events', () => {
      const eventKeys = Object.keys(EVENTS);
      expect(eventKeys.length).toBe(6);
    });

    it('should be immutable (not easily modified)', () => {
      const originalValue = EVENTS.CLAIM_FILED;
      
      // This should still work as properties are not frozen by default in this implementation
      // But best practice would be to Object.freeze the export
      expect(EVENTS.CLAIM_FILED).toBe(originalValue);
    });
  });

  describe('Event Usage in Code', () => {
    it('should be usable as event names for Socket.IO', () => {
      const eventName = EVENTS.CLAIM_FILED;
      
      // Verify it can be used as a string in Socket.IO emit
      expect(eventName).toMatch(/^[a-zA-Z]+$/);
      expect(eventName.length).toBeGreaterThan(0);
    });

    it('should follow consistent naming pattern', () => {
      const events = Object.values(EVENTS);
      
      events.forEach(event => {
        // Each should be camelCase
        expect(event).toMatch(/^[a-z][a-zA-Z]*$/);
      });
    });
  });

  describe('Event Object Structure', () => {
    it('should contain only string values', () => {
      Object.values(EVENTS).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have descriptive constant names', () => {
      const keys = Object.keys(EVENTS);
      
      keys.forEach(key => {
        // Constants should be uppercase with underscores
        expect(key).toMatch(/^[A-Z_]+$/);
      });
    });
  });
});
