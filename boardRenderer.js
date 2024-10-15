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
