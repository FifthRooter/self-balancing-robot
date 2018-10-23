let socket = require('socket.io-client')('https://fast-cove-40618.herokuapp.com')

socket.on('connect', () => {
  console.log('connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})

socket.on('motorState', () => {
  console.log('Yeeeee')
})
