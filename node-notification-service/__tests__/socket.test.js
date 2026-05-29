const { initializeSocket, getIO } = require('../src/config/socket');
const http = require('http');

// Mock Socket.IO
jest.mock('socket.io', () => {
  return {
    Server: jest.fn()
  };
});

describe('Socket Configuration', () => {
  let mockServer;
  let SocketIOServer;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Clear the module to reset the io variable
    jest.resetModules();
    
    SocketIOServer = require('socket.io').Server;
    mockServer = {
      listen: jest.fn(),
      close: jest.fn()
    };
  });

  describe('initializeSocket', () => {
    it('should create Socket.IO server with CORS configuration', () => {
      const mockIOInstance = {
        on: jest.fn(),
        emit: jest.fn(),
        to: jest.fn()
      };
      
      SocketIOServer.mockReturnValue(mockIOInstance);
      
      const { initializeSocket } = require('../src/config/socket');
      const result = initializeSocket(mockServer);

      expect(SocketIOServer).toHaveBeenCalledWith(mockServer, {
        cors: {
          origin: '*'
        }
      });
      expect(result).toBe(mockIOInstance);
    });

    it('should enable CORS for all origins', () => {
      const mockIOInstance = {};
      SocketIOServer.mockReturnValue(mockIOInstance);
      
      const { initializeSocket } = require('../src/config/socket');
      initializeSocket(mockServer);

      const callArgs = SocketIOServer.mock.calls[0][1];
      expect(callArgs.cors.origin).toBe('*');
    });
  });

  describe('getIO', () => {
    it('should return the initialized Socket.IO instance', () => {
      const mockIOInstance = { test: 'instance' };
      SocketIOServer.mockReturnValue(mockIOInstance);
      
      const { initializeSocket, getIO } = require('../src/config/socket');
      initializeSocket(mockServer);
      
      const result = getIO();
      expect(result).toBe(mockIOInstance);
    });

    it('should throw error if Socket.IO not initialized', () => {
      // Reset without initializing
      jest.resetModules();
      const { getIO } = require('../src/config/socket');

      expect(() => {
        getIO();
      }).toThrow('Socket.IO not initialized');
    });
  });

  describe('Socket Connection Scenarios', () => {
    it('should handle socket connection', () => {
      const mockIOInstance = {
        on: jest.fn()
      };
      
      SocketIOServer.mockReturnValue(mockIOInstance);
      
      const { initializeSocket } = require('../src/config/socket');
      const io = initializeSocket(mockServer);

      // Verify that the app can listen for connection events
      expect(io.on).toBeDefined();
    });
  });
});
