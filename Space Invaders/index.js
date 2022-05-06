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
		//context.fillStyle = 'red'
		//context.fillRect(
		//	this.position.x, 
		//	this.position.y, 
		//	this.width, 
		//	this.height
		//)

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

class Invader {
	constructor() {
		
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
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height / 2
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

	update() {
		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x
			this.position.y += this.velocity.y
		}
	}
}

class Projectile {
	constructor({ position, velocity}) {
		this.position = position
		this.velocity = velocity

		this.radius = 3
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

const player = new Player()
const projectiles = []
const invader = new Invader()
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

function animate() {
	requestAnimationFrame(animate)
	context.fillStyle = 'black'
	context.fillRect(0, 0, canvas.width, canvas.height)
	invader.update()
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