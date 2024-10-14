import Ship from './ship'

function GameBoard() {
	const boardSize = 10
	let board = Array(boardSize)
		.fill()
		.map(() => Array(boardSize).fill(null))
	let missedShots = []

	const isValidCoordinate = (row, col) =>
		row >= 0 && row < boardSize && col >= 0 && col < boardSize

	const isValidPlacement = (row, col, direction, length) => {
		if (!isValidCoordinate(row, col)) return false
		const endPosition = direction === 'horizontal' ? col + length : row + length
		return endPosition <= boardSize
	}

	const isClearPath = (row, col, direction, length) => {
		for (let i = 0; i < length; i++) {
			const currentRow = direction === 'horizontal' ? row : row + i
			const currentCol = direction === 'horizontal' ? col + i : col
			if (board[currentRow][currentCol] !== null) return false
		}
		return true
	}

	const placeShipOnBoard = (row, col, direction, ship) => {
		for (let i = 0; i < ship.length; i++) {
			const currentRow = direction === 'horizontal' ? row : row + i
			const currentCol = direction === 'horizontal' ? col + i : col
			board[currentRow][currentCol] = ship
		}
	}

	return {
		placeShip(row, col, direction, length) {
			if (
				!isValidPlacement(row, col, direction, length) ||
				!isClearPath(row, col, direction, length)
			)
				return false
			const ship = Ship(length)
			placeShipOnBoard(row, col, direction, ship)
			return true
		},

		receiveAttack(row, col) {
			if (!isValidCoordinate(row, col)) return false

			if (
				missedShots.some((shot) => shot.row === row && shot.col === col) ||
				(board[row][col] !== null && board[row][col].isHit)
			) {
				return false
			}

			if (board[row][col] !== null) {
				board[row][col].hit()
				board[row][col].isHit = true
				return true
			} else {
				missedShots.push({ row, col })
				return false
			}
		},
		get missedShots() {
			return [...missedShots]
		},
		isAllShipsSunk() {
			return board.flat().every((cell) => cell === null || cell.isSunk())
		},
	}
}

export default GameBoard
