function Ship(length) {
	const hits = new Array(length).fill(false)

	return {
		length,
		hit(position) {
			if (position >= 0 && position < length && !hits[position]) {
				hits[position] = true
				return true
			}
			return false
		},
		isHit(position) {
			return hits[position]
		},
		isSunk() {
			return hits.every((hit) => hit)
		},
	}
}

export default Ship
