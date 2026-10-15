import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDangoteShares,
  getDefaultProcessingFee,
  getFormattedResultBoxes,
  formatCalculatorNumber,
} from './dangote-share-calculator.js';

test('treats empty additional costs as zero', () => {
  const result = calculateDangoteShares('1000', '1500', getDefaultProcessingFee('1000'), '', '', '');

  assert.equal(result.processingFeeUsd, '20.000000000000');
  assert.equal(result.bankChargesUsd, '0.000000000000');
  assert.equal(result.fxChargesUsd, '0.000000000000');
  assert.equal(result.otherCostsUsd, '0.000000000000');
  assert.equal(result.totalCostUsd, '20.000000000000');
});

test('calculates entered charges with exact decimal arithmetic', () => {
  const result = calculateDangoteShares('1000', '1500', getDefaultProcessingFee('1000'), '10', '5', '3');

  assert.equal(result.processingFeeUsd, '20.000000000000');
  assert.equal(result.totalCostUsd, '38.000000000000');
  assert.equal(result.netConsiderationUsd, '962.000000000000');
  assert.equal(result.netConsiderationNgn, '1443000.000000000000');
  assert.equal(result.numberOfShares, '2748.571428571428');
  assert.deepEqual(getFormattedResultBoxes(result), {
    totalCostUsd: 'USD 38.00',
    netConsiderationUsd: 'USD 962.00',
    netConsiderationNgn: 'NGN 1,443,000.00',
    pricePerShareNgn: 'NGN 525.00',
    numberOfShares: '2,748',
  });
});

test('keeps all result boxes blank and returns an error for costs at least equal to the investment', () => {
  let errorMessage = '';
  try {
    calculateDangoteShares('1000', '1500', '20', '980', '0', '0');
  } catch (error) {
    errorMessage = error.message;
  }

  assert.deepEqual(getFormattedResultBoxes(null), {
    totalCostUsd: '\u2014',
    netConsiderationUsd: '\u2014',
    netConsiderationNgn: '\u2014',
    pricePerShareNgn: '\u2014',
    numberOfShares: '\u2014',
  });
  assert.match(errorMessage, /Total charges must be less than the amount invested/);
});

test('calculates an overridden processing fee', () => {
  const result = calculateDangoteShares('1000', '1500', '15', '10', '5', '0');

  assert.equal(result.processingFeeUsd, '15.000000000000');
  assert.equal(result.totalCostUsd, '30.000000000000');
  assert.equal(result.netConsiderationUsd, '970.000000000000');
  assert.equal(result.netConsiderationNgn, '1455000.000000000000');
  assert.equal(result.numberOfShares, '2771.428571428571');
});

test('rounds the automatic processing fee to two decimals using decimal arithmetic', () => {
  assert.equal(getDefaultProcessingFee('2000'), '40.00');
  assert.equal(getDefaultProcessingFee('10.99'), '0.22');
});

test('displays whole share counts by removing decimals without rounding', () => {
  assert.equal(formatCalculatorNumber('2748.999', 0, 0), '2,748');
});

test('rejects non-positive amounts and rates', () => {
  assert.throws(() => calculateDangoteShares('0', '1500'), /greater than zero/);
  assert.throws(() => calculateDangoteShares('100', '-1'), /valid positive number/);
});

test('rejects charges that exceed the investment', () => {
  assert.throws(() => calculateDangoteShares('100', '1500', '2', '98'), /must be less than/);
  assert.throws(() => calculateDangoteShares('100', '1500', '2', '-1'), /valid positive number/);
});
