(function(){

	// Types of bees
	// const beeTypes = {
	// 		Queen  : {health : 100, hitDamage:7, needed: 3},
	// 		Worker : {health : 75, hitDamage: 12, needed: 5},
	// 		Drone  : {health : 50, hitDamage: 18, needed : 7}
	// }

	// For testing
	const beeTypes = {
			Queen  : {health : 100, hitDamage:100, needed: 1},
			Worker : {health : 75, hitDamage: 75, needed: 1},
			Drone  : {health : 50, hitDamage: 50, needed : 1}
	}

	// To hold the swarm
	let bees = []

	// hit button
	const hitBtn = document.getElementById("js-btn-hit")

	// reset button
	const resetBtn = document.getElementById('js-btn-reset')
 
	// Message holder
	let messageHolder = document.getElementById('js-dead-bee-msg')

 	// Start the action
	function init(){
	    newBees() //set up new bees
	    outPutHtml(bees)//output html	
	}


	// The basic bee 
	function Bee(type, health, hitDamage) {
	    this.type = type
	    this.health = health
	    this.hitDamage = hitDamage
	    this.status = "alive"
	    this.doDamage = function() {
	    	this.health -= this.hitDamage
	    	//this.health -= this.health
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
		if (checkQueens() !== beeTypes.Queen.needed){

			let currentBee = bees[beeToSlap]

			if (currentBee.status === "alive"){
				currentBee.doDamage()
				statusUpdate(currentBee)
			}else{
				// If bee is dead pick another random one and run function again
				slapThatBee(pickRandomBee())
			}

			// check to see if this slap killed the last queen
			if (checkQueens() === beeTypes.Queen.needed){
				killAllBees()
			}

		}else{
			//Kill all bees is all queens are dead
			killAllBees()
		}

		outPutHtml(bees)
	}

	function killAllBees(){

		// kill all the bees in the array and set status to dead
		for (let bee of bees){
			bee.health = 0
			bee.status = "dead"
		}

		messageHolder.textContent = 'They all dead, game over'
		removeClass(messageHolder, 'hide')
		hitBtn.setAttribute("disabled", "disabled")
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

	function pickRandomBee(){
		return Math.floor(Math.random()*bees.length)
	}


	// Feedback which bee was just slapped
	function statusUpdate(slappedBee){
		let statusMsg = `<p>A ${slappedBee.type} was slapped and lost ${slappedBee.hitDamage} points. It has ${slappedBee.health} health points remaining.</p>`
		document.getElementById("js-status").innerHTML = statusMsg
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
	 hitBtn.addEventListener('click', e => {
		slapThatBee(pickRandomBee())
	 })

	// Reset button
	resetBtn.addEventListener('click', e => {
		bees = [] // empty bees array
		hitBtn.removeAttribute("disabled")
		let messages = document.getElementsByClassName("js-msg")
			for(let i = 0; i < messages.length; i++){
				addClass(messages[i], 'hide')
			}
		init()
	})

    // Start slapping
    init()

})();
