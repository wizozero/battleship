// shipPlacement.js

export function initializeDragAndDrop(player) {
	const playerBoard = document.getElementById('player-board')
	const ships = document.querySelectorAll('.ship-item')

	ships.forEach((ship) => {
		ship.setAttribute('draggable', true)
		ship.addEventListener('dragstart', dragStart)
	})

	playerBoard.addEventListener('dragover', dragOver)
	playerBoard.addEventListener('drop', (e) => drop(e, player))
}

function dragStart(e) {
	e.dataTransfer.setData('text/plain', e.target.id)
}

function dragOver(e) {
	e.preventDefault()
}

function drop(e, player) {
	e.preventDefault()
	const shipId = e.dataTransfer.getData('text')
	const ship = document.getElementById(shipId)
	const cell = e.target.closest('.cell')

	if (cell && isValidPlacement(ship, cell, player)) {
		placeShip(ship, cell, player)
	}
}

function isValidPlacement(ship, cell, player) {
	const shipLength = parseInt(ship.dataset.length)
	const row = parseInt(cell.dataset.row)
	const col = parseInt(cell.dataset.col)

	return (
		player.gameboard.canPlaceShip(row, col, 'horizontal', shipLength) ||
		player.gameboard.canPlaceShip(row, col, 'vertical', shipLength)
	)
}

function placeShip(ship, startCell, player) {
	const shipLength = parseInt(ship.dataset.length)
	const row = parseInt(startCell.dataset.row)
	const col = parseInt(startCell.dataset.col)

	if (player.gameboard.canPlaceShip(row, col, 'horizontal', shipLength)) {
		player.gameboard.placeShip(row, col, 'horizontal', shipLength)
	} else {
		player.gameboard.placeShip(row, col, 'vertical', shipLength)
	}

	updateBoardDisplay(player.gameboard, document.getElementById('player-board'))
	ship.style.display = 'none'
}

export function randomizePlayerShips(player) {
	const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
	player.gameboard.clear()

	ships.forEach((length) => {
		let placed = false
		while (!placed) {
			const row = Math.floor(Math.random() * 10)
			const col = Math.floor(Math.random() * 10)
			const isHorizontal = Math.random() < 0.5
			placed = player.gameboard.placeShip(
				row,
				col,
				isHorizontal ? 'horizontal' : 'vertical',
				length
			)
		}
	})

	updateBoardDisplay(player.gameboard, document.getElementById('player-board'))
	document
		.querySelectorAll('.ship-item')
		.forEach((ship) => (ship.style.display = 'none'))
}

function updateBoardDisplay(gameboard, boardElement) {
	const cells = boardElement.querySelectorAll('.cell')
	cells.forEach((cell) => {
		const row = parseInt(cell.dataset.row)
		const col = parseInt(cell.dataset.col)
		cell.className = 'cell'
		if (gameboard.board[row][col] !== null) {
			cell.classList.add('ship')
		}
	})
}
