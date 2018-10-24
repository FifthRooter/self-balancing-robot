let socket = require('socket.io-client')('http://192.168.178.39:8000')

socket.on('connect', () => {
  console.log('connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})

setInterval(() => {
  socket.emit('toggleMotors')
}, 4000)

socket.on('timer', (data) => {

})
