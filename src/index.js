const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const { CardGameService } = require('./services/cardGameService');
const { CardGameController } = require('./controllers/cardGameController');

const cardGameServiceInstance = new CardGameService();
const cardGameControllerInstance = new CardGameController(cardGameServiceInstance);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/api/game', cardGameControllerInstance.getRouter());

/*app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});*/

// real-time stuff

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('user connected');
});

io.on('new-message', (message) => {
  io.emit(message);
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});