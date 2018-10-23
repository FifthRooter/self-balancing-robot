import openSocket from 'socket.io-client';

const socket = openSocket('http://192.168.178.39:8000');

function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

export { subscribeToTimer };
