<template>
  <div class="candles">
    <h1>{{ symbol }} {{ timeFrame }}</h1>
    <div class="legend">
      high: {{ legend.high }}, low: {{ legend.low }}, open: {{ legend.open }}, close:
      {{ legend.close }}
    </div>
    <div ref="candleChartEl" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { createChart, ColorType } from 'lightweight-charts'
import { storeToRefs } from 'pinia'
import { useCandleStore } from '@/stores/candles'
const candleStore = useCandleStore()

const { symbol, timeFrame, candles } = storeToRefs(candleStore)

const candleChartEl = ref(null)
const candleList = computed(() =>
  candles.value.map((item) => ({
    time: parseFloat((item.t - new Date(item.t).getTimezoneOffset() * 60000) / 1000),
    open: parseFloat(item.o),
    close: parseFloat(item.c),
    high: parseFloat(item.h),
    low: parseFloat(item.l),
    value: parseFloat(item.c)
  }))
)

const legend = ref({
  high: 'XXX',
  low: 'XXX',
  open: 'XXX',
  close: 'XXX'
})

let chart, candlestickSeries
onMounted(() => {
  chart = createChart(candleChartEl.value, {
    layout: {
      background: { type: ColorType.Solid, color: '#161a1e' },
      textColor: 'rgba(255,255,255,0.3)'
    },
    width: candleChartEl.value.clientWidth,
    height: candleChartEl.value.clientHeight,
    // The crosshair shows the intersection of the price and time scale values at any point on the chart.
    crosshair: {
      mode: 1,
      vertLine: { color: 'rgba(255,255,255,0.5)' },
      horzLine: { color: 'rgba(255,255,255,0.5)' }
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { color: 'rgba(255,255,255,0.1)' }
    },
    timeScale: {
      borderColor: 'rgba(255,255,255,0.3)',
      timeVisible: true
    },
    rightPriceScale: {
      borderColor: 'rgba(255,255,255,0.3)'
    },
    watermark: {
      text: 'Zachary made this chart!!!',
      color: 'rgba(255,255,255,0.1)',
      visible: true
    }
  })
  candlestickSeries = chart.addCandlestickSeries({
    upColor: '#0ec37c',
    downColor: '#e84459',
    borderVisible: false
    // wickUpColor: '#EF5350',
    // wickDownColor: '#26A69A'
  })
  candlestickSeries.setData(candleList.value)

  // set legend after moving to another candle
  chart.subscribeCrosshairMove((param) => {
    try {
      // console.log(param.seriesData.values().next().value)
      if (!param.time) return
      const data = param.seriesData?.values()?.next()?.value
      const { open, high, low, close } = data
      legend.value = { high, low, open, close }
    } catch (err) {
      // console.log(err)
    }
  })

  chart.timeScale().fitContent()
})
watch(
  candleList,
  () => {
    if (!candlestickSeries) return
    candlestickSeries.setData(candleList.value)
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.candles {
  width: 90%;
  height: 50rem;
  margin: 2rem 0;
  .legend {
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.6);
  }
  .chart {
    width: 100%;
    height: 40rem;
  }
}
</style>
