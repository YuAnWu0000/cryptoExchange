import { useWsStore } from '@/stores/ws'

const wsUrl = 'wss://stream.crypto.com/exchange/v1/market'
let socket = null

export const initWebsocket = (FirstMsg) => {
  socket = new WebSocket(wsUrl)
  const wsStore = useWsStore()

  socket.onopen = () => {
    console.log('websocket connected!!')
  }
  socket.onmessage = (msg) => {
    let { data } = msg
    console.log('onmessage', data)
    // check heartbeat
    if (data.methods === 'public/heartbeat')
      sendSocketMessage(
        JSON.stringify({
          id: data.id,
          method: 'public/respond-heartbeat'
        })
      )
    else {
      wsStore.setMsg(data)
    }
  }
  socket.onerror = (err) => {
    console.log('error', err)
  }
  // By Crypto.com doc
  // We recommend adding a 1-second sleep after establishing the websocket connection, and before requests are sent.
  setTimeout(() => {
    sendSocketMessage(FirstMsg)
  }, 1000)
}
export const sendSocketMessage = (msg) => {
  if (socket.readyState === socketReadyStateEnum.OPEN) socket.send(JSON.stringify(msg))
}
export const socketReadyStateEnum = {
  CONNECTING: 0, // 'Socket has been created. The connection is not yet open.'
  OPEN: 1, // 'The connection is open and ready to communicate.'
  CLOSING: 2, // 'The connection is in the process of closing.'
  CLOSED: 3 // "The connection is closed or couldn't be opened."
}
export const CryptoDotComErrorCode = {
  1000: "Normal disconnection by server, usually when the heartbeat isn't handled properly",
  1006: 'Abnormal disconnection',
  1013: 'Server restarting -- try again later'
}
