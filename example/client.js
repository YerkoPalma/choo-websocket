var choo = require('choo')
var html = require('choo/html')

var app = choo()
app.use(require('..')({ secure: true }))
app.use(live)

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
    emitter.on('ws:open', () => console.log('Connection stablished'))
    emitter.on('ws:message', (data, event) => {
      var msgElement = document.getElementById('results')
      msgElement.textContent = msgElement.textContent + data + '\n'
    })
  })

  emitter.on('ws:error', err => {
    console.error(err)
  })
  window.onunload = event => emitter.emit('ws:close')
}
