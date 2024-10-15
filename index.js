import Player from './player.js'
import { initializeDragAndDrop, randomizePlayerShips } from './shipPlacement.js'
import { renderBoard, updateBoardDisplay } from './boardRenderer.js'
import { createShipList, updateShipList } from './shipListRenderer.js'

let player, computer, currentPlayer
let gameInProgress = false
const turnIndicator = document.getElementById('turn-indicator')
const gameControlButton = document.getElementById('game-control-button')
const randomizeButton = document.getElementById('randomize-button')
const playerShipsContainer = document.getElementById('player-ships-container')

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

	gameControlButton.textContent = 'Start Game'
	gameControlButton.onclick = startGame

	randomizeButton.style.display = 'inline-block'
	playerShipsContainer.style.display = 'block'

	gameInProgress = false
}

function updateTurnIndicator() {
	turnIndicator.textContent = gameInProgress
		? currentPlayer === player
			? 'Your turn'
			: "Computer's turn"
		: 'Place your ships'
}

function playerAttack(row, col) {
	if (currentPlayer !== player || !gameInProgress) return

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
	console.log(`Computer attacking (${row}, ${col})`)
	console.log(
		'Player board before attack:',
		JSON.parse(JSON.stringify(player.gameboard.board))
	)

	const attackResult = player.gameboard.receiveAttack(row, col)

	console.log(
		`Computer attacked (${row}, ${col}). Result: ${
			attackResult ? 'Hit' : 'Miss'
		}`
	)
	console.log(
		'Player board after attack:',
		JSON.parse(JSON.stringify(player.gameboard.board))
	)

	updateBoards()

	if (checkGameOver()) return

	if (!attackResult) {
		currentPlayer = player
		updateTurnIndicator()
	} else {
		setTimeout(computerTurn, 1000)
	}
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

function checkGameOver() {
	if (computer.gameboard.allShipsSunk()) {
		endGame('You win!')
		return true
	} else if (player.gameboard.allShipsSunk()) {
		endGame('Computer wins!')
		return true
	}
	return false
}

function endGame(message) {
	alert(message)
	gameInProgress = false
	disableBoard()
	gameControlButton.textContent = 'New Game'
	gameControlButton.onclick = initGame
}

function disableBoard() {
	const computerBoard = document.getElementById('computer-board')
	computerBoard.querySelectorAll('.cell').forEach((cell) => {
		cell.removeEventListener('click', playerAttack)
		cell.style.cursor = 'not-allowed'
	})
}

function startGame() {
	if (player.gameboard.ships.length === 10) {
		gameInProgress = true
		turnIndicator.style.display = 'block'
		randomizeButton.style.display = 'none'
		gameControlButton.textContent = 'Restart Game'
		gameControlButton.onclick = initGame
		playerShipsContainer.style.display = 'none'
		enableComputerBoard()
		updateTurnIndicator()
	} else {
		alert('Please place all your ships before starting the game.')
	}
}

function enableComputerBoard() {
	const computerBoard = document.getElementById('computer-board')
	computerBoard.querySelectorAll('.cell').forEach((cell) => {
		cell.addEventListener('click', () =>
			playerAttack(parseInt(cell.dataset.row), parseInt(cell.dataset.col))
		)
		cell.style.cursor = 'pointer'
	})
}

randomizeButton.addEventListener('click', () => {
	randomizePlayerShips(player)
	updateBoards()
})

window.playerAttack = playerAttack

// Initialize the game
initGame()
