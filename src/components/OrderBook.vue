<template>
  <div v-if="bids && asks" class="order-book">
    <h1>{{ symbol }}</h1>
    <!-- Bottom up  -->
    <div v-for="index in displayNum" :key="`ask${index}`" class="asks">
      <div>{{ asks[requestNum - displayNum - index][0] }}</div>
      <div>{{ asks[requestNum - displayNum - index][1] }}</div>
    </div>
    <div v-for="index in displayNum" :key="`bid${index}`" class="bids">
      <div>{{ bids[index - 1][0] }}</div>
      <div>{{ bids[index - 1][1] }}</div>
    </div>
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

const { orderBook, requestNum, displayNum } = storeToRefs(orderBookStore)
const asks = computed(() => orderBook.value.get(props.symbol)?.asks)
const bids = computed(() => orderBook.value.get(props.symbol)?.bids)
</script>

<style scoped lang="scss">
.order-book {
  width: 30%;
  margin: 1rem 0;
  h1 {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  .asks {
    width: 60%;
    position: relative;
    margin: auto;
    color: #e84459;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bids {
    width: 60%;
    position: relative;
    margin: auto;
    color: #0ec37c;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
