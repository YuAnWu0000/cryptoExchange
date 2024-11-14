import { defineStore } from 'pinia'

export const useOrderBookStore = defineStore('orderBook', {
  state: () => ({
    symbolList: ['BTCUSD-PERP', 'ETHUSD-PERP', 'SOL_USDT', 'SUI_USDT', 'TIA_USDT', 'XRP_USDT'],
    requestNum: 10, // 50 by default
    orderBook: new Map(),
    displayNum: 5
  }),
  actions: {
    setOrderBook(symbol, book) {
      this.orderBook.set(symbol, book)
      // console.log(orderBook)
    }
  }
})
