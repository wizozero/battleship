// ship.test.js
import Ship from './ship'

describe('Ship', () => {
	let ship

	beforeEach(() => {
		ship = Ship(3) // Creamos un barco de longitud 3 para cada test
	})

	test('should be created with the correct length', () => {
		expect(ship.length).toBe(3)
	})

	test('should start with 0 hits', () => {
		expect(ship.hitCount).toBe(0)
	})

	test('should not be sunk initially', () => {
		expect(ship.isSunk).toBe(false)
	})

	test('hit() should increase hitCount', () => {
		ship.hit()
		expect(ship.hitCount).toBe(1)
	})

	test('should be sunk when hits equal length', () => {
		ship.hit()
		ship.hit()
		expect(ship.isSunk).toBe(false)
		ship.hit()
		expect(ship.isSunk).toBe(true)
	})

	test('should remain sunk after excess hits', () => {
		ship.hit()
		ship.hit()
		ship.hit()
		ship.hit() // Extra hit
		expect(ship.isSunk).toBe(true)
	})
})
