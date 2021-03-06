import { BigNumber } from 'bignumber.js';
const BN = require('bn.js');

export const toFixedTrunc = (x, n) => {
  const v = (typeof x === 'string' ? x : x.toString()).split('.');
  if (n <= 0) return v[0];
  let f = v[1] || '';
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
  while (f.length < n) f += '0';
  return `${v[0]}.${f}`;
};

export const priceNumberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 10,
  useGrouping: true,
});

export const balanceNumberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 6,
  useGrouping: true,
});

export const inputNumberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 20,
  useGrouping: false,
});

export const valueToDecimals = (value: string, decimals: string): string => {
  return BigInt(
    parseFloat(value) * Math.pow(10, parseInt(decimals)),
  ).toString();
};

export const zeroDecimalsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatZeroDecimals(value: number | string) {
  return zeroDecimalsFormatter.format(Number(value));
}

const twoDecimalsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const sixDecimalsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});

export function formatWithTwoDecimals(value: number | string) {
  return twoDecimalsFormatter.format(Number(value));
}

export function formatWithSixDecimals(value: number | string) {
  return sixDecimalsFormatter.format(Number(value));
}

export function formatWithTwoDecimalsRub(value: number) {
  return `${formatWithTwoDecimals(value)} ₽`;
}

export function ones(value: number | string) {
  return Number(value) / 1e18;
}

export function truncateAddressString(address: string, num = 12) {
  if (!address) {
    return '';
  }

  const first = address.slice(0, num);
  const last = address.slice(-num);
  return `${first}...${last}`;
}

export const mulDecimals = (
  amount: string | number,
  decimals: string | number,
) => {
  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`;
  const amountStr = new BigNumber(amount).multipliedBy(decimalsMul);

  return new BN(amountStr.toFixed());
};

export const divDecimals = (
  amount: string | number,
  decimals: string | number,
) => {
  if (decimals === 0) {
    return String(amount);
  }

  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`;
  const amountStr = new BigNumber(amount).dividedBy(decimalsMul);

  return amountStr.toFixed();
};
