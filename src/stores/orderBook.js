import { defineStore } from 'pinia'

export const useOrderBookStore = defineStore('orderBook', {
  state: () => ({ orderBook: new Map() }),
  actions: {
    setOrderBook(symbol, book) {
      this.orderBook.set(symbol, book)
      // console.log(orderBook)
    }
  }
})
