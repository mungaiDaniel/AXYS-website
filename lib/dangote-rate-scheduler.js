import connectDB from '@/lib/mongodb';
import DangoteRateCache from '@/models/DangoteRateCache';
import { DANGOTE_CALCULATOR_CONFIG } from '@/lib/dangote-share-calculator';
import { fetchUsdNgnRate, refreshCachedRate } from '@/lib/dangote-rate-service';

const CACHE_ID = 'USD_NGN';
const SCHEDULER_KEY = Symbol.for('aib-axys.dangote-usd-ngn-rate-scheduler');
const LOCK_DURATION_MS = 30 * 1000;

async function readCachedRate() {
  await connectDB();
  return DangoteRateCache.findById(CACHE_ID).lean();
}

async function acquireRefreshLock() {
  await connectDB();
  const now = new Date();
  const lockUntil = new Date(now.getTime() + LOCK_DURATION_MS);
  const nextRefreshAt = new Date(
    now.getTime() + DANGOTE_CALCULATOR_CONFIG.RATE_REFRESH_INTERVAL_MINUTES * 60 * 1000,
  );

  try {
    const lock = await DangoteRateCache.findOneAndUpdate(
      {
        _id: CACHE_ID,
        $and: [
          { $or: [{ lockUntil: { $exists: false } }, { lockUntil: { $lte: now } }] },
          { $or: [{ nextRefreshAt: { $exists: false } }, { nextRefreshAt: { $lte: now } }] },
        ],
      },
      { $set: { lockUntil, nextRefreshAt } },
      { upsert: true, new: true },
    ).lean();

    if (!lock) return null;
    return {
      release: () => DangoteRateCache.updateOne(
        { _id: CACHE_ID, lockUntil },
        { $unset: { lockUntil: 1 } },
      ),
    };
  } catch (error) {
    if (error.code === 11000) return null;
    throw error;
  }
}

async function runScheduledRefresh() {
  await connectDB();
  return refreshCachedRate({
    acquireLock: acquireRefreshLock,
    fetchRate: fetchUsdNgnRate,
    readCachedRate,
    saveRate: async ({ rate, source, provider, fetchedAt }) => {
      await DangoteRateCache.updateOne(
        { _id: CACHE_ID },
        { $set: { rate, source, provider, fetchedAt } },
        { upsert: true },
      );
      return readCachedRate();
    },
  });
}

export function startDangoteRateScheduler() {
  if (globalThis[SCHEDULER_KEY]) return globalThis[SCHEDULER_KEY];

  const intervalMs = DANGOTE_CALCULATOR_CONFIG.RATE_REFRESH_INTERVAL_MINUTES * 60 * 1000;
  const state = { timer: null, refreshPromise: null };
  const refresh = () => {
    if (state.refreshPromise) return state.refreshPromise;
    state.refreshPromise = runScheduledRefresh().finally(() => {
      state.refreshPromise = null;
    });
    return state.refreshPromise;
  };

  state.timer = setInterval(() => refresh().catch(() => {}), intervalMs);
  state.timer.unref?.();
  state.refresh = refresh;
  // Keep a handle to the initial attempt so Next.js instrumentation can wait
  // for cache warm-up before the server starts accepting requests.
  state.initialRefreshPromise = refresh();
  globalThis[SCHEDULER_KEY] = state;
  state.initialRefreshPromise.catch(() => {});
  return state;
}
