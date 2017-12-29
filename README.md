# choo-websocket [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Small wrapper around [WebSocket][WebSocket] browser API, for choo apps

## Usage
```js
var choo = require('choo')
var html = require('choo/html')

var app = choo()
app.use(require('choo-websocket')())
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <pre id="results"></pre>
      <p>Send something through sockets:</p>
      <input id="message" />
      <button onclick=${onclick}>Send</button>
    </body>
  `

  function onclick () {
    emit('ws:send', document.getElementById('message').value)
    document.getElementById('message').value = ''
  }
}

function live (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    emitter.on('ws:open', () => {
      console.log('Connection established')
    })
    emitter.on('ws:message', (data, event) => {
      var msgElement = document.getElementById('results')
      msgElement.textContent = msgElement.textContent + data + '\n'
    })
  })
}
```

## Events
### `ws:error` | `ws.events.ERROR`
Emitted if the WebSocket constructor or any of its methods throws an exception.

### `ws:open` | `ws.events.OPEN`
Emitted when the connection is established and the `readyState` property of the 
`socket` changes to `OPEN`. You should only _listen_ to this method, since the 
constructor and the `add-socket` event silently open sockets for you. This event 
handler will get two arguments, the `event` object, and the `id` of the socket 
that got opened, you can use that id to directly access to the socket through 
`state.sockets[id]` or passing it to events like `send` and `close`. If you don't 
pass the id, it will asume the default socket (the one created when the plugin got 
registered).

### `ws:close` | `ws.events.CLOSE`
Emitted when the connection is closed and the `readyState` property of the 
`socket` changes to `CLOSED`. When you listen to this, handler will take two 
arguments, the `event` object and the socket `id`. When you emit this, it will 
take three arguments the `code` for the close, the `reason` string and the `id` 
of the socket you want to close. If you don't pass the id, it will asume the 
default socket (the one created when the plugin got registered).

### `ws:send` | `ws.events.SEND`
Emitted to send a message through the socket. Emit this event passing the data 
you want to send, and an optional `id` as reference of the socket that you want 
to send the message.

### `ws:message` | `ws.events.MESSAGE`
Listen to this event to get messages from the socket. The handler of this event 
will get three arguments, the `data` sent, the whole `evet` and the `id` of the 
socket that got the message.

### `ws:add-socket` | `ws.events.ADD_SOCKET`
Add a socket. Accept a `route`, an `options` object and an optional `id`, if you pass 
a route of an existing socket it will override it. If you don't pass any id, 
it will create a random string as id. This id is used to identify the WebSocket 
instance in the app state and to emit and listen for events only to specific 
instances. Keep in mind that this is agnostic to the server side implementation, so 
its up to you to handle different websockets from server. 
In the example folder, there is a simple implementation of _rooms_ using the [ws][ws]
module. Some other libraries like [socket.io][socket.io] has this concept built in.

## API
### `plugin = ws([route], [opts])`

The plugin accepts three optional parameters. You can pass the `route` for the 
web socket, which defaults to `window.location.host`. Notice that you don't need 
to specify the `ws` protocol. Also you can pass some options as a second argument.

- `secure`: Boolean. Set to true if you are in a secure environment. If you mix 
environment, it will throw on creation of the socket.
- `protocols`: Array or String. Use it to specify sub protocols for the socket.

If the object is correctly created, then you have a sockets object where every 
propertie is a key to the WebSocket instance that you added.

## See Also

- [choo-sse][choo-sse] - Small wrapper around server-sent event browser API, for choo apps.

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
[choo-sse]: https://github.com/YerkoPalma/choo-sse
[ws]: https://github.com/websockets/ws
[socket.io]: https://github.com/socketio/socket.io/
