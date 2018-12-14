import Game from './game'

export default class gameStore {
    constructor() {
        console.log('gamestore')
        this.games = {}
        this.publicGames = []
    }

    getGames() {
        // const publicGames = []
        // Object.values(this.games).forEach(game => {
        //     publicGames.push(game.publicData)
        // })
        return this.publicGames
    }

    getGameById(id) {
        console.log('getGameById', id)
        return this.games[id]
    }
    createGame(name, numOfPlayers) {
        const game = new Game(name, numOfPlayers)
        this.games[game.id] = game
        this.publicGames.push(game.publicData)
        return game.publicData.id
    }
}
