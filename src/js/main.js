// Types of bees
const beeTypes = {
		Queen  : {health : 100, hitDamage:7, needed: 3},
		Worker : {health : 75, hitDamage: 12, needed: 5},
		Drone  : {health : 50, hitDamage: 18, needed : 7}
}


// To hold the swarm
let bees = [] 


// The basic bee 
function Bee(type, health, hitDamage) {
    this.type = type
    this.health = health
    this.hitDamage = hitDamage
    this.status = "alive"
    this.doDamage = function() {
    	this.health -= this.hitDamage
    	if (this.health <= 0 ){
    		this.status = "dead"
    		this.health = 0
    	}
    }
}


// Set up new bees
function newBees(){
	for (const prop in beeTypes) {
		const thisBee = beeTypes[prop]
		for (let i = 0; i < thisBee.needed; i++) {
			bees.push(new Bee (prop, thisBee.health, thisBee.hitDamage))
		}	
  	}
}


// Output bees to page
function outPutHtml(bees){
	let beeRows = ""
	for (let i = 0; i < bees.length; i++) {		
		beeRows +=`<tr><td>${bees[i].type}</td><td>${bees[i].health}</td><td>${bees[i].status}</td><tr>`
	}
	document.getElementById("js-bee-rows").innerHTML = beeRows
}


// Slap the bee
function slapThatBee(beeToSlap) {

	// Check if all the Queens are dead	
	if (checkQueens() !== 3){

		let currentBee = bees[beeToSlap]

		if (currentBee.status === "alive"){
			currentBee.doDamage()
			statusUpdate(currentBee)
			addClass(document.getElementById("js-dead-bee-msg"), 'hide')
		}else{
			// If bee is dead show msg to slap another
			removeClass(document.getElementById("js-dead-bee-msg"), 'hide')
		}

	}else{
		// If all the queens are dead, so are the rest
		for (let i = 0; i < bees.length; i++) {	
			bees[i].status = "dead"
		}
		
		removeClass(document.getElementById("js-dead-bee-msg"), 'hide')
		document.getElementById("js-dead-bee-msg").textContent = 'They all dead'
		document.getElementById("js-btn-hit").addAttribute("disabled")

	}

	outPutHtml(bees)
}



// Check for dead Queens
function checkQueens(){
	let deadQueens = 0
	for (let i = 0; i < bees.length; i++) {
		if(bees[i].type === "Queen" && bees[i].status === "dead" ){
			deadQueens ++
		}
	}
	return deadQueens
}


// Feedback which bee was just slapped
function statusUpdate(slappedBee){
	document.getElementById("js-status-type").textContent = slappedBee.type
	document.getElementById("js-status-health-lost").textContent = slappedBee.hitDamage
	document.getElementById("js-status-health-remaining").textContent = slappedBee.health
	removeClass(document.getElementById("js-status"), 'hide')
}


// Adding and removing classes
// From: https://jaketrent.com/post/addremove-classes-raw-javascript/
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}


function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}


function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}


// Slap bee button
 document.getElementById('js-btn-hit').addEventListener('click', e => {
	let aliveBees = bees.filter(bee => bee.status === 'alive')
	slapThatBee(Math.floor(Math.random()*aliveBees.length))
 })


// Reset button
 document.getElementById('js-btn-reset').addEventListener('click', e => {
	bees = [] // empty bees array
	newBees() // new bees please
	outPutHtml(bees) // reset the stage
	document.getElementById("js-btn-hit").removeAttribute("disabled")
	let messages = document.getElementsByClassName("js-msg")
	for(let i = 0; i < messages.length; i++){
		messages[i].classList.add("hide")
	}
 })


