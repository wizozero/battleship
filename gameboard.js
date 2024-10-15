// gameboard.js
import Ship from './ship.js'

function GameBoard() {
	const boardSize = 10
	let board = Array(boardSize)
		.fill()
		.map(() => Array(boardSize).fill(null))
	const ships = []
	const missedShots = []

	function placeShip(row, col, direction, length) {
		const newShip = Ship(length)
		if (canPlaceShip(row, col, direction, length)) {
			for (let i = 0; i < length; i++) {
				if (direction === 'horizontal') {
					board[row][col + i] = { ship: newShip, index: i }
				} else {
					board[row + i][col] = { ship: newShip, index: i }
				}
			}
			ships.push(newShip)
			return true
		}
		return false
	}

	function canPlaceShip(row, col, direction, length) {
		if (direction === 'horizontal') {
			if (col + length > boardSize) return false
			for (let i = 0; i < length; i++) {
				if (board[row][col + i] !== null) return false
			}
		} else {
			if (row + length > boardSize) return false
			for (let i = 0; i < length; i++) {
				if (board[row + i][col] !== null) return false
			}
		}
		return true
	}

	function removeShip(row, col) {
		if (board[row][col] !== null) {
			const ship = board[row][col].ship
			for (let i = 0; i < boardSize; i++) {
				for (let j = 0; j < boardSize; j++) {
					if (board[i][j] && board[i][j].ship === ship) {
						board[i][j] = null
					}
				}
			}
			const index = ships.indexOf(ship)
			if (index > -1) {
				ships.splice(index, 1)
			}
			return true
		}
		return false
	}

	function getShipAt(row, col) {
		return board[row][col] ? board[row][col].ship : null
	}

	function getShipOrientation(row, col) {
		if (!board[row][col]) return null
		if (
			col < boardSize - 1 &&
			board[row][col + 1] &&
			board[row][col].ship === board[row][col + 1].ship
		) {
			return 'horizontal'
		}
		return 'vertical'
	}

	function receiveAttack(row, col) {
		if (board[row][col] === null) {
			missedShots.push({ row, col })
			return false
		} else {
			const hit = board[row][col].ship.hit(board[row][col].index)
			return hit
		}
	}

	function allShipsSunk() {
		return ships.every((ship) => ship.isSunk())
	}

	function clear() {
		board = Array(boardSize)
			.fill()
			.map(() => Array(boardSize).fill(null))
		ships.length = 0
		missedShots.length = 0
	}

	return {
		placeShip,
		receiveAttack,
		allShipsSunk,
		get board() {
			return board
		},
		get ships() {
			return ships
		},
		get missedShots() {
			return missedShots
		},
		clear,
		removeShip,
		getShipAt,
		getShipOrientation,
		canPlaceShip,
	}
}

export default GameBoard
