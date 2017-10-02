# choo-websocket [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Small wraper around [WebSocket][WebSocket] browser API, for choo apps

## Usage
```js
var choo = require('choo')

var app = choo()
app.use(require('choo-websocket')())
app.mount('body')
```

## Events
### `ws:error` | `ws.events.ERROR`
Emitted if the WebSocket constructor or any of its methods throws an exception

### `ws:open` | `ws.events.OPEN`
Emitted when the connection is stablished and the `readyState` property of the 
`socket` changes to `OPEN`

### `ws:close` | `ws.events.CLOSE`
Emitted when the connection is close and the `readyState` property of the 
`socket` changes to `CLOSED`

### `ws:send` | `ws.events.SEND`
Emitted to send a message through the socket

### `ws:message` | `ws.events.MESSAGE`
Listen to this event to get messages from the socket

## API
### `plugin = ws([route], [opts])`

The plugin accept two optional parameters. You can pass the `route` for the 
web socket, default to `window.location.host`. Notice that you don't need to 
specify the `ws` protocol. Also you can pass some options as a second argument

- `secure`: Boolean. Set to true if you are in a secure environment. If you mix 
environment, it will throw on creation of the socket.
- `protocols`: Array or String. Use it to specify sub protocols for the socket.

If the object is correctly created, then you have a socket object in the state 
of your app with the following properties:

- `binaryType`: A string describing the binary type of the transmited data. 
Either `'blob'` or `'arraybuffer'`.
- `bufferedAmount`: The number of bytes of data that have been queued but not 
yet transmitted to the network.
- `extensions`: The extensions selected by the server.
- `protocol`: A string indicating the name of the sub-protocol the server 
selected.
- `state`: The current state of the connection.
- `url`: The URL as resolved by the constructor.

## License
[MIT](/LICENSE)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo-websocket.svg?style=flat-square
[3]: https://npmjs.org/package/choo-websocket
[4]: https://img.shields.io/travis/YerkoPalma/choo-websocket/master.svg?style=flat-square
[5]: https://travis-ci.org/YerkoPalma/choo-websocket
[6]: https://img.shields.io/codecov/c/github/YerkoPalma/choo-websocket/master.svg?style=flat-square
[7]: https://codecov.io/github/YerkoPalma/choo-websocket
[8]: http://img.shields.io/npm/dm/choo-websocket.svg?style=flat-square
[9]: https://npmjs.org/package/choo-websocket
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[WebSocket]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket