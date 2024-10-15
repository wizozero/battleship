// index.js

import Player from './player.js'
import { initializeDragAndDrop, randomizePlayerShips } from './shipPlacement.js'
import { renderBoard, updateBoardDisplay } from './boardRenderer.js'
import { createShipList, updateShipList } from './shipListRenderer.js'

let player, computer, currentPlayer
const turnIndicator = document.getElementById('turn-indicator')

function initGame() {
	player = Player(false)
	computer = Player(true)

	// Randomize computer ship placement
	const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
	shipLengths.forEach((length) => {
		let placed = false
		while (!placed) {
			const row = Math.floor(Math.random() * 10)
			const col = Math.floor(Math.random() * 10)
			const isHorizontal = Math.random() < 0.5
			placed = computer.gameboard.placeShip(
				row,
				col,
				isHorizontal ? 'horizontal' : 'vertical',
				length
			)
		}
	})

	currentPlayer = player

	const computerBoardContainer = document.getElementById('computer-board')
	const playerBoardContainer = document.getElementById('player-board')

	computerBoardContainer.innerHTML = ''
	playerBoardContainer.innerHTML = ''

	computerBoardContainer.appendChild(renderBoard('computer'))
	playerBoardContainer.appendChild(renderBoard('player'))

	createShipList(shipLengths, 'player-ships')

	updateBoards()
	updateTurnIndicator()

	initializeDragAndDrop(player)
}

function updateBoards() {
	updateBoardDisplay(player.gameboard, document.getElementById('player-board'))
	updateBoardDisplay(
		computer.gameboard,
		document.getElementById('computer-board'),
		true
	)
	updateShipList(player.gameboard.ships, 'player-ships')
}

function updateTurnIndicator() {
	turnIndicator.textContent =
		currentPlayer === player ? 'Your turn' : "Computer's turn"
}

function playerAttack(row, col) {
	if (currentPlayer !== player) return

	const attackResult = computer.gameboard.receiveAttack(row, col)
	updateBoards()

	if (checkGameOver()) return

	if (!attackResult) {
		currentPlayer = computer
		updateTurnIndicator()
		setTimeout(computerTurn, 1000)
	}
}

function computerTurn() {
	if (currentPlayer !== computer) return

	const { row, col } = computer.randomAttack(player.gameboard)
	const attackResult = player.gameboard.receiveAttack(row, col)
	updateBoards()

	if (checkGameOver()) return

	if (!attackResult) {
		currentPlayer = player
		updateTurnIndicator()
	} else {
		setTimeout(computerTurn, 1000)
	}
}

function checkGameOver() {
	if (computer.gameboard.allShipsSunk()) {
		alert('You win!')
		disableBoard()
		return true
	} else if (player.gameboard.allShipsSunk()) {
		alert('Computer wins!')
		disableBoard()
		return true
	}
	return false
}

function disableBoard() {
	const computerBoard = document.getElementById('computer-board')
	computerBoard.querySelectorAll('.cell').forEach((cell) => {
		cell.removeEventListener('click', playerAttack)
		cell.style.cursor = 'not-allowed'
	})
}

function startGame() {
	if (player.gameboard.ships.length === 0) {
		alert('Please place your ships before starting the game.')
		return
	}
	turnIndicator.style.display = 'block'
	document.getElementById('randomize-button').style.display = 'none'
	document.getElementById('start-btn').style.display = 'none'
	document.getElementById('player-ships').style.display = 'none'
}

const startBtn = document.getElementById('start-btn')
startBtn.addEventListener('click', startGame)

const randomizeBtn = document.getElementById('randomize-button')
randomizeBtn.addEventListener('click', () => {
	randomizePlayerShips(player)
	updateBoards()
})

turnIndicator.style.display = 'none'
window.playerAttack = playerAttack

// Initialize the game
initGame()
