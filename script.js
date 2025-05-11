var audio = new Audio("music.mp3")
audio.loop = true
document.getElementById("toggleMusicButton").onclick = function() {
	audio.paused ? audio.play() : audio.pause()
}
var spinAudio = new Audio("spin.mp3")
var jackpotAudio = new Audio("jackpot.ogg")
var winAudio = new Audio("win.ogg")
var loseAudio = new Audio("lose.mp3")
var balance = 2000
var symbols = [
	{ name: "umbrella", file: "1.png", frequency: 7 },
	{ name: "brellfoot", file: "2.png", frequency: 7 },
	{ name: "brellnado", file: "3.png", frequency: 7 },
	{ name: "ombrella", file: "4.png", frequency: 7 },
	{ name: "omega", file: "5.png", frequency: 7 },
	{ name: "omnado", file: "6.png", frequency: 6 },
	{ name: "tacobrell", file: "7.png", frequency: 6 },
	{ name: "limited-history", file: "8.png", frequency: 6 },
	{ name: "madbrella", file: "9.png", frequency: 6 },
	{ name: "analog-umbrella", file: "10.png", frequency: 6 },
	{ name: "antibrella", file: "11.png", frequency: 5 },
	{ name: "inverted-umbrella", file: "12.png", frequency: 5 },
	{ name: "inverted-antibrella", file: "13.png", frequency: 5 },
	{ name: "mason-umbrella", file: "14.png", frequency: 5 },
	{ name: "oldbrella", file: "15.png", frequency: 5 },
	{ name: "quadbrella", file: "16.png", frequency: 4 },
	{ name: "mowbrell", file: "17.png", frequency: 4 },
	{ name: "umbrella-twins", file: "18.png", frequency: 4 },
	{ name: "brellcraft", file: "19.png", frequency: 3 },
	{ name: "umbrella-signal", file: "20.png", frequency: 1 }
]
var payouts = {
	"umbrella": [0.5, 1],
	"brellfoot": [1, 1.5],
	"brellnado": [1.5, 2],
	"ombrella": [2, 2.5],
	"omega": [2.5, 3],
	"omnado": [3.5, 4],
	"tacobrell": [4, 4.5],
	"limited-history": [4.5, 5],
	"madbrella": [5, 5.5],
	"analog-umbrella": [5.5, 6],
	"antibrella": [7, 7.5],
	"inverted-umbrella": [7.5, 8],
	"inverted-antibrella": [8, 8.5],
	"mason-umbrella": [8.5, 9],
	"oldbrella": [9, 9.5],
	"quadbrella": [12, 14],
	"mowbrell": [15, 17],
	"umbrella-twins": [18, 20],
	"brellcraft": [50, 100],
	"umbrella-signal": [200, 1000]
}
var isSpinning = false
function getSelectedBet() {
	var options = document.getElementsByName("bet")
	for (var i = 0; i < options.length; i++) {
		if (options[i].checked) return parseInt(options[i].value)
	}
	return null
}
function updateDisplay(msg, results) {
	document.getElementById("coins").innerHTML = "Balance: $" + balance
	if (results) {
		for (var i = 0; i < 3; i++) {
			var img = document.getElementById("slot" + (i + 1))
			img.src = results[i].file
		}
	}
	document.getElementById("message").innerHTML = msg
}
function getRandomSymbol() {
	var weightedSymbols = []
	for (var i = 0; i < symbols.length; i++) {
		for (var j = 0; j < symbols[i].frequency; j++) {
			weightedSymbols.push(symbols[i])
		}
	}
	var randomIndex = Math.floor(Math.random() * weightedSymbols.length)
	return weightedSymbols[randomIndex]
}
function spin() {
	if (isSpinning) return
	isSpinning = true
	var bet = getSelectedBet()
	if (bet === null) {
		updateDisplay("Please select a bet!", null)
		setTimeout(function() {
			updateDisplay("Welcome to Brell Gambling!", null)
		}, 1000)
		isSpinning = false
		return
	}
	if (balance < bet) {
		updateDisplay("Not enough money!", null)
		setTimeout(function() {
			updateDisplay("Welcome to Brell Gambling!", null)
		}, 1000)
		isSpinning = false
		return
	}
	balance -= bet
	updateDisplay("Spinning...", null)
	spinAudio.play()
	var results = []
	var spinInterval = setInterval(function() {
		for (var i = 0; i < 3; i++) {
			results[i] = getRandomSymbol()
			var img = document.getElementById("slot" + (i + 1))
			img.src = results[i].file
		}
	}, 100)
	setTimeout(function() {
		clearInterval(spinInterval)
		var names = []
		for (var i = 0; i < results.length; i++) names.push(results[i].name)
		var counts = {}
		for (var i = 0; i < names.length; i++) counts[names[i]] = (counts[names[i]] || 0) + 1
		var payout = 0
		var matched = false
		for (var key in counts) {
			if (counts[key] === 3) {
				payout = bet * payouts[key][1]
				matched = true
			} else if (counts[key] === 2) {
				payout = bet * payouts[key][0]
				matched = true
			}
		}
		if (matched) balance += bet + payout
		if (counts["brell-signal"] === 3) jackpotAudio.play()
		var net = matched ? payout : -bet
		var message = ""
		if (net > 0) {
			winAudio.play()
			message = "You won $" + net + "!"
		} else {
			loseAudio.play()
			message = "You lost $" + (-net) + "!"
		}
		updateDisplay(message, results)
		setTimeout(function() {
			updateDisplay("Welcome to Brell Gambling!", null)
			isSpinning = false
		}, 1000)
	}, 6500)
}
updateDisplay("Welcome to Brell Gambling!", null)