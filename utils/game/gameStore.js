import Game from './game'

export default class gameStore {
    constructor() {
        console.log('gamestore')
        this.games = {}
    }

    get getGames() {
        return Object.values(this.games)
    }

    getGameById(id) {
        return this.games[id]
    }
    createGame(name, playerNumber) {
        const game = new Game(name, playerNumber)
        this.games[game.gameId] = game
        return game.gameId
    }
}
