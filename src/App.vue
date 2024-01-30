<template>
  <OrderBook v-for="(item, index) in symbolList" :key="`orderBook${index}`" :symbol="item" />
</template>

<script setup>
import { initWebsocket } from '@/utils/ws'
import { storeToRefs } from 'pinia'
import { useOrderBookStore } from '@/stores/orderBook'
import OrderBook from './components/OrderBook.vue'
const orderBookStore = useOrderBookStore()
const { symbolList, requestNum } = storeToRefs(orderBookStore)
// subscribe to order book
initWebsocket({
  id: 1,
  method: 'subscribe',
  params: {
    channels: symbolList.value.map((item) => `book.${item}.${requestNum.value}`)
  },
  nonce: 1654784123465
})
</script>

<style>
#app {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  font-size: 1.6rem;
}
</style>
