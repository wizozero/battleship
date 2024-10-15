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

		if (isNaN(row) || isNaN(col) || !gameboard.board || !gameboard.board[row]) {
			console.error(
				'Invalid row or column, or gameboard structure is incorrect',
				{ row, col, gameboard }
			)
			return
		}

		const cellContent = gameboard.board[row][col]

		cell.classList.remove('ship', 'hit', 'miss', 'sunk')

		if (cellContent === null) {
			if (
				gameboard.missedShots.some(
					(shot) => shot.row === row && shot.col === col
				)
			) {
				cell.classList.add('miss')
			}
		} else if (typeof cellContent === 'object') {
			const { ship, position } = cellContent
			if (!hideShips && !ship.isHit(position)) {
				cell.classList.add('ship')
			}
			if (ship.isHit(position)) {
				cell.classList.add('hit')
				if (ship.isSunk()) {
					// Marcar todas las celdas del barco como hundidas
					gameboard.board.forEach((row, rowIndex) => {
						row.forEach((col, colIndex) => {
							if (col && col.ship === ship) {
								const shipCell = boardElement.querySelector(
									`[data-row="${rowIndex}"][data-col="${colIndex}"]`
								)
								if (shipCell) {
									shipCell.classList.add('sunk')
								}
							}
						})
					})
				}
			}
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

	if (checkGameOver()) return

	if (attackResult) {
		// Si fue un hit, el jugador mantiene su turno
		updateTurnIndicator()
	} else {
		// Si el ataque no fue exitoso (es decir, fue un miss o un hit repetido), cambia el turno
		currentPlayer = computer
		updateTurnIndicator()
		setTimeout(computerTurn, 1000) // Retraso para que el jugador pueda ver su acción
	}
}

function computerTurn() {
	if (currentPlayer !== computer) return

	const { row, col } = computer.randomAttack(player.gameboard)
	const attackResult = player.gameboard.receiveAttack(row, col)
	updateBoardDisplay(player.gameboard, document.querySelector('#boardRight'))

	if (checkGameOver()) return

	if (!attackResult) {
		// Si el ataque no fue exitoso, cambia el turno
		currentPlayer = player
		updateTurnIndicator()
	} else {
		// Si fue un hit, el ordenador mantiene su turno
		setTimeout(computerTurn, 1000) // El ordenador vuelve a atacar después de un breve retraso
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
	const computerBoard = document.querySelector('#boardLeft')
	const cells = computerBoard.querySelectorAll('.cell')
	cells.forEach((cell) => {
		cell.removeEventListener('click', playerAttack)
		cell.style.cursor = 'not-allowed'
	})
}

function updateTurnIndicator() {
	const indicator = document.getElementById('turn-indicator')
	indicator.textContent =
		currentPlayer === player ? 'Your turn' : "Computer's turn"
}

// Llama a esta función al inicio del juego y después de cada turno
function startGame() {
	newGame()
	updateTurnIndicator()
}

// Modifica tus funciones playerAttack y computerTurn para incluir:
updateTurnIndicator()

// Y en el event listener del botón de inicio:
startBtn.addEventListener('click', startGame)
