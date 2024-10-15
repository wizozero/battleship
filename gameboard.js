import Ship from './ship.js'

function GameBoard() {
	const boardSize = 10
	const board = Array(boardSize)
		.fill()
		.map(() => Array(boardSize).fill(null))
	const missedShots = []

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
			board[currentRow][currentCol] = { ship, position: i }
		}
	}

	return {
		board,
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

			if (this.board[row][col] === null) {
				if (!missedShots.some((shot) => shot.row === row && shot.col === col)) {
					missedShots.push({ row, col })
				}
				return false // Miss
			} else {
				const { ship, position } = this.board[row][col]
				if (ship.isHit(position)) {
					return false // Ya ha sido atacado
				} else {
					ship.hit(position)
					return true // Hit
				}
			}
		},

		getShipPosition(row, col) {
			const ship = this.board[row][col]
			if (!ship) return -1

			// Buscar horizontalmente
			for (let i = 0; i < ship.length; i++) {
				if (col - i >= 0 && this.board[row][col - i] === ship) return i
			}

			// Buscar verticalmente
			for (let i = 0; i < ship.length; i++) {
				if (row - i >= 0 && this.board[row - i][col] === ship) return i
			}

			return 0
		},

		get missedShots() {
			return [...missedShots]
		},
		isAllShipsSunk() {
			const ships = new Set()
			for (let row = 0; row < boardSize; row++) {
				for (let col = 0; col < boardSize; col++) {
					const cell = this.board[row][col]
					if (cell && cell.ship) {
						ships.add(cell.ship)
					}
				}
			}
			return Array.from(ships).every((ship) => ship.isSunk())
		},
	}
}

export default GameBoard
