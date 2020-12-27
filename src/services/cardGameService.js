const { Player } = require("../models/Player");

class CardGameService {
    constructor() {
        this.cardList = [];
        this.discardedCardList = [];
        this.cardPiles = [];
        this.hints = 8;
        this.mistakes = 0;
    
        this.players = [];
        this.activePlayerIndex = 0;
    }

    loadGame() {
        this.cardList = [];
        this.discardedCardList = [];
        const colorValues = ['red', 'yellow', 'blue', 'green', 'white'];
        const numberValues = [1, 1, 1, 2, 2, 3, 3, 4, 4, 5];

        colorValues.forEach(colorValue => {
            numberValues.forEach(numberValue => {
                this.cardList.push({colorValue, numberValue});
            });
        });
        this.cardList = this.shuffle(this.cardList);

        this.cardPiles = colorValues.reduce((pile, color) => {
            pile[color] = 0;
            return pile;
        }, {});
        this.hints = 8;
        this.mistakes = 0;
        this.activePlayerIndex = 0;
        for (let ind = 0; ind < 5; ind++){
            this.players.forEach((player) => {
                player.cards.push(this.cardList.pop());
                player.cardInfos.push({});
            });
        }
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    addPlayer(name){
        this.players.push(new Player(name));
    }

    clearLobby(){
        this.players = [];
    }

    giveNewCardToPlayer(cardInd) {
        const drawnCard = this.cardList.pop();
        const takenCard = this.players[this.activePlayerIndex].exchangeCard(cardInd, drawnCard)[0];
        this.discardedCardList.push(takenCard);
        return takenCard;
    }

    playCard(cardInd) {
        const takenCard = this.giveNewCardToPlayer(cardInd);
        if (this.cardPiles[takenCard.colorValue] + 1 === takenCard.numberValue) {
            this.cardPiles[takenCard.colorValue]++;
        } else {
            this.mistakes++;
            if (this.mistakes === 3) {
                this.gameOver();
            }
        }
        this.activePlayerIndex++
        this.activePlayerIndex = this.activePlayerIndex % this.players.length;
    }

    gameOver() {}

    discardCard(cardInd) {
        this.giveNewCardToPlayer(cardInd);
        this.hints++;
        this.activePlayerIndex++
        this.activePlayerIndex = this.activePlayerIndex % this.players.length;
    }

    giveHint(player, info){
        if (player !== this.activePlayerIndex && this.hints > 0) {
            this.players[player].addCardInfo(info);
            this.hints--;
            this.activePlayerIndex++
            this.activePlayerIndex = this.activePlayerIndex % this.players.length;
        }
    }
}

module.exports = {CardGameService};