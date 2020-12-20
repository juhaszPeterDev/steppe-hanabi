class Player{
    constructor(name) {
        this.cards = [];
        this.cardInfos = [];
        this.name = name;
    }

    addCardInfo(info){
        for (let ind = 0; ind < this.cards.length; ind++) {
            let key = undefined;
            if (typeof info === 'string') {
                key = 'colorValue';
            } else {
                key = 'numberValue';
            }
            if (this.cards[ind][key] === info) {
                this.cardInfos[ind][key] = info;
            }
        }
    }

    exchangeCard(cardInd, newCard) {
        const takenCard = this.cards.splice(cardInd, 1);
        this.cardInfos.splice(cardInd, 1);
        if (newCard !== undefined) {
            this.cards.push(newCard);
            this.cardInfos.push({});
        }
        return takenCard;
    }
}

module.exports = {Player};