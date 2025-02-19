# cryptoExchange

### https://yuanwu0000.github.io/cryptoExchange/

Implement real-time order book and candlestick charts like a crypto exchange (integrate crypto.com API by using websocket.)

[![Demo video](https://img.youtube.com/vi/Z-fJEUXQLNs/0.jpg)](https://www.youtube.com/watch?v=Z-fJEUXQLNs)

See Crypto.com API doc [here](https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#book-instrument_name).

## Tech Stack

Frontend Framework: **vue 3**<br>
CSS Framework: **scss**<br>
UI Library: **lightweight charts**<br>
State Management: **pinia**<br>
Build Tool: **vite**<br>

## Project Structure

```
├── src
|    │ App.vue
|    │ main.js
|    │
|    ├─assets
|    │   logo.svg
|    │   main.css
|    │
|    ├─components
|    │   Candles.vue
|    │   OrderBook.vue
|    │
|    ├─stores
|    │   candles.js
|    │   orderBook.js
|    │   ws.js
```

## Websocket Flow Chart

```mermaid
sequenceDiagram
  actor User
  participant Web Client
  participant Crypto.com
  User ->>+ Web Client: Enter page
  Web Client ->>+ Crypto.com: Establish websocket connection
  opt socket.onopen = () => {}
  Web Client->>+ Crypto.com: Send message { id: 1, method: 'subscribe', params: { channels: ['book.BTCUSD-PERP.10'] } }
  Web Client->>+ Crypto.com: Send message { id: 2, method: 'subscribe', params: { channels: ['candlestick.1m.BTCUSD-PERP'] } }
  end
  opt socket.onmessage = () => {}
  Crypto.com->>+ Web Client: Send message { code, id, method, channel?, result?}
  Note over Web Client: Check if code = 0 (success)
  Web Client->>+ Web Client: Proceed
  Note over Web Client: Check if method = 'public/heartbeat'
  Web Client->>+ Crypto.com: Send message { id, method: 'public/respond-heartbeat' }
  Note over Web Client: Check if id = -1 (updated) and result != null
  Web Client->>+ Web Client: Assign result.data to different stores (base on channel)
  Web Client->>+ User: Re-render component
  end
  opt socket.onclose = () => {}
  Web Client->>+ Crypto.com: Reconnect websocket
  end
  opt Switch Timeframe
  User->>+ Web Client: Click timeframe option
  Web Client->>+ Crypto.com: Send message { id: 2, method: 'unsubscribe', params: { channels: ['candlestick.1m.BTCUSD-PERP'] } }
  Web Client->>+ Crypto.com: Send message { id: 2, method: 'subscribe', params: { channels: ['candlestick.5m.BTCUSD-PERP'] } }
  Web Client->>+ User: Re-render component
  end
```

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

### Compile and Minify for Production

```sh
yarn build
```

### Serve dist

```sh
npm install -g serve
```

```sh
serve -s dist
```
