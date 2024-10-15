// shipPlacement.js
import { updateBoardDisplay } from './boardRenderer.js'

let draggedShip = null
let dragOffsetX = 0
let dragOffsetY = 0
let currentPlayer = null

export function initializeDragAndDrop(player) {
	currentPlayer = player
	const playerBoard = document.getElementById('player-board')
	const shipList = document.getElementById('player-ships')

	shipList.addEventListener('mousedown', startDragFromList)
	playerBoard.addEventListener('mousedown', startDragFromBoard)
	document.addEventListener('mousemove', drag)
	document.addEventListener('mouseup', endDrag)
	playerBoard.addEventListener('dblclick', (e) => rotateShip(e, player))
}

function startDragFromList(e) {
	const shipItem = e.target.closest('.ship-item')
	if (!shipItem) return

	const length = parseInt(shipItem.dataset.length)
	draggedShip = {
		element: createDragElement(length, 'horizontal'),
		length: length,
		isNew: true,
		originalElement: shipItem,
	}

	document.body.appendChild(draggedShip.element)

	const rect = shipItem.getBoundingClientRect()
	dragOffsetX = e.clientX - rect.left
	dragOffsetY = e.clientY - rect.top

	shipItem.style.opacity = '0.5' // Make the original ship semi-transparent

	drag(e)
}

function startDragFromBoard(e) {
	const cell = e.target.closest('.cell')
	if (!cell || !cell.classList.contains('ship')) return

	const row = parseInt(cell.dataset.row)
	const col = parseInt(cell.dataset.col)
	const ship = currentPlayer.gameboard.getShipAt(row, col)
	if (!ship) return

	const orientation = currentPlayer.gameboard.getShipOrientation(row, col)

	draggedShip = {
		element: createDragElement(ship.length, orientation),
		ship: ship,
		startRow: row,
		startCol: col,
		orientation: orientation,
		isNew: false,
		length: ship.length,
	}

	document.body.appendChild(draggedShip.element)

	const rect = cell.getBoundingClientRect()
	dragOffsetX = e.clientX - rect.left
	dragOffsetY = e.clientY - rect.top

	currentPlayer.gameboard.removeShip(row, col)
	updateBoardDisplay(
		currentPlayer.gameboard,
		document.getElementById('player-board')
	)

	drag(e)
}

function drag(e) {
	if (!draggedShip) return

	draggedShip.element.style.left = `${e.clientX - dragOffsetX}px`
	draggedShip.element.style.top = `${e.clientY - dragOffsetY}px`

	const playerBoard = document.getElementById('player-board')
	const boardRect = playerBoard.getBoundingClientRect()
	const shipRect = draggedShip.element.getBoundingClientRect()

	const row = Math.floor((shipRect.top - boardRect.top) / 30)
	const col = Math.floor((shipRect.left - boardRect.left) / 30)

	clearHighlight()

	if (row >= 0 && row < 10 && col >= 0 && col < 10) {
		const canPlace = currentPlayer.gameboard.canPlaceShip(
			row,
			col,
			draggedShip.orientation || 'horizontal',
			draggedShip.length
		)
		highlightCells(
			row,
			col,
			draggedShip.orientation || 'horizontal',
			draggedShip.length,
			canPlace
		)
	}
}

