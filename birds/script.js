import { updateBird } from "./bird.js"

document.addEventListener("keypress", handleStart, { once: true })
const title = document.querySelector("[data-title")

let lastTime
function updateLoop(time) {
	if (lastTime == null) {
		lastTime = time
		window.requestAnimationFrame(updateLoop)
		return
	}
	const delta = time = lastTime
	updateBird(delta)
	lastTime = time
	window.requestAnimationFrame(updateLoop)
}

function handleStart() {
	title.classList.add("hide")
	window.requestAnimationFrame(updateLoop)
}

function handleLose() {
	
}