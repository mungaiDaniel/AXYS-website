// Keep all fee and share-price settings together for easy staff updates.
// TODO: Replace the placeholder fixed charges with the approved figures.
export const DANGOTE_CALCULATOR_CONFIG = Object.freeze({
  PROCESSING_FEE_PERCENT: '2',
  BANK_CHARGES_USD: '0',
  FX_CHARGES_USD: '0',
  OTHER_COSTS_USD: '0',
  PRICE_PER_SHARE_NGN: '525',
  RATE_REFRESH_INTERVAL_MINUTES: 60,
});

const SCALE_DIGITS = 12;
const SCALE = 10n ** BigInt(SCALE_DIGITS);

function toUnits(value, label) {
  const text = String(value ?? '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(text)) throw new Error(`${label} must be a valid positive number.`);
  const [whole, fraction = ''] = text.split('.');
  if (fraction.length > SCALE_DIGITS) throw new Error(`${label} supports up to ${SCALE_DIGITS} decimal places.`);
  return BigInt(whole) * SCALE + BigInt((fraction + '0'.repeat(SCALE_DIGITS)).slice(0, SCALE_DIGITS));
}

function unitsToDecimal(units, places = SCALE_DIGITS) {
  const negative = units < 0n;
  const absolute = negative ? -units : units;
  const divisor = 10n ** BigInt(SCALE_DIGITS - places);
  const truncated = absolute / divisor;
  const whole = truncated / (10n ** BigInt(places));
  const fraction = places ? (truncated % (10n ** BigInt(places))).toString().padStart(places, '0') : '';
  return `${negative ? '-' : ''}${whole}${places ? `.${fraction}` : ''}`;
}

export function getDefaultProcessingFee(amountUsdInput) {
  try {
    const amountUsd = toUnits(amountUsdInput || '0', 'USD amount');
    const fee = amountUsd * BigInt(DANGOTE_CALCULATOR_CONFIG.PROCESSING_FEE_PERCENT) / 100n;
    const centUnits = 10n ** BigInt(SCALE_DIGITS - 2);
    const roundedCents = (fee + centUnits / 2n) / centUnits;
    return unitsToDecimal(roundedCents * centUnits, 2);
  } catch {
    return '0.00';
  }
}

export function calculateDangoteShares(
  amountUsdInput,
  exchangeRateInput,
  processingFeeInput = getDefaultProcessingFee(amountUsdInput),
  bankChargesInput = DANGOTE_CALCULATOR_CONFIG.BANK_CHARGES_USD,
  fxCostInput = DANGOTE_CALCULATOR_CONFIG.FX_CHARGES_USD,
  otherCostsInput = DANGOTE_CALCULATOR_CONFIG.OTHER_COSTS_USD,
) {
  const amountUsd = toUnits(amountUsdInput, 'USD amount');
  const exchangeRate = toUnits(exchangeRateInput, 'Exchange rate');
  if (amountUsd <= 0n) throw new Error('Enter a USD amount greater than zero.');
  if (exchangeRate <= 0n) throw new Error('Enter an exchange rate greater than zero.');

  const processingFee = toUnits(processingFeeInput, 'Processing fee');
  const bankCharges = toUnits(bankChargesInput === '' ? '0' : bankChargesInput, 'Bank charges');
  const fxCharges = toUnits(fxCostInput === '' ? '0' : fxCostInput, 'FX cost');
  const otherCosts = toUnits(otherCostsInput === '' ? '0' : otherCostsInput, 'Other costs');
  const totalCost = processingFee + bankCharges + fxCharges + otherCosts;
  if (totalCost >= amountUsd) throw new Error('Total charges must be less than the amount invested.');

  const netUsd = amountUsd - totalCost;
  const netNgn = netUsd * exchangeRate / SCALE;
  const pricePerShare = toUnits(DANGOTE_CALCULATOR_CONFIG.PRICE_PER_SHARE_NGN, 'Share price');
  // Keep the result to 12 decimal places using integer arithmetic; presentation can show 6.
  const shares = netNgn * SCALE / pricePerShare;

  return {
    amountUsd: unitsToDecimal(amountUsd),
    processingFeeUsd: unitsToDecimal(processingFee),
    bankChargesUsd: unitsToDecimal(bankCharges),
    fxChargesUsd: unitsToDecimal(fxCharges),
    otherCostsUsd: unitsToDecimal(otherCosts),
    totalCostUsd: unitsToDecimal(totalCost),
    netConsiderationUsd: unitsToDecimal(netUsd),
    exchangeRate: unitsToDecimal(exchangeRate),
    netConsiderationNgn: unitsToDecimal(netNgn),
    pricePerShareNgn: unitsToDecimal(pricePerShare),
    numberOfShares: unitsToDecimal(shares),
  };
}

export function formatCalculatorNumber(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
  const [whole, fraction = ''] = String(value).split('.');
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const roundedFraction = fraction.slice(0, maximumFractionDigits).padEnd(minimumFractionDigits, '0');
  const visibleFraction = roundedFraction.replace(/0+$/, '').padEnd(minimumFractionDigits, '0');
  return `${groupedWhole}${visibleFraction ? `.${visibleFraction}` : ''}`;
}

export function getFormattedResultBoxes(result) {
  if (!result) {
    return {
      totalCostUsd: '\u2014',
      netConsiderationUsd: '\u2014',
      netConsiderationNgn: '\u2014',
      pricePerShareNgn: '\u2014',
      numberOfShares: '\u2014',
    };
  }

  return {
    totalCostUsd: `USD ${formatCalculatorNumber(result.totalCostUsd)}`,
    netConsiderationUsd: `USD ${formatCalculatorNumber(result.netConsiderationUsd)}`,
    netConsiderationNgn: `NGN ${formatCalculatorNumber(result.netConsiderationNgn)}`,
    pricePerShareNgn: `NGN ${formatCalculatorNumber(result.pricePerShareNgn)}`,
    numberOfShares: formatCalculatorNumber(result.numberOfShares, 0, 0),
  };
}
