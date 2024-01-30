import { useOrderBookStore } from '@/stores/orderBook'

const wsUrl = 'wss://stream.crypto.com/exchange/v1/market'
let socket = null

export const initWebsocket = (FirstMsg) => {
  socket = new WebSocket(wsUrl)

  socket.onopen = () => {
    console.log('websocket connected!')
  }
  socket.onmessage = (msg) => {
    let data = JSON.parse(msg.data)
    console.log('onmessage: ', data)
    // error handling
    if (data.code !== 0) {
      console.log(
        'Crypto.com expected error: ',
        CryptoDotComErrorCode[data.code] ? CryptoDotComErrorCode[data.code] : data.message
      )
      return
    }
    // ignore first confirmation response by crypto.com
    if (data.id === FirstMsg.id) return
    // check heartbeat
    if (data.method === 'public/heartbeat') {
      sendSocketMessage({
        id: data.id,
        method: 'public/respond-heartbeat'
      })
      return
    }
    // all the successful responses would be id: -1
    if (data.id !== -1) {
      console.log('----------------unhandling error----------------', data)
      return
    }
    // pass result to store
    let result = data.result
    switch (result.channel) {
      case 'book': {
        const orderBookStore = useOrderBookStore()
        orderBookStore.setOrderBook(result.instrument_name, result.data[0])
        break
      }
      default:
        console.log('--------------channel not found!!--------------')
    }
  }
  socket.onerror = (err) => {
    console.log('error', err)
  }
  socket.onclose = (event) => {
    console.log(
      `Socket onclose due to ${CryptoDotComErrorCode[event.code] ? CryptoDotComErrorCode[event.code] : event.reason}! Reconnecting...`
    )
    initWebsocket(FirstMsg)
  }
  // By Crypto.com doc
  // We recommend adding a 1-second sleep after establishing the websocket connection, and before requests are sent.
  setTimeout(() => {
    sendSocketMessage(FirstMsg)
  }, 1000)
}
export const sendSocketMessage = (msg) => {
  if (socket.readyState === socketReadyStateEnum.OPEN) {
    socket.send(JSON.stringify(msg))
    console.log('message sent: ', JSON.stringify(msg))
  }
}
const socketReadyStateEnum = {
  CONNECTING: 0, // 'Socket has been created. The connection is not yet open.'
  OPEN: 1, // 'The connection is open and ready to communicate.'
  CLOSING: 2, // 'The connection is in the process of closing.'
  CLOSED: 3 // "The connection is closed or couldn't be opened."
}
const CryptoDotComErrorCode = {
  1000: "Normal disconnection by server, usually when the heartbeat isn't handled properly",
  1006: 'Abnormal disconnection',
  1013: 'Server restarting -- try again later'
}
