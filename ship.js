function Ship(length) {
	let hitCount = 0
	let isHit = false

	return {
		length,
		hit() {
			if (hitCount < length) {
				hitCount++
				isHit = true
			}
		},
		isSunk() {
			return hitCount === length
		},
		get hitCount() {
			return hitCount
		},
		get isHit() {
			return isHit
		},
	}
}

export default Ship
