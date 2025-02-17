<template>
  <div class="candles">
    <h1>{{ symbol }}</h1>
    <div class="time-frame">
      <span
        v-for="t in Object.keys(TIME_FRAME_MAP)"
        :key="`timeFrame_${t}`"
        :class="{ selected: timeFrame === t }"
        @click="changeTimeFrame(t)"
        >{{ t }}</span
      >
    </div>
    <div class="legend">
      high: {{ legend.high }}, low: {{ legend.low }}, open: {{ legend.open }}, close:
      {{ legend.close }}
    </div>
    <div ref="candleChartEl" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, watchEffect } from 'vue'
import { createChart, ColorType } from 'lightweight-charts'
import { storeToRefs } from 'pinia'
import { useWebsocketStore } from '@/stores/ws'
import { useCandleStore, TIME_FRAME_MAP } from '@/stores/candles'

const props = defineProps(['symbol'])
const websocketStore = useWebsocketStore()
const candleStore = useCandleStore()
const { candles } = storeToRefs(candleStore)
console.log('render candles')

const timeFrame = ref('1m')
const lastSubscription = ref('')
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
  high: 'XXXX',
  low: 'XXXX',
  open: 'XXXX',
  close: 'XXXX'
})

onMounted(() => {
  drawCharts()
})

let chart, candlestickSeries
function drawCharts() {
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
    // Background lines
    grid: {
      vertLines: { visible: false },
      horzLines: { color: 'rgba(255,255,255,0.1)' }
    },
    // X-AXIS
    timeScale: {
      borderColor: 'rgba(255,255,255,0.3)',
      timeVisible: true
    },
    // Y-AXIS
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
      if (!param.time) return
      const data = param.seriesData.values().next().value
      const { open, high, low, close } = data
      legend.value = { high, low, open, close }
    } catch (err) {
      // console.log(err)
    }
  })

  // resize event
  window.addEventListener('resize', () => {
    chart.applyOptions({
      width: candleChartEl.value.clientWidth,
      height: candleChartEl.value.clientHeight
    })
  })

  chart.timeScale().fitContent()
}

function changeTimeFrame(t) {
  candleStore.setCandles([])
  timeFrame.value = t
}

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
// timeFrame, props.symbol改變則重新訂閱
// watchEffect(() => {
//   console.log('watch effect')
//   // 若先前有訂閱則先取消訂閱
//   if (lastSubscription.value)
//     websocketStore.sendSocketMessage({
//       id: 1,
//       method: 'unsubscribe',
//       params: {
//         channels: [lastSubscription.value]
//       },
//       nonce: 1654784123465
//     })
//   const subscirption = `candlestick.${timeFrame.value}.${props.symbol}`
//   websocketStore.sendSocketMessage({
//     id: 1,
//     method: 'subscribe',
//     params: {
//       channels: [subscirption]
//     },
//     nonce: 1654784123465
//   })
//   lastSubscription.value = subscirption
// })
// // 不管 wsInstance 還是 isReady 改變都重新訂閱
// websocketStore.$subscribe(() => {
//   console.log('sub watch')
//   // 若先前有訂閱則先取消訂閱
//   if (lastSubscription.value)
//     websocketStore.sendSocketMessage({
//       id: 1,
//       method: 'unsubscribe',
//       params: {
//         channels: [lastSubscription.value]
//       },
//       nonce: 1654784123465
//     })
//   const subscirption = `candlestick.${timeFrame.value}.${props.symbol}`
//   websocketStore.sendSocketMessage({
//     id: 1,
//     method: 'subscribe',
//     params: {
//       channels: [subscirption]
//     },
//     nonce: 1654784123465
//   })
//   lastSubscription.value = subscirption
// })
watch(
  [timeFrame, () => props.symbol, websocketStore],
  (newValue, oldValue) => {
    // 若先前有訂閱則先取消訂閱
    if (lastSubscription.value)
      websocketStore.sendSocketMessage({
        id: 1,
        method: 'unsubscribe',
        params: {
          channels: [lastSubscription.value]
        },
        nonce: 1654784123465
      })
    const subscirption = `candlestick.${timeFrame.value}.${props.symbol}`
    websocketStore.sendSocketMessage({
      id: 1,
      method: 'subscribe',
      params: {
        channels: [subscirption]
      },
      nonce: 1654784123465
    })
    lastSubscription.value = subscirption
  },
  {
    immediate: false,
    deep: true
  }
)
</script>

<style scoped lang="scss">
.candles {
  width: 90%;
  height: 50rem;
  margin: 2rem 0;
  h1 {
    display: inline-block;
  }
  .time-frame {
    display: inline-block;
    font-size: 2rem;
    font-weight: medium;
    span {
      margin: 0 1rem;
      cursor: pointer;
    }
    .selected {
      font-size: 3rem;
      font-weight: bold;
    }
  }
  .legend {
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 1rem;
  }
  .chart {
    width: 100%;
    height: 40rem;
  }
  @media screen and (max-width: 750px) {
    .legend {
      font-size: 1.2rem;
    }
  }
}
</style>
