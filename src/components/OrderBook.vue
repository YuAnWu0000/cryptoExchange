<template>
  <div v-if="bids && asks" class="order-book">
    <h1>{{ symbol }}</h1>
    <div class="bids">{{ bids }}</div>
    <div class="asks">{{ asks }}</div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useOrderBookStore } from '@/stores/orderBook'
import { computed } from 'vue'
const orderBookStore = useOrderBookStore()

const props = defineProps({
  symbol: {
    type: String,
    required: true
  }
})

const { orderBook } = storeToRefs(orderBookStore)
const bids = computed(() => orderBook.value.get(props.symbol)?.bids)
const asks = computed(() => orderBook.value.get(props.symbol)?.asks)
</script>

<style scoped lang="scss">
.order-book {
  .asks {
    color: #e84459;
  }
  .bids {
    color: #0ec37c;
  }
}
</style>
