import { defineStore } from 'pinia'

export const useCandleStore = defineStore('candle', {
  state: () => ({
    symbol: 'BTCUSD-PERP',
    timeFrame: '1m',
    candles: []
  }),
  actions: {
    setCandles(symbol, candles) {
      this.symbol = symbol
      this.candles = candles
    },
    updateCandles(candles) {
      let len = this.candles.length
      if (len > 0 && this.candles[len - 1]['t'] === candles[0]['t'])
        this.candles[len - 1] = candles[0]
      else this.candles = this.candles.concat(candles)
    },
    setTimeFrame(timeFrame) {
      if (!(timeFrame in TIME_FRAME_MAP)) {
        console.log('Set timeframe error: ', timeFrame)
        return
      }
      this.timeFrame = timeFrame
    }
  }
})
const TIME_FRAME_MAP = {
  '1m': 'one minute. (Legacy format: M1)',
  '5m': 'five minutes. (Legacy format: M5)',
  '15m': '15 minutes. (Legacy format: M15)',
  '30m': '30 minutes. (Legacy format: M30)',
  '1h': 'one hour. (Legacy format: H1)',
  '2h': 'two hours. (Legacy format: H2)',
  '4h': '4 hours. (Legacy format: H4)',
  '12h': '12 hours. (Legacy format: H12)',
  '1D': 'one day. (Legacy format: D1 and 1d)',
  '7D': '1 week starting at 00:00 UTC each Monday',
  '14D': '2 week intervals starting at Monday, Oct-28-2019, 00:00 UTC',
  '1M': '1 month starting at first day of each calendar month, 00:00 UTC'
}
