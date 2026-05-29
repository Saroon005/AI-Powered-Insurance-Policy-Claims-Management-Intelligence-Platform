# Quick Test Reference

## Run Tests
```bash
npm test
```

## Watch Mode (auto-rerun on file changes)
```bash
npm run test:watch
```

## Coverage Report
```bash
npm test -- --coverage
```

## Single Test File
```bash
npm test -- __tests__/app.test.js
```

## Specific Test by Name
```bash
npm test -- --testNamePattern="claim-filed"
```

## Verbose Output
```bash
npm test -- --verbose
```

## Debug Tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```
Then open `chrome://inspect` in Chrome

---

## Test Files at a Glance

| Test | Count | What It Tests |
|------|-------|---------------|
| `__tests__/app.test.js` | 7 | Express setup, middleware |
| `__tests__/notificationRoutes.test.js` | 15 | API endpoints (claim-filed, status-update, fraud-score) |
| `__tests__/notificationService.test.js` | 6 | Core notification sending |
| `__tests__/socket.test.js` | 4 | Socket.IO initialization |
| `__tests__/renewalScheduler.test.js` | 7 | Cron job scheduling |
| `__tests__/logger.test.js` | 9 | Logging functionality |
| `__tests__/events.test.js` | 7 | Event constant definitions |

**Total: 55+ test cases**

---

## Key Features Tested

✅ API Endpoints (POST /notify/*)
✅ Socket.IO Real-time Notifications
✅ Cron Scheduling (30-second renewal reminders)
✅ Error Handling
✅ Concurrent Requests
✅ Payload Validation
✅ Event Routing
✅ Logging

---

## Installation Required

```bash
npm install
```

This installs:
- **jest** - Test framework
- **supertest** - HTTP testing
- **socket.io-client** - Socket testing

---

See [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md) for complete guide.
