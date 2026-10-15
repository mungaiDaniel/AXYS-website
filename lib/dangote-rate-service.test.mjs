import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  fetchUsdNgnRate,
  getCachedRateResponse,
  refreshCachedRate,
  validateLiveRate,
} from './dangote-rate-service.js';

test('refresh saves a validated live rate', async () => {
  let saved;
  const record = await refreshCachedRate({
    acquireLock: async () => ({ release: async () => {} }),
    fetchRate: async () => ({ rate: 1500.25, source: 'open.er-api.com' }),
    readCachedRate: async () => saved,
    saveRate: async (value) => (saved = value),
    logger: { error() {} },
    now: () => new Date('2026-09-30T10:00:00.000Z'),
  });
  assert.equal(record.rate, 1500.25);
  assert.equal(record.source, 'live');
  assert.equal(record.provider, 'open.er-api.com');
  assert.equal(record.fetchedAt.toISOString(), '2026-09-30T10:00:00.000Z');
});

test('failed refresh keeps the last known good cached rate', async () => {
  const lastKnown = { rate: 1500, source: 'live', fetchedAt: new Date('2026-09-29T00:00:00.000Z') };
  let writes = 0;
  const record = await refreshCachedRate({
    acquireLock: async () => ({ release: async () => {} }),
    fetchRate: async () => { throw new Error('provider unavailable'); },
    readCachedRate: async () => lastKnown,
    saveRate: async () => { writes += 1; },
    logger: { error() {} },
  });
  assert.equal(record, lastKnown);
  assert.equal(writes, 0);
});

test('rejects zero, negative, NaN, missing, and nonnumeric rates', () => {
  for (const rate of [0, -1, NaN, undefined, '1500']) {
    assert.throws(() => validateLiveRate(rate), /greater than zero/);
  }
});

test('invalid provider values do not replace an existing cache record', async () => {
  const lastKnown = { rate: 1500, source: 'live', fetchedAt: new Date('2026-09-29T00:00:00.000Z') };
  for (const invalidRate of [0, -1, NaN, undefined]) {
    let writes = 0;
    const record = await refreshCachedRate({
      acquireLock: async () => ({ release: async () => {} }),
      fetchRate: async () => ({ rate: invalidRate, source: 'test-provider' }),
      readCachedRate: async () => lastKnown,
      saveRate: async () => { writes += 1; },
      logger: { error() {} },
    });
    assert.equal(record, lastKnown);
    assert.equal(writes, 0);
  }
});

test('falls back from the primary provider and validates either response', async () => {
  const requested = [];
  const result = await fetchUsdNgnRate(async (url) => {
    requested.push(url);
    if (requested.length === 1) throw new Error('primary failed');
    return { ok: true, json: async () => ({ usd: { ngn: 1510 } }) };
  });
  assert.equal(result.rate, 1510);
  assert.equal(result.source, 'currency-api');
  assert.equal(requested.length, 2);
});

test('cached endpoint response reads cache and does not call external providers', async () => {
  let reads = 0;
  const response = await getCachedRateResponse(async () => {
    reads += 1;
    return { rate: 1500, fetchedAt: new Date('2026-09-30T10:00:00.000Z') };
  });
  assert.deepEqual(response, {
    status: 200,
    body: { rate: 1500, source: 'live', updatedAt: '2026-09-30T10:00:00.000Z' },
  });
  assert.equal(reads, 1);

  const route = await readFile(new URL('../app/api/exchange-rate/route.js', import.meta.url), 'utf8');
  assert.doesNotMatch(route, /fetch\s*\(|open\.er-api|currency-api/);
});

test('empty endpoint cache returns a manual-entry error status', async () => {
  const response = await getCachedRateResponse(async () => null);
  assert.equal(response.status, 503);
  assert.match(response.body.error, /Enter a rate manually/);
});
