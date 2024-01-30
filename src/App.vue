<template>
  <OrderBook symbol="BTCUSD-PERP" />
  <OrderBook symbol="ETHUSD-PERP" />
</template>

<script setup>
import { initWebsocket } from '@/utils/ws'
import OrderBook from './components/OrderBook.vue'
initWebsocket({
  id: 5566,
  method: 'subscribe',
  params: {
    channels: ['book.BTCUSD-PERP.10', 'book.ETHUSD-PERP.10']
  },
  nonce: 1654784123465
})
</script>

<style>
#app {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  font-size: 1.6rem;
}
</style>
