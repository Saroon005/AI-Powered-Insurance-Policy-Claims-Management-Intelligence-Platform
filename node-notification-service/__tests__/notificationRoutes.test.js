const request = require('supertest');
const app = require('../src/app');
const { sendNotification } = require('../src/services/notificationService');

jest.mock('../src/services/notificationService');
jest.mock('../src/utils/logger');

describe('Notification Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /notify/claim-filed', () => {
    it('should send claim filed notification with correct payload', async () => {
      const requestBody = {
        message: 'New insurance claim filed',
        claimId: 'CLM001'
      };

      const response = await request(app)
        .post('/notify/claim-filed')
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(sendNotification).toHaveBeenCalledWith(
        'claims_manager',
        'claimFiled',
        expect.objectContaining({
          type: 'CLAIM_FILED',
          title: 'New Claim Filed',
          message: requestBody.message,
          claimId: requestBody.claimId
        })
      );
    });

    it('should include timestamp in claim filed notification', async () => {
      await request(app)
        .post('/notify/claim-filed')
        .send({
          message: 'Claim filed',
          claimId: 'CLM002'
        });

      const payload = sendNotification.mock.calls[0][2];
      expect(payload.timestamp instanceof Date).toBe(true);
    });

    it('should send to claims_manager room', async () => {
      await request(app)
        .post('/notify/claim-filed')
        .send({
          message: 'Test',
          claimId: 'CLM001'
        });

      expect(sendNotification).toHaveBeenCalledWith(
        'claims_manager',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('POST /notify/claim-status-updated', () => {
    it('should send claim status update notification', async () => {
      const requestBody = {
        message: 'Your claim has been approved',
        claimId: 'CLM001',
        status: 'APPROVED',
        targetRoom: 'customer_123'
      };

      const response = await request(app)
        .post('/notify/claim-status-updated')
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(sendNotification).toHaveBeenCalledWith(
        requestBody.targetRoom,
        'claimStatusUpdated',
        expect.objectContaining({
          type: 'CLAIM_STATUS_UPDATED',
          claimId: requestBody.claimId,
          status: requestBody.status,
          message: requestBody.message
        })
      );
    });

    it('should send to specified target room', async () => {
      const targetRoom = 'customer_456';
      
      await request(app)
        .post('/notify/claim-status-updated')
        .send({
          message: 'Status update',
          claimId: 'CLM001',
          status: 'PENDING',
          targetRoom
        });

      expect(sendNotification).toHaveBeenCalledWith(
        targetRoom,
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should handle different claim statuses', async () => {
      const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'];

      for (const status of statuses) {
        await request(app)
          .post('/notify/claim-status-updated')
          .send({
            message: `Status: ${status}`,
            claimId: 'CLM001',
            status,
            targetRoom: 'customer_123'
          });
      }

      expect(sendNotification).toHaveBeenCalledTimes(4);
    });
  });

  describe('POST /notify/fraud-score', () => {
    it('should send fraud score notification with risk level', async () => {
      const requestBody = {
        message: 'Fraud probability analysis complete',
        claimId: 'CLM001',
        fraudProbability: 0.85,
        riskLevel: 'HIGH'
      };

      const response = await request(app)
        .post('/notify/fraud-score')
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(sendNotification).toHaveBeenCalledWith(
        'claims_manager',
        'fraudScoreGenerated',
        expect.objectContaining({
          type: 'FRAUD_SCORE_GENERATED',
          fraudProbability: requestBody.fraudProbability,
          riskLevel: requestBody.riskLevel,
          claimId: requestBody.claimId
        })
      );
    });

    it('should handle different fraud probability ranges', async () => {
      const probabilities = [0.1, 0.5, 0.75, 0.95];

      for (const prob of probabilities) {
        await request(app)
          .post('/notify/fraud-score')
          .send({
            message: 'Fraud check',
            claimId: 'CLM001',
            fraudProbability: prob,
            riskLevel: prob > 0.8 ? 'CRITICAL' : 'MEDIUM'
          });
      }

      expect(sendNotification).toHaveBeenCalledTimes(4);
    });

    it('should send fraud score to claims_manager room', async () => {
      await request(app)
        .post('/notify/fraud-score')
        .send({
          message: 'Test',
          claimId: 'CLM001',
          fraudProbability: 0.8,
          riskLevel: 'HIGH'
        });

      expect(sendNotification).toHaveBeenCalledWith(
        'claims_manager',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required fields gracefully', async () => {
      const response = await request(app)
        .post('/notify/claim-filed')
        .send({
          message: 'Missing claimId'
        });

      // API still returns 200, but payload will have undefined claimId
      expect(response.status).toBe(200);
    });

    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/notify/claim-filed')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
    });

    it('should call sendNotification even with partial data', async () => {
      await request(app)
        .post('/notify/claim-filed')
        .send({
          claimId: 'CLM001'
          // Missing message
        });

      expect(sendNotification).toHaveBeenCalled();
    });
  });

  describe('Response Format', () => {
    it('should return JSON response', async () => {
      const response = await request(app)
        .post('/notify/claim-filed')
        .send({
          message: 'Test',
          claimId: 'CLM001'
        });

      expect(response.type).toMatch(/json/);
    });

    it('should include success flag in response', async () => {
      const response = await request(app)
        .post('/notify/claim-filed')
        .send({
          message: 'Test',
          claimId: 'CLM001'
        });

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Multiple Notifications', () => {
    it('should handle rapid consecutive requests', async () => {
      const promises = [];

      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .post('/notify/claim-filed')
            .send({
              message: `Claim ${i}`,
              claimId: `CLM${i}`
            })
        );
      }

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      expect(sendNotification).toHaveBeenCalledTimes(5);
    });
  });
});
