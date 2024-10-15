// boardRenderer.js

export function renderBoard(playerType) {
	const board = document.createElement('div')
	board.classList.add('board')

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			cell.dataset.row = i
			cell.dataset.col = j
			if (playerType === 'computer') {
				cell.addEventListener('click', () => window.playerAttack(i, j))
				cell.style.cursor = 'pointer'
			}
			board.appendChild(cell)
		}
	}

	return board
}

export function updateBoardDisplay(gameboard, boardElement, hideShips = false) {
	const cells = boardElement.querySelectorAll('.cell')
	cells.forEach((cell) => {
		const row = parseInt(cell.dataset.row)
		const col = parseInt(cell.dataset.col)

		cell.className = 'cell'

		if (gameboard.board[row][col] === null) {
			if (
				gameboard.missedShots.some(
					(shot) => shot.row === row && shot.col === col
				)
			) {
				cell.classList.add('miss')
			}
		} else {
			const shipCell = gameboard.board[row][col]
			if (!hideShips) {
				cell.classList.add('ship')
			}
			if (shipCell.ship.isHit(shipCell.index)) {
				cell.classList.add('hit')
				if (shipCell.ship.isSunk()) {
					cell.classList.add('sunk')
				}
			}
		}
	})
}
