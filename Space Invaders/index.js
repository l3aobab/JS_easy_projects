const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
	constructor() {
		
		this.velocity = {
			x: 0,
			y: 0
		}

		this.rotation = 0

		const image = new Image()
		image.src = './img/spaceship.png'
		image.onload = () => {
			const scale = 0.15
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20
			}
		}
	}

	draw() {
		context.save()
		context.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
		context.rotate(this.rotation)
		
		context.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)

		context.drawImage(
			this.image, 
			this.position.x, 
			this.position.y,
			this.width,
			this.height
		)

		context.restore()
	}

	update() {
		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x
		}
	}
}

class Projectile {
	constructor({ position, velocity}) {
		this.position = position
		this.velocity = velocity

		this.radius = 4
	}

	draw() {
		context.beginPath()
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		context.fillStyle = 'red'
		context.fill()
		context.closePath()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

class Invader {
	constructor({position}) {
		
		this.velocity = {
			x: 0,
			y: 0
		}

		const image = new Image()
		image.src = './img/invader.png'
		image.onload = () => {
			const scale = 1
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: position.x,
				y: position.y
			}
		}
	}

	draw() {
		context.drawImage(
			this.image, 
			this.position.x, 
			this.position.y,
			this.width,
			this.height
		)
	}

	update({velocity}) {
		if (this.image) {
			this.draw()
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}
}

class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0
		}

		this.velocity = {
			x: 3,
			y: 0
		}

		this.invaders = []

		const columns = Math.floor(Math.random() * 10 + 6)
		const rows = Math.floor(Math.random() * 5 + 3)

		this.width = columns * 30

		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(new Invader({
					position: {
						x: x * 30,
						y: y * 30
					}
				}))
			}
		}
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0

		if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
			this.velocity.x = -this.velocity.x
			this.velocity.y = 30
		}
	}
}

const player = new Player()
const projectiles = []
const grids = []
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	}
}

let frames = 0
let randomInterval = ((Math.random() * 500) + 1000)

function animate() {
	requestAnimationFrame(animate)
	context.fillStyle = 'black'
	context.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1)
			}, 0)
		} else {
			projectile.update()
		}
	})

	grids.forEach((grid, gridIndex) => {
		grid.update()
		grid.invaders.forEach((invader, i) => {
			invader.update({velocity: grid.velocity})
			projectiles.forEach((projectile, j) => {
				if (
					projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
					projectile.position.x + projectile.radius >= invader.position.x &&
					projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
					projectile.position.y + projectile.radius >= invader.position.y
				) {
					setTimeout(() => {
						const invaderFound = grid.invaders.find(
							(invader2) => invader2 === invader
						)
						const projectileFound = projectiles.find(
							(projectile2) => projectile2 === projectile
						)

						if (invaderFound && projectileFound) {
							grid.invaders.splice(i, 1)
							projectiles.splice(j, 1)

							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0]
								const lastInvader = grid.invaders[grid.invaders.length - 1]

								grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
								grid.position.x = firstInvader.position.x
							}
						} else {
							grids.splice(gridIndex, 1)
						}

					}, 0)
				}
			})
		})
	})

	if (keys.a.pressed && player.position.x >= 0) {
		player.velocity.x = -7
		player.rotation = -0.15
	} else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
		player.velocity.x = 7
		player.rotation = 0.15
	}else {
		player.velocity.x = 0
		player.rotation = 0
	}
	console.log(frames)
	if (frames % randomInterval === 0) {
		grids.push(new Grid())
		frames = 0
		randomInterval = Math.floor(Math.random() * 500 + 1000)
		console.log(randomInterval)
	}

	frames++
}

animate()

addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'a':
			keys.a.pressed = true
			break
		case 'd':
			keys.d.pressed = true
			break
		case ' ':
			projectiles.push(
				new Projectile({
					position:{
						x: player.position.x + player.width / 2,
						y: player.position.y
					},
					velocity: {
						x: 0,
						y: -10
					}
				})
			)
			break
	}
})

addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'a':
			keys.a.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
		case ' ':
			break
	}
})