<template>
  <div class="order-book">
    <div class="bids">{{ data.bids }}</div>
    <div class="asks">{{ data.asks }}</div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
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
