const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// real-time stuff

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const socketList = [];

io.on('connection', (socket) => {
  socketList.push(socket);
  console.log('user connected '+(new Date()).toString());
  socket.on('new-message', (message) => {
    socketList.forEach(s => s.emit('new-message', message));
  });
  
});

const broadCastUpdate = () => {
  socketList.forEach(s => s.emit('new-message', 'update'));
};

// game specific

const { CardGameService } = require('./services/cardGameService');
const { CardGameController } = require('./controllers/cardGameController');

const cardGameServiceInstance = new CardGameService();
const cardGameControllerInstance = new CardGameController(cardGameServiceInstance, broadCastUpdate);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/api/game', cardGameControllerInstance.getRouter());

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});