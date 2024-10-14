function Ship(length) {
	let hitCount = 0

	return {
		length,
		hit() {
			if (hitCount < length) hitCount++
		},
		isSunk() {
			return hitCount === length
		},
		get hitCount() {
			return hitCount
		},
	}
}

export default Ship
