const io = require('socket.io')()

io.on('connection', (socket) => {
  socket.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval', interval)
    setInterval(() => {
      socket.emit('timer', new Date())
    }, interval)
  })
  socket.on('toggleMotors', (interval) => {
      setInterval(() => {
        io.emit('toggleMotors', {time: 'this oclock'})
        console.log('motors toggled')
      }, interval)
  })
  setInterval(() => {
    console.log('doing stuff inside io.on')
  })
})



const port = 8000
io.listen(port)
console.log('listening on port 8000')
