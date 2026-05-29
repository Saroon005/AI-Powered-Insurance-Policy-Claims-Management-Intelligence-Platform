const request = require('supertest');
const app = require('../src/app');
const notificationRoutes = require('../src/routes/notificationRoutes');

// Mock the notification service
jest.mock('../src/services/notificationService', () => ({
  sendNotification: jest.fn()
}));

describe('Express App Tests', () => {
  
  describe('GET /', () => {
    it('should return a success message', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.text).toBe('Notification Service Running');
    });
  });

  describe('POST /notify/claim-filed', () => {
    it('should return 200 with success message', async () => {
      const response = await request(app)
        .post('/notify/claim-filed')
        .send({
          message: 'New claim filed',
          claimId: 'CLM001'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Claim filed notification sent'
      });
    });
  });

  describe('POST /notify/claim-status-updated', () => {
    it('should return 200 with success message', async () => {
      const response = await request(app)
        .post('/notify/claim-status-updated')
        .send({
          message: 'Claim status updated',
          claimId: 'CLM001',
          status: 'APPROVED',
          targetRoom: 'customer_123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Claim status notification sent'
      });
    });
  });

  describe('POST /notify/fraud-score', () => {
    it('should return 200 with success message', async () => {
      const response = await request(app)
        .post('/notify/fraud-score')
        .send({
          message: 'High fraud probability detected',
          claimId: 'CLM001',
          fraudProbability: 0.85,
          riskLevel: 'HIGH'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('CORS Middleware', () => {
    it('should handle CORS headers', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:3000');

      expect(response.status).toBe(200);
    });
  });

  describe('JSON Middleware', () => {
    it('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/notify/claim-filed')
        .set('Content-Type', 'application/json')
        .send({
          message: 'Test notification',
          claimId: 'CLM001'
        });

      expect(response.status).toBe(200);
    });
  });
});
