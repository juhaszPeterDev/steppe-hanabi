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

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/game', cardGameControllerInstance.getRouter());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});