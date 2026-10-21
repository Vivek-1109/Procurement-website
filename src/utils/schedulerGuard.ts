/**
 * Defensive Scheduler & Idle Callback Guard
 * 
 * Prevents runtime errors like:
 * "TypeError: Cannot read properties of undefined (reading 'startTime')"
 * 
 * Cause: Browser extensions (e.g. et.reportAllChanges, dev tools scripts) or external analytics
 * monkey-patch window.requestIdleCallback and trigger callbacks when React Scheduler's task queue is empty.
 * 
 * Solution:
 * 1. Safely wrap window.requestIdleCallback to isolate callback errors.
 * 2. Ensure fallback idle scheduling if external scripts corrupt native timers.
 */

if (typeof window !== 'undefined') {
  const nativeRequestIdle = window.requestIdleCallback;

  window.requestIdleCallback = function (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ): number {
    const guardedCallback: IdleRequestCallback = (deadline) => {
      try {
        callback(deadline);
      } catch (err) {
        if (err instanceof TypeError && (err.message.includes('startTime') || err.message.includes('undefined'))) {
          console.warn('[SchedulerGuard] Prevented React Scheduler task queue crash from external script:', err.message);
        } else {
          console.error('[SchedulerGuard] Unhandled error in idle callback:', err);
        }
      }
    };

    if (typeof nativeRequestIdle === 'function') {
      try {
        return nativeRequestIdle.call(window, guardedCallback, options);
      } catch {
        // Fall back to setTimeout if native call throws
      }
    }

    const start = Date.now();
    return (window.setTimeout(() => {
      guardedCallback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1) as unknown) as number;
  };

  if (typeof window.cancelIdleCallback !== 'function') {
    const nativeCancelIdle = window.cancelIdleCallback;
    window.cancelIdleCallback = function (id: number) {
      if (typeof nativeCancelIdle === 'function') {
        try {
          nativeCancelIdle.call(window, id);
          return;
        } catch {
          // Fall back to clearTimeout
        }
      }
      clearTimeout(id);
    };
  }
}

export {};
