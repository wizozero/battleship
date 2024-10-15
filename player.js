import GameBoard from './gameboard.js'

function Player(isComputer = false) {
	const gameboard = GameBoard()

	const attack = (enemyGameBoard, row, col) => {
		return enemyGameBoard.receiveAttack(row, col)
	}

	const randomAttack = (enemyGameboard) => {
		let row, col
		do {
			row = Math.floor(Math.random() * 10)
			col = Math.floor(Math.random() * 10)
		} while (
			enemyGameboard.missedShots.some(
				(shot) => shot.row === row && shot.col === col
			) ||
			(enemyGameboard.board[row][col] !== null &&
				enemyGameboard.board[row][col].ship.isHit(
					enemyGameboard.board[row][col].index
				))
		)
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
