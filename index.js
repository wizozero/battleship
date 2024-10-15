import Player from './player.js'

const startBtn = document.querySelector('#start-btn')

let player
let computer
let currentPlayer

function newGame() {
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
	renderBoards()
}

function renderBoards() {
	const computerBoard = document.querySelector('#boardLeft')
	const playerBoard = document.querySelector('#boardRight')

	playerBoard.innerHTML = ''
	computerBoard.innerHTML = ''

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			const playerCell = document.createElement('div')
			playerCell.classList.add('cell')
			playerCell.dataset.row = i
			playerCell.dataset.col = j
			playerBoard.appendChild(playerCell)

			const computerCell = document.createElement('div')
			computerCell.classList.add('cell')
			computerCell.dataset.row = i
			computerCell.dataset.col = j
			computerCell.addEventListener('click', () => playerAttack(i, j))
			computerCell.style.cursor = 'pointer'
			computerBoard.appendChild(computerCell)
		}
	}
	updateBoardDisplay(player.gameboard, playerBoard)
	updateBoardDisplay(computer.gameboard, computerBoard, true)
}

function updateBoardDisplay(gameboard, boardElement, hideShips = false) {
	const cells = boardElement.querySelectorAll('.cell')
	cells.forEach((cell) => {
		const row = parseInt(cell.dataset.row)
		const col = parseInt(cell.dataset.col)

		// Comprobación de seguridad
		if (isNaN(row) || isNaN(col) || !gameboard.board || !gameboard.board[row]) {
			console.error(
				'Invalid row or column, or gameboard structure is incorrect',
				{ row, col, gameboard }
			)
			return // Skip this iteration
		}

		const cellContent = gameboard.board[row][col]

		if (cellContent === null) {
			cell.classList.remove('ship', 'hit', 'miss')
		} else if (typeof cellContent === 'object') {
			if (!hideShips) cell.classList.add('ship')
			if (cellContent.isHit) cell.classList.add('hit')
		}

		if (
			gameboard.missedShots &&
			gameboard.missedShots.some((shot) => shot.row === row && shot.col === col)
		) {
			cell.classList.add('miss')
		}
	})
}

function playerAttack(row, col) {
	if (currentPlayer !== player) return

	const attackResult = computer.gameboard.receiveAttack(row, col)
	updateBoardDisplay(
		computer.gameboard,
		document.querySelector('#boardLeft'),
		true
	)

	if (attackResult) {
		if (checkGameOver()) return
		computerTurn()
	}
}

function computerTurn() {
	currentPlayer = computer
	setTimeout(() => {
		const { row, col } = computer.randomAttack(player.gameboard)
		updateBoardDisplay(player.gameboard, document.querySelector('#boardRight'))
		if (checkGameOver()) return
		currentPlayer = player
	}, 1000)
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
	const computerBoard = document.querySelector('#boardLeft')
	const cells = computerBoard.querySelectorAll('.cell')
	cells.forEach((cell) => {
		cell.removeEventListener('click', playerAttack)
		cell.style.cursor = 'not-allowed'
	})
}

startBtn.addEventListener('click', newGame)
