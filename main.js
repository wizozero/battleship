function Ship(length) {
	let hitCount = 0
	let sunk = false

	return {
		get length() {
			return length
		},
		get hitCount() {
			return hitCount
		},
		get isSunk() {
			return sunk
		},
		hit() {
			hitCount++
			this.checkSunk()
		},
		checkSunk() {
			if (hitCount >= length) {
				sunk = true
			}
		},
	}
}
