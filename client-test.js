let socket = require('socket.io-client')('http://localhost:8000')

socket.on('connect', () => {
  console.log('connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})

socket.on('timer', (data) => {
  
})
