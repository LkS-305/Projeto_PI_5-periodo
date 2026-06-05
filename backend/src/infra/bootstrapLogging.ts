import { logError } from '../core/utils/httpLogger';

process.on('unhandledRejection', (reason: unknown) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logError('process.unhandled_rejection', err, {});
});

process.on('uncaughtException', (err: Error) => {
  logError('process.uncaught_exception', err, {});
  process.exit(1);
});
