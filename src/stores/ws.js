import { defineStore } from 'pinia'
import { useOrderBookStore } from '@/stores/orderBook'
import { useCandleStore } from '@/stores/candles'

export const useWebsocketStore = defineStore('websocket', {
  state: () => ({
    wsInstance: null,
    isReady: false
  }),
  actions: {
    initWebsocket(firstMsg) {
      let socket = new WebSocket(wsUrl)
      socket.onopen = () => {
        console.log('websocket connected!')
        this.isReady = true
        // By Crypto.com doc
        // We recommend adding a 1-second sleep after establishing the websocket connection, and before requests are sent.
        this.sendSocketMessage(firstMsg)
      }
      socket.onmessage = (msg) => {
        let data = JSON.parse(msg.data)
        // console.log('onmessage: ', data)
        // error handling
        if (data.code !== 0) {
          console.log(
            'Crypto.com expected error: ',
            CRYPTO_DOT_COM_ERROR_CODE[data.code]
              ? CRYPTO_DOT_COM_ERROR_CODE[data.code]
              : data.message
          )
          return
        }
        // check heartbeat
        if (data.method === 'public/heartbeat') {
          this.sendSocketMessage({
            id: data.id,
            method: 'public/respond-heartbeat'
          })
          return
        }
        // all the successful responses would be id: firstMsg.id(first response) or -1(updated)
        if (data.id !== -1 && data.id !== firstMsg.id) {
          console.log('----------------unhandling error----------------', data)
          return
        }
        if (!data.result) return
        // pass result to store
        let result = data.result
        switch (result.channel) {
          case 'book': {
            const orderBookStore = useOrderBookStore()
            orderBookStore.setOrderBook(result.instrument_name, result.data[0])
            break
          }
          case 'candlestick': {
            const candleStore = useCandleStore()
            // pass historical candle data into store after getting first response
            if (data.id === firstMsg.id) {
              candleStore.setCandles(result.data)
              return
            }
            candleStore.updateCandles(result.data)
            break
          }
          default:
            console.log('--------------channel not found!!--------------')
        }
      }
      socket.onerror = (err) => {
        this.isReady = false
        console.log('error', err)
      }
      socket.onclose = (event) => {
        console.log(
          `Socket onclose due to ${CRYPTO_DOT_COM_ERROR_CODE[event.code] ? CRYPTO_DOT_COM_ERROR_CODE[event.code] : event.reason}! Reconnecting...`
        )
        this.isReady = false
        this.initWebsocket(firstMsg)
      }
      this.wsInstance = socket
    },
    sendSocketMessage(msg) {
      // console.log('msg: ', msg)
      // console.log('ready state ', this.wsInstance.readyState)
      if (this.wsInstance.readyState === SOCKET_READY_STATE_ENUM.OPEN) {
        this.wsInstance.send(JSON.stringify(msg))
        console.log('message sent: ', JSON.stringify(msg))
      }
    }
  }
})
const wsUrl = 'wss://stream.crypto.com/exchange/v1/market'
const SOCKET_READY_STATE_ENUM = {
  CONNECTING: 0, // 'Socket has been created. The connection is not yet open.'
  OPEN: 1, // 'The connection is open and ready to communicate.'
  CLOSING: 2, // 'The connection is in the process of closing.'
  CLOSED: 3 // "The connection is closed or couldn't be opened."
}
const CRYPTO_DOT_COM_ERROR_CODE = {
  1000: "Normal disconnection by server, usually when the heartbeat isn't handled properly",
  1006: 'Abnormal disconnection',
  1013: 'Server restarting -- try again later'
}
