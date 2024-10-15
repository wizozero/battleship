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

	function receiveAttack(row, col) {
		if (board[row][col] === null) {
			missedShots.push({ row, col })
			return false
		} else {
			board[row][col].ship.hit(board[row][col].index)
			return true
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
		canPlaceShip,
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
	}
}

export default GameBoard
