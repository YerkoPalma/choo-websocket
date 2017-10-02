const WebSocket = require('ws')
const fastify = require('fastify')()

fastify.decorate('io', new WebSocket.Server({ server: fastify.server }))
fastify.register(require('fastify-bankai'), {
  entry: './example/client.js'
})

fastify.io.on('connection', socket => {
  console.log('someone just connected')
  socket.on('disconnect', () => {
    console.log('someone left')
  })
  // On message broadcast to everyone
  socket.on('message', data => {
    // Broadcast to everyone else
    fastify.io.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})

fastify.listen(process.env.PORT || 8080, process.env.IP || 'localhost', err => {
  if (err) throw err
})
