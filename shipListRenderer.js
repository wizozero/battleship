export function createShipList(ships, containerId) {
	const container = document.getElementById(containerId)
	if (!container) {
		console.error(`Container with id "${containerId}" not found`)
		return
	}
	container.innerHTML = ''
	if (!ships || !Array.isArray(ships)) {
		console.error('Invalid ships array')
		return
	}
	ships.forEach((ship, index) => {
		const shipElement = document.createElement('div')
		shipElement.classList.add('ship-item')
		shipElement.id = `ship-${index}`
		for (let i = 0; i < ship.length; i++) {
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
		if (ship.isSunk()) {
			shipElement.classList.add('sunk')
		}
	})
}
