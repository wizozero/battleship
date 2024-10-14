import Player from './player.js'
import GameBoard from './gameboard.js'

describe('Player', () => {
	let player
	let enemyGameboard

	beforeEach(() => {
		player = Player()
		enemyGameboard = GameBoard()
	})

	test('Player should have a gameboard', () => {
		expect(player.gameboard).toBeDefined()
	})

	test('Player can attack enemy gameboard', () => {
		expect(player.attack(enemyGameboard, 0, 0)).toBeDefined()
	})

	test('Computer player can make random attacks', () => {
		const computerPlayer = Player(true)
		const result = computerPlayer.randomAttack(enemyGameboard)
		expect(result).toHaveProperty('row')
		expect(result).toHaveProperty('col')
	})
})
