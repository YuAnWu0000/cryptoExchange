# cryptoExchange

Implement real-time order book and candlestick charts like a crypto exchange (integrate crypto.com API by using websocket.)

[![Demo video](https://img.youtube.com/vi/Z-fJEUXQLNs/0.jpg)](https://www.youtube.com/watch?v=Z-fJEUXQLNs)

See Crypto.com API doc [here](https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#book-instrument_name).

## Websocket Flow

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
  Note over Web Client: Check if id = -1 and result != null

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
