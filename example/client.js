var choo = require('choo')
var html = require('choo/html')

var app = choo()
app.use(require('..')({ secure: true }))
app.use(require('choo-devtools')())
app.use(live)

app.route('/', makeView('default'))
app.route('/private', makeView('private'))
app.mount('body')

function makeView (id) {
  return function (state, emit) {
    return html`
      <body>
        <pre id="results-${id}"></pre>
        <p>Send something through sockets:</p>
        <input id="message" />
        <button onclick=${onclick}>Send</button>
        <a href="/private">go private</a>
      </body>
    `

    function onclick () {
      emit('ws:send', document.getElementById('message').value, id)
      console.log('sending to ' + id)
      document.getElementById('message').value = ''
    }
  }
}

function live (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    emitter.emit('ws:add-socket', window.location.host + '/private', { secure: true }, 'private')
    emitter.on('ws:open', (e, id) => {
      console.log('Connection stablished to socket ' + id)
    })
    emitter.on('ws:message', (data, event, id) => {
      var msgElement = document.getElementById('results-' + id)
      msgElement.textContent = msgElement.textContent + data + '\n'
    })
  })

  emitter.on('ws:error', (err, id) => {
    console.error('Error on socket ' + id)
    console.error(err)
  })
}
