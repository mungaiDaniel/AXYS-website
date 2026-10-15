function normalizeRate(value) {
  const text = String(value ?? '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(text)) return text;
  const [whole, fraction = ''] = text.split('.');
  return `${whole.replace(/^0+(?=\d)/, '') || '0'}${fraction.replace(/0+$/, '') ? `.${fraction.replace(/0+$/, '')}` : ''}`;
}

export function applyCachedLiveRate({ currentBoxValue, manualOverride, nextRate }) {
  return {
    liveRate: nextRate,
    boxValue: manualOverride ? currentBoxValue : nextRate,
    manualOverride,
  };
}

export function editRateValue(value, liveRate) {
  const manualOverride = value !== '';
  return {
    boxValue: manualOverride ? value : liveRate || '',
    manualOverride,
  };
}

export function resetRateToLive(liveRate) {
  return { boxValue: liveRate || '', manualOverride: false };
}

export function rateDiffersFromLive(boxValue, liveRate) {
  return Boolean(boxValue && liveRate) && normalizeRate(boxValue) !== normalizeRate(liveRate);
}

export function preserveRateAfterFailure(currentBoxValue, lastKnownRate) {
  return {
    boxValue: currentBoxValue || lastKnownRate || '',
    message: lastKnownRate
      ? 'Live rate unavailable. Using last known rate / enter a rate manually.'
      : 'Live rate unavailable. Enter a rate manually.',
  };
}
