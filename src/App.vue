<template>
  <HelloWorld msg="You did it!" />
  {{ msg }}
</template>

<script setup>
import { storeToRefs } from 'pinia'
import HelloWorld from './components/HelloWorld.vue'
import { useWsStore } from '@/stores/ws'
import { initWebsocket } from './utils/ws.js'
initWebsocket({
  id: 1,
  method: 'subscribe',
  params: {
    channels: ['book.BTCUSD-PERP.10']
  },
  nonce: 1654784123465
})
const wsStore = useWsStore()
const { msg } = storeToRefs(wsStore)
</script>

<style scoped>
#app {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  font-size: 1.6rem;
}
</style>
