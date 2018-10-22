let socket = require('socket.io-client')('192.168.178.39')

socket.on('connect', () => {
  console.log('connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})
