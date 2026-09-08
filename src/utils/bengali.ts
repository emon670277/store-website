// Bengali digits mapping
const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  if (num === undefined || num === null) return '';
  const str = typeof num === 'number' ? num.toLocaleString('en-US') : num.toString();
  return str.replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function formatBengaliPrice(price: number): string {
  return `৳${toBengaliNumber(price)}`;
}

export function calculateCryptoEquivalent(
  priceBDT: number,
  method: 'binance' | 'btc' | 'ltc',
  rates: { bdtToUsdRate: number; btcUsdPrice: number; ltcUsdPrice: number }
): { fiatUsd: string; cryptoAmount: string; coinSymbol: string; formattedDisplay: string } {
  const usdVal = priceBDT / (rates.bdtToUsdRate || 122);
  const fiatUsdStr = usdVal.toFixed(2);

  if (method === 'binance') {
    return {
      fiatUsd: fiatUsdStr,
      cryptoAmount: fiatUsdStr,
      coinSymbol: 'USDT',
      formattedDisplay: `$${fiatUsdStr} USDT`,
    };
  }

  if (method === 'btc') {
    const btcAmount = usdVal / (rates.btcUsdPrice || 92000);
    const formattedBtc = btcAmount.toFixed(6);
    return {
      fiatUsd: fiatUsdStr,
      cryptoAmount: formattedBtc,
      coinSymbol: 'BTC',
      formattedDisplay: `${formattedBtc} BTC (≈ $${fiatUsdStr})`,
    };
  }

  if (method === 'ltc') {
    const ltcAmount = usdVal / (rates.ltcUsdPrice || 95);
    const formattedLtc = ltcAmount.toFixed(4);
    return {
      fiatUsd: fiatUsdStr,
      cryptoAmount: formattedLtc,
      coinSymbol: 'LTC',
      formattedDisplay: `${formattedLtc} LTC (≈ $${fiatUsdStr})`,
    };
  }

  return {
    fiatUsd: fiatUsdStr,
    cryptoAmount: fiatUsdStr,
    coinSymbol: 'USDT',
    formattedDisplay: `$${fiatUsdStr}`,
  };
}
