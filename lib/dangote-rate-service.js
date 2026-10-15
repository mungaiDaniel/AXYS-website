export function validateLiveRate(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error('USD/NGN rate must be a finite number greater than zero.');
  }
  return value;
}

export async function fetchUsdNgnRate(fetchImpl = fetch) {
  const sources = [
    {
      name: 'open.er-api.com',
      url: 'https://open.er-api.com/v6/latest/USD',
      getRate: (payload) => payload.rates?.NGN,
    },
    {
      name: 'currency-api',
      url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      getRate: (payload) => payload.usd?.ngn,
    },
  ];
  const failures = [];

  for (const source of sources) {
    try {
      const response = await fetchImpl(source.url, { signal: AbortSignal.timeout(5000), cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      return { rate: validateLiveRate(source.getRate(payload)), source: source.name };
    } catch (error) {
      failures.push(`${source.name}: ${error.message}`);
    }
  }

  throw new Error(`All USD/NGN rate sources failed (${failures.join('; ')})`);
}

export async function refreshCachedRate({ acquireLock, fetchRate, readCachedRate, saveRate, logger = console, now = () => new Date() }) {
  let lock;
  try {
    lock = await acquireLock();
    if (!lock) return await readCachedRate();

    const fetched = await fetchRate();
    const rate = validateLiveRate(fetched?.rate);
    return await saveRate({ rate, source: 'live', fetchedAt: now(), provider: fetched.source });
  } catch (error) {
    logger.error('Dangote USD/NGN rate refresh failed:', error.message || error);
    return readCachedRate();
  } finally {
    if (lock?.release) {
      try {
        await lock.release();
      } catch (error) {
        logger.error('Dangote USD/NGN refresh lock release failed:', error.message || error);
      }
    }
  }
}

export async function getCachedRateResponse(readCachedRate) {
  const cached = await readCachedRate();
  if (!cached || typeof cached.rate !== 'number' || !Number.isFinite(cached.rate) || cached.rate <= 0 || !cached.fetchedAt) {
    return {
      status: 503,
      body: { error: 'The live USD/NGN rate is not available. Enter a rate manually to continue.' },
    };
  }

  return {
    status: 200,
    body: { rate: cached.rate, source: 'live', updatedAt: new Date(cached.fetchedAt).toISOString() },
  };
}
