var express = require('express');

class CardGameController {
    constructor(cardGameService){
        this.cardGameService = cardGameService;
        this.router = express.Router();
        this.router.get('/state', (req, res) => {
            res.send(cardGameService);
        });
        this.router.post('/player', (req, res) => {
            cardGameService.addPlayer(req.body.name);
            res.send('success');
        });
        this.router.post('/start', (req, res) => {
            cardGameService.loadGame();
            res.send(cardGameService);
        });
        this.router.delete('/lobby', (req, res) => {
            cardGameService.clearLobby();
            res.send('success');
        });
        this.router.post('/card', (req, res) => {
            if (req.body.action === 'play') {
                cardGameService.playCard(req.body.index);
            } else {
                cardGameService.discardCard(req.body.index);
            }
            res.send('success');
        });
        this.router.post('/hint', (req, res) => {
            cardGameService.giveHint(req.body.player, req.body.info);
            res.send('success');
        });
    }

    getRouter(){
        return this.router;
    }
}

module.exports = {
    CardGameController
};