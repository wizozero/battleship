import Ship from './ship'

function GameBoard() {
	let board = []
	const boardSize = 10

	const initializeBoard = () => {
		for (let i = 0; i < boardSize; i++) {
			board[i] = Array(boardSize).fill(null)
		}
	}

	const isValidCoordinate = (row, col) => {
		return row >= 0 && row < boardSize && col >= 0 && col < boardSize
	}

	const isValidPlacement = (row, col, direction, length) => {
		if (!isValidCoordinate(row, col)) return false

		if (direction === 'horizontal') {
			return col + length <= boardSize
		} else if (direction === 'vertical') {
			return row + length <= boardSize
		}
		return false
	}

	const isClearPath = (row, col, direction, length) => {
		for (let i = 0; i < length; i++) {
			if (direction === 'horizontal') {
				if (board[row][col + i] !== null) return false
			} else {
				if (board[row + i][col] !== null) return false
			}
		}
		return true
	}

	const placeShipOnBoard = (row, col, direction, ship) => {
		for (let i = 0; i < ship.length; i++) {
			if (direction === 'horizontal') {
				board[row][col + i] = ship
			} else {
				board[row + i][col] = ship
			}
		}
	}

	initializeBoard()

	return {
		placeShip(row, col, direction, length) {
			if (!isValidPlacement(row, col, direction, length)) return false
			if (!isClearPath(row, col, direction, length)) return false

			const ship = Ship(length)
			placeShipOnBoard(row, col, direction, ship)
			return true
		},
	}
}

export default GameBoard
