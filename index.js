import Player from './player.js'
import { renderBoard, updateBoardDisplay } from './boardRenderer.js'
import { createShipList, updateShipList } from './shipListRenderer.js'

const startBtn = document.querySelector('#start-btn')
const turnIndicator = document.getElementById('turn-indicator')
const gameContainer = document.getElementById('game-container')

let player, computer, currentPlayer

function initGame() {
	const defaultCoords = [
		[
			[0, 0, 'horizontal', 4],
			[2, 3, 'vertical', 3],
			[5, 5, 'horizontal', 2],
		],
		[
			[1, 1, 'vertical', 4],
			[3, 4, 'horizontal', 3],
			[6, 6, 'vertical', 2],
		],
	]

	player = Player(false)
	computer = Player(true)

	defaultCoords[0].forEach((coord) => player.gameboard.placeShip(...coord))
	defaultCoords[1].forEach((coord) => computer.gameboard.placeShip(...coord))

	currentPlayer = player

	const computerBoardContainer = document.getElementById('computer-board')
	const playerBoardContainer = document.getElementById('player-board')

	computerBoardContainer.innerHTML = ''
	playerBoardContainer.innerHTML = ''

	computerBoardContainer.appendChild(renderBoard('computer'))
	playerBoardContainer.appendChild(renderBoard('player'))

	createShipList(player.gameboard.ships, 'player-ships')

	updateBoards()
	updateTurnIndicator()
}

function updateBoards() {
	updateBoardDisplay(
		computer.gameboard,
		document.querySelector('#computer-board'),
		true
	)
	updateBoardDisplay(player.gameboard, document.querySelector('#player-board'))
	updateShipList(player.gameboard.ships, 'player-ships')
}

function playerAttack(row, col) {
	if (currentPlayer !== player) return

	const attackResult = computer.gameboard.receiveAttack(row, col)
	updateBoards()

	if (checkGameOver()) return

	if (attackResult) {
		updateTurnIndicator()
	} else {
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
	let gameOver = false
	let message = ''

	if (computer.gameboard.isAllShipsSunk()) {
		gameOver = true
		message = 'Player wins!'
	} else if (player.gameboard.isAllShipsSunk()) {
		gameOver = true
		message = 'Computer wins!'
	}

	if (gameOver) {
		alert(message)
		disableBoard()
		return true
	}
	return false
}

function disableBoard() {
	const computerBoard = document.querySelector('#computer-board')
	computerBoard.querySelectorAll('.cell').forEach((cell) => {
		cell.removeEventListener('click', playerAttack)
		cell.style.cursor = 'not-allowed'
	})
}

function updateTurnIndicator() {
	turnIndicator.textContent =
		currentPlayer === player ? 'Your turn' : "Computer's turn"
}

function startGame() {
	initGame()
	turnIndicator.style.display = 'block'
}

startBtn.addEventListener('click', startGame)
turnIndicator.style.display = 'none'
window.playerAttack = playerAttack
