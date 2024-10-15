import GameBoard from './gameboard.js'

function Player(isComputer = false) {
	const gameboard = GameBoard()

	const attack = (enemyGameBoard, row, col) => {
		return enemyGameBoard.receiveAttack(row, col)
	}

	const randomAttack = (enemyGameBoard) => {
		let row, col
		do {
			row = Math.floor(Math.random() * 10)
			col = Math.floor(Math.random() * 10)
		} while (!enemyGameBoard.receiveAttack(row, col))

		return { row, col }
	}

	return {
		isComputer,
		gameboard,
		attack,
		randomAttack,
	}
}

export default Player
