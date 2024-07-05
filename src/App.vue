<template>
  <Candles symbol="BTCUSD-PERP" />
  <div class="order-books-wrapper">
    <OrderBook v-for="(item, index) in symbolList" :key="`orderBook${index}`" :symbol="item" />
  </div>
</template>

<script setup>
// import { initWebsocket } from '@/utils/ws'
import { storeToRefs } from 'pinia'
import { useWebsocketStore } from '@/stores/ws'
import { useOrderBookStore } from '@/stores/orderBook'
import Candles from '@/components/Candles.vue'
import OrderBook from '@/components/OrderBook.vue'
const websocketStore = useWebsocketStore()
const orderBookStore = useOrderBookStore()
const { symbolList, requestNum } = storeToRefs(orderBookStore)
// subscribe to order book
websocketStore.initWebsocket({
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
  font-size: 1.6rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .order-books-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }
}
</style>
