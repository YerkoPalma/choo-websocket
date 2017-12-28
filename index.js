/* global WebSocket */
var assert = require('assert')

module.exports = websocket

var events = websocket.events = {
  OPEN: 'ws:open',
  CLOSE: 'ws:close',
  SEND: 'ws:send',
  MESSAGE: 'ws:message',
  ADD_SOCKET: 'ws:add-socket',
  ERROR: 'ws:error'
}

function websocket (route, opts) {
  if (typeof route === 'object') {
    opts = route
    route = window.location.host
  }
  route = route || window.location.host
  opts = opts || {}
  assert.equal(typeof route, 'string', 'choo-websocket: route should be type string')
  assert.equal(typeof opts, 'object', 'choo-websocket: opts should be type object')

  return function (state, emitter) {
    assert.equal(typeof state, 'object', 'choo-websocket: state should be type object')
    assert.equal(typeof emitter, 'object', 'choo-websocket: emitter should be type object')

    state.sockets = {}
    createWebSocket(state, emitter, route, opts, 'default')
    emitter.on(events.CLOSE, function (code, reason, id) {
      // default close code is 1000
      // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
      code = code || 1000
      state.sockets[id || 'default'].close(code, reason)
    })
    emitter.on(events.SEND, function (data, id) {
      console.log(data)
      state.sockets[id || 'default'].send(data)
    })
    emitter.on(events.ADD_SOCKET, function (route, opts, id) {
      createWebSocket(state, emitter, route, opts, id)
    })
  }
}

function createWebSocket (state, emitter, route, opts, id) {
  var socket = null
  id = id || (new Date() % 9e6).toString(36)
  try {
    socket = new WebSocket(`${opts.secure ? 'wss' : 'ws'}://${route}`, opts.protocols ? opts.protocols : undefined)
    socket.addEventListener('open', function (event) {
      state.sockets[id] = socket
      emitter.emit(events.OPEN, event, id)
    })
    socket.addEventListener('close', function (event) {
      emitter.emit(events.CLOSE, event, id)
    })
    socket.addEventListener('message', function (event) {
      emitter.emit(events.MESSAGE, event.data, event, id)
    })
    return id
  } catch (e) {
    emitter.emit(events.ERROR, e)
  }
}
