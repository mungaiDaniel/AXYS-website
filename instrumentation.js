export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PHASE !== 'phase-production-build') {
    const { startDangoteRateScheduler } = await import('./lib/dangote-rate-scheduler.js');
    const scheduler = startDangoteRateScheduler();
    try {
      await scheduler.initialRefreshPromise;
    } catch (error) {
      // A rate-provider or database outage should not prevent the site from
      // starting. The API route will report the unavailable cache to clients.
      console.error('Initial Dangote USD/NGN rate refresh failed:', error.message || error);
    }
  }
}
