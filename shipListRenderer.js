// shipListRenderer.js

export function createShipList(ships, containerId) {
	const container = document.getElementById(containerId)
	if (!container) {
		console.error(`Container with id "${containerId}" not found`)
		return
	}
	container.innerHTML = ''
	ships.forEach((length, index) => {
		const shipElement = document.createElement('div')
		shipElement.classList.add('ship-item')
		shipElement.id = `ship-${index}`
		shipElement.dataset.length = length
		for (let i = 0; i < length; i++) {
			const cell = document.createElement('div')
			cell.classList.add('ship-cell')
			shipElement.appendChild(cell)
		}
		container.appendChild(shipElement)
	})
}

export function updateShipList(ships, containerId) {
	ships.forEach((ship, index) => {
		const shipElement = document.getElementById(`ship-${index}`)
		if (shipElement && ship.isSunk()) {
			shipElement.classList.add('sunk')
		}
	})
}
