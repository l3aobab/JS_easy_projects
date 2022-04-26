const birdElem = document.querySelector("[data-bird]")
const BIRD_SPEED = 5

export function updateBird(delta) {
	setTop(getTop() + BIRD_SPEED)
}

function setTop(top) {
	birdElem.style.setProperty("--bird-top", top)
}

function getTop() {
	return parseFloat(getComputedStyle(birdElem).getPropertyValue("--bird-top"))
}