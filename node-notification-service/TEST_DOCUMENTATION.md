# Notification Service - Test Suite Documentation

## Overview
This document provides comprehensive information about the test suite for the Node.js Notification Service module.

## Test Framework
- **Framework**: Jest
- **HTTP Testing**: Supertest
- **Mocking**: Jest built-in mocking

## Installation

### Install Test Dependencies
```bash
npm install
```

This will install:
- `jest` - Testing framework
- `supertest` - HTTP assertion library
- `socket.io-client` - Socket.IO client for testing

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- __tests__/app.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="claim-filed"
```

## Test Structure

### 1. **App Tests** (`__tests__/app.test.js`)
Tests for the Express application setup and middleware:
- Express app initialization
- CORS middleware functionality
- JSON body parser
- Root endpoint (`GET /`)
- Middleware chain integration

**Key Tests:**
- `GET /` returns success message
- CORS headers are properly set
- JSON parsing works correctly

### 2. **Notification Service Tests** (`__tests__/notificationService.test.js`)
Tests for core notification sending logic:
- Socket.IO integration
- Notification payload structure
- Event emission
- Logging integration
- Error handling

**Key Tests:**
- Notifications are sent to correct room
- Payloads include all required fields
- Logging is called after notification
- Multiple simultaneous notifications
- Complex payload handling

### 3. **Notification Routes Tests** (`__tests__/notificationRoutes.test.js`)
Tests for all API endpoints:
- Claim filed endpoint
- Claim status update endpoint
- Fraud score endpoint
- Error handling
- Response formatting

**Endpoints Tested:**
- `POST /notify/claim-filed`
- `POST /notify/claim-status-updated`
- `POST /notify/fraud-score`

### 4. **Socket Configuration Tests** (`__tests__/socket.test.js`)
Tests for Socket.IO setup and configuration:
- Server initialization
- CORS configuration
- Socket instance management
- Error handling when not initialized

**Key Tests:**
- Socket.IO created with correct CORS settings
- getIO() returns initialized instance
- Error thrown if accessing getIO before initialization

### 5. **Renewal Scheduler Tests** (`__tests__/renewalScheduler.test.js`)
Tests for cron-based renewal notifications:
- Cron schedule validation
- Payload structure
- Notification sending
- Timing and execution

**Key Tests:**
- Runs every 30 seconds
- Sends to correct room
- Includes timestamp
- Proper event type used

### 6. **Logger Tests** (`__tests__/logger.test.js`)
Tests for logging functionality:
- Log output format
- Message inclusion
- Timestamp handling
- Special character handling

**Key Tests:**
- Logs include event type
- Logs include message
- Timestamp is present
- Format includes separators

### 7. **Events Tests** (`__tests__/events.test.js`)
Tests for event constant definitions:
- Event constant existence
- Naming consistency
- Uniqueness
- Proper values

**Events Tested:**
- CLAIM_FILED
- CLAIM_STATUS_UPDATED
- FRAUD_SCORE_GENERATED
- POLICY_RENEWAL_DUE
- PREMIUM_PAYMENT_RECEIVED
- CLAIM_SETTLED

## Test Coverage

### Current Coverage Targets
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Generate Coverage Report
```bash
npm test -- --coverage
```

This creates a `coverage/` directory with detailed coverage information.

## Mocking Strategy

### Mocked Modules
1. **Socket.IO** - Mocked in socket tests
2. **Notification Service** - Mocked in route tests
3. **Logger** - Mocked to prevent console spam
4. **Node-cron** - Mocked in scheduler tests

### Mock Examples

#### Mock Socket.IO
```javascript
jest.mock('../src/config/socket');
const { getIO } = require('../src/config/socket');

getIO.mockReturnValue(mockIOInstance);
```

#### Mock Notification Service
```javascript
jest.mock('../src/services/notificationService');
const { sendNotification } = require('../src/services/notificationService');

sendNotification.mockClear();
```

## Common Test Patterns

### Testing HTTP Endpoints
```javascript
const response = await request(app)
  .post('/notify/claim-filed')
  .send({
    message: 'Test',
    claimId: 'CLM001'
  });

expect(response.status).toBe(200);
expect(response.body.success).toBe(true);
```

### Testing Socket Emissions
```javascript
expect(mockIO.to).toHaveBeenCalledWith('room');
expect(mockSocket.emit).toHaveBeenCalledWith(event, payload);
```

### Testing Async Callbacks
```javascript
const callback = mockSchedule.mock.calls[0][1];
callback();
expect(sendNotification).toHaveBeenCalled();
```

## Debugging Tests

### Run Single Test
```bash
npm test -- __tests__/app.test.js --testNamePattern="should return success"
```

### Run with Verbose Output
```bash
npm test -- --verbose
```

### Debug in Node
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome browser.

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
```

## Best Practices

1. **Use Descriptive Names** - Test names should clearly describe what is being tested
2. **Arrange-Act-Assert** - Follow AAA pattern in tests
3. **Mock External Dependencies** - Keep tests isolated and fast
4. **Test Edge Cases** - Include tests for error scenarios
5. **Keep Tests DRY** - Use beforeEach for common setup
6. **One Assertion per Test** - Generally, keep tests focused
7. **Clean Up** - Use afterEach for cleanup

## Troubleshooting

### Tests Timing Out
- Increase Jest timeout: `jest.setTimeout(10000)`
- Check for unresolved promises

### Mock Not Working
- Ensure mock is before import: `jest.mock()` before `require()`
- Reset mocks between tests: `jest.clearAllMocks()`

### Socket.IO Tests Failing
- Ensure Socket.IO is mocked before app imports
- Clear mocks between tests

### Cron Tests Failing
- Verify node-cron is mocked
- Check that callbacks are captured correctly

## Performance

- Total test suite runs in ~2-5 seconds
- Tests are isolated and can run in parallel
- No external dependencies required (all mocked)

## Future Improvements

1. Add integration tests with real Socket.IO
2. Add performance/load tests
3. Add end-to-end tests
4. Increase coverage targets to 80%+
5. Add mutation testing
6. Add snapshot testing for complex payloads
