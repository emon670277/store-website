// Number and Currency Formatting Utilities

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString('en-US')}`;
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

export const PAYMENT_LOGOS = {
  bkash: 'https://i.postimg.cc/y8LddgcQ/image.png',
  nagad: 'https://i.postimg.cc/YSVC65Xv/image.png',
  binance: 'https://i.postimg.cc/vHMHtLvJ/image.png',
  btc: 'https://i.postimg.cc/Sx1Sq0b7/image.png',
  ltc: 'https://i.postimg.cc/LsqH8yHY/image.png',
  website: 'https://i.postimg.cc/h4NZkpY8/image.png'
};
