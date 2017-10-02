/* global WebSocket */
var assert = require('assert')

module.exports = websocket

var events = websocket.events = {
  OPEN: 'ws:open',
  CLOSE: 'ws:close',
  SEND: 'ws:send',
  MESSAGE: 'ws:message',
  ERROR: 'ws:error'
}

function websocket (route, opts) {
  if (typeof route === 'object') {
    opts = route
    route = window.location.host
  }
  route = route || window.location.host
  opts = opts || {}
  assert.equal(typeof name, 'string', 'choo-websocket: route should be type string')
  assert.equal(typeof opts, 'object', 'choo-websocket: opts should be type object')

  return function (state, emitter) {
    assert.equal(typeof state, 'object', 'choo-websocket: state should be type object')
    assert.equal(typeof emitter, 'object', 'choo-websocket: emitter should be type object')

    var socket = null
    try {
      socket = new WebSocket(`${opts.secure ? 'wss' : 'ws'}://${route}`)
      emitter.on(events.CLOSE, function (code, reason) {
        // default close code is 1000
        // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
        code = code || 1000
        socket.close(code, reason)
      })
      socket.addEventListener('open', function (event) {
        const { binaryType, bufferedAmount, extensions, protocol, readyState, url } = socket
        state.socket = { binaryType, bufferedAmount, extensions, protocol, state: readyState, url }
        emitter.emit(events.OPEN, event)
      })
      socket.addEventListener('close', function (event) {
        emitter.emit(events.CLOSE, event)
      })
      socket.addEventListener('message', function (event) {
        emitter.emit(events.MESSAGE, event.data, event)
      })
      emitter.on(events.SEND, function (data) {
        socket.send(data)
      })
    } catch (e) {
      emitter.emit(events.ERROR, e)
    }
  }
}