function endDrag() {
	if (!draggedShip) return

	const playerBoard = document.getElementById('player-board')
	const boardRect = playerBoard.getBoundingClientRect()
	const shipRect = draggedShip.element.getBoundingClientRect()

	const row = Math.floor((shipRect.top - boardRect.top) / 30)
	const col = Math.floor((shipRect.left - boardRect.left) / 30)

	let placed = false
	if (
		row >= 0 &&
		row < 10 &&
		col >= 0 &&
		col < 10 &&
		currentPlayer.gameboard.canPlaceShip(
			row,
			col,
			draggedShip.orientation || 'horizontal',
			draggedShip.length
		)
	) {
		currentPlayer.gameboard.placeShip(
			row,
			col,
			draggedShip.orientation || 'horizontal',
			draggedShip.length
		)
		placed = true
	} else if (!draggedShip.isNew) {
		// If the ship was already on the board and couldn't be placed in the new position,
		// place it back in its original position
		currentPlayer.gameboard.placeShip(
			draggedShip.startRow,
			draggedShip.startCol,
			draggedShip.orientation,
			draggedShip.length
		)
		placed = true
	}

	updateBoardDisplay(currentPlayer.gameboard, playerBoard)
	clearHighlight()

	document.body.removeChild(draggedShip.element)

	if (draggedShip.isNew && placed) {
		draggedShip.originalElement.style.display = 'none' // Hide the ship in the list if it was placed
	} else if (draggedShip.isNew) {
		draggedShip.originalElement.style.opacity = '1' // Restore opacity if not placed
	}

	draggedShip = null

	if (currentPlayer.gameboard.ships.length === 10) {
		document
			.querySelectorAll('.ship-item')
			.forEach((item) => (item.style.display = 'none'))
	}
}

function createDragElement(length, orientation) {
	const element = document.createElement('div')
	element.className = 'dragged-ship'
	element.dataset.orientation = orientation

	for (let i = 0; i < length; i++) {
		const cell = document.createElement('div')
		cell.className = 'ship-cell'
		element.appendChild(cell)
	}

	element.style.position = 'absolute'
	element.style.display = 'flex'
	element.style.flexDirection = orientation === 'horizontal' ? 'row' : 'column'
	element.style.zIndex = '1000'

	return element
}

function highlightCells(row, col, orientation, length, canPlace) {
	const playerBoard = document.getElementById('player-board')
	const highlightClass = canPlace ? 'highlight-valid' : 'highlight-invalid'

	for (let i = 0; i < length; i++) {
		const cellRow = orientation === 'horizontal' ? row : row + i
		const cellCol = orientation === 'horizontal' ? col + i : col

		if (cellRow >= 0 && cellRow < 10 && cellCol >= 0 && cellCol < 10) {
			const cell = playerBoard.querySelector(
				`[data-row="${cellRow}"][data-col="${cellCol}"]`
			)
			if (cell) {
				cell.classList.add(highlightClass)
			}
		}
	}
}

function clearHighlight() {
	const playerBoard = document.getElementById('player-board')
	playerBoard
		.querySelectorAll('.highlight-valid, .highlight-invalid')
		.forEach((cell) => {
			cell.classList.remove('highlight-valid', 'highlight-invalid')
		})
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

export function rotateShip(e, player) {
	e.preventDefault() // Prevent default double-click behavior
	const cell = e.target.closest('.cell')
	if (!cell || !cell.classList.contains('ship')) return

	const row = parseInt(cell.dataset.row)
	const col = parseInt(cell.dataset.col)
	const ship = player.gameboard.getShipAt(row, col)
	if (!ship) return

	const currentOrientation = player.gameboard.getShipOrientation(row, col)
	const newOrientation =
		currentOrientation === 'horizontal' ? 'vertical' : 'horizontal'

	// Store the ship's length before removing it
	const shipLength = ship.length

	player.gameboard.removeShip(row, col)

	let newRow = row
	let newCol = col

	// Adjust position if rotating would place the ship out of bounds
	if (newOrientation === 'vertical' && row + shipLength > 10) {
		newRow = 10 - shipLength
	} else if (newOrientation === 'horizontal' && col + shipLength > 10) {
		newCol = 10 - shipLength
	}

	if (
		player.gameboard.canPlaceShip(newRow, newCol, newOrientation, shipLength)
	) {
		player.gameboard.placeShip(newRow, newCol, newOrientation, shipLength)
	} else {
		// If can't place in new orientation, revert to original position and orientation
		player.gameboard.placeShip(row, col, currentOrientation, shipLength)
	}

	updateBoardDisplay(player.gameboard, document.getElementById('player-board'))
}
