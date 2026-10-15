import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  applyCachedLiveRate,
  editRateValue,
  preserveRateAfterFailure,
  rateDiffersFromLive,
  resetRateToLive,
} from './dangote-rate-state.js';

test('initial cached live response prefills the rate box', () => {
  const state = applyCachedLiveRate({
    currentBoxValue: '',
    manualOverride: false,
    nextRate: '1500.125',
  });
  assert.equal(state.liveRate, '1500.125');
  assert.equal(state.boxValue, '1500.125');
});

test('a cached rate update replaces an untouched live value', () => {
  const state = applyCachedLiveRate({
    currentBoxValue: '1500',
    manualOverride: false,
    nextRate: '1510',
  });
  assert.equal(state.boxValue, '1510');
});

test('a cached response never replaces a manual override', () => {
  const override = editRateValue('1495', '1500');
  const refreshed = applyCachedLiveRate({
    currentBoxValue: override.boxValue,
    manualOverride: override.manualOverride,
    nextRate: '1510',
  });
  assert.equal(refreshed.boxValue, '1495');
  assert.equal(rateDiffersFromLive(refreshed.boxValue, refreshed.liveRate), true);
});

test('reset returns to the latest live rate', () => {
  const state = resetRateToLive('1510');
  assert.deepEqual(state, { boxValue: '1510', manualOverride: false });
});

test('a failed refresh preserves the last known or manually entered value', () => {
  assert.deepEqual(preserveRateAfterFailure('', '1500'), {
    boxValue: '1500',
    message: 'Live rate unavailable. Using last known rate / enter a rate manually.',
  });
  assert.equal(preserveRateAfterFailure('1495', '1500').boxValue, '1495');
  assert.equal(preserveRateAfterFailure('', null).boxValue, '');
});

test('calculator loads the rate once on mount and has no front-end polling', async () => {
  const source = await readFile(new URL('../app/ipo/share-calculator/page.js', import.meta.url), 'utf8');
  assert.equal((source.match(/fetch\('\/api\/exchange-rate'/g) || []).length, 1);
  assert.match(source, /useEffect\(\(\) => \{[\s\S]*?readCachedRate\(\)[\s\S]*?\}, \[\]\)/);
  assert.doesNotMatch(source, /setInterval|visibilitychange|Refresh rate|Exchange rate has updated/);
});
