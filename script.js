/**
 * script.js
 * 
 * This game is designed to use the same apparent interface as
 * the NodeJS Nail-It game. However, instead of using
 * readline-sync for values, the whole window listens for keydown
 * events all the time. If you hold a key down, the game will
 * exit: it will play to the end and then receive a key event
 * where the key is not 'y'.
 * 
 * One other difference is that "Thanks for a good game!" is never
 * shown when the player chooses to stop playing.
 */


const mask = document.getElementById("mask")
const start = document.getElementById("start")
const rules = document.getElementById("rules")
const restart = document.getElementById("restart")
const terminal = document.getElementById("terminal")

window.addEventListener("keydown", treatKey)
start.addEventListener("click", () => (
  mask.classList.add("hidden")
))
restart.addEventListener("click", restartGame)

// Define strings
const nailIs    = "The nail is "
const long      = " units long."
const replay    = "Do you want to play again? (Type Y for Yes)"
const yourTurn  = "Your turn. How hard do you plan to hit?"
const strength  = [ "gently", "firmly", "hard" ]
const hit       = " hit the nail "

// Define the values that the AI will use to calculate its move
const best     = 3
const oneOver  = best + 1

let playing    = true
let state      = "youStart"
let force      = 0
let prompt     // "The nail is X units long." | "Y hit the nail Z."
let nail       // "-==========<|" ... "=====<|" ... "<|"
let started    // falsy until first hit

let player, nextPlayer, initial, length


function treatKey({ key }) {
  if (mask.classList.contains("hidden")) {
    switch(state) {
      case "youStart":
        return startGame(key.toLowerCase() === "y")

      case "getForce":
        return setForce(key)

      case "replay":
        return replayIfRequested(key)
    }
  }
}

function startGame(whoStarts) {
  rules.classList.add("hidden")

  player = whoStarts
  nextPlayer = !player
  // Set the initial length of the nail
  initial = 12 + Math.floor(Math.random() * oneOver)
  length = initial

  prompt = ` ${nailIs} ${length} ${long}`
  started = false

  showNail()
  hammer()
}

function showNail() {
  if (!started) {
    // Draw the whole nail, including the tip
    nail = "-" + "=".repeat(length - 2) + "<|"

  } else if (length > 0) {
    // There will be at least one unit showing, because the game
    // is not yet over
    nail = "=".repeat(length - 1) + "<|"

  } else {
    // Game over. Show just the head
    nail = "|"
  }

  const p = document.createElement("p")
  p.innerText = nail + prompt
  terminal.append(p)
}

function hammer(param) {
  if (player) {
    askForForce()
    state = "getForce"

  } else {
    if (length < oneOver) {
      // The AI can win immediately
      force = length

    } else {
      // Calculate if it's possible to leave a multiple of
      // `oneOver` blocks, so that the player cannot win
      force = length % oneOver
      if (!force) {
        // The player is in a winning position. Play randomly
        force = Math.floor(Math.random() * best) + 1
      }
    }

    strike()
  }
}

function askForForce() {
  // Pretend to use readline-sync API
  const readlineSim = document.createElement("div")
  readlineSim.id = "readlineSim"

  const lines = [
    "[1] gently",
    "[2] firmly",
    "[3] hard",
    "[0] CANCEL",
    "Your turn. How hard do you plan to hit? [1, 2, 3, 0]: ",
  ]

  lines.forEach( line => {
    const p = document.createElement("p")
    p.innerText = line
    readlineSim.append(p)
  })

  const cursorSpan = document.createElement("span")
  cursorSpan.className = "cursor"
  readlineSim.lastChild.append(cursorSpan)

  terminal.append(readlineSim)
}

function setForce(number) {
  if (isNaN(number)) {
    return
  }

  number = parseInt(number, 10)

  if (number < 4) {
    if (!number) {
      return restartGame()
    }

    force = number
    document.getElementById("readlineSim").remove()
    strike()
  }
}

function strike() {
  started = true
  const pronoun = player ? "You" : "I"

  prompt = " ".repeat(initial - length + force - 1)
         + pronoun + hit + strength[force - 1] + "."
  length -= force

  if (length > 0) {
    player = !player
    showNail() // with updated status
    hammer()

  } else {
    gameOver(pronoun, prompt)
  }
}

function gameOver(pronoun) {
  showNail() // fully driven in, with player's action as prompt

  // Pretend to use readline-sync to ask if player wants to
  // play again
  const readlineSim = document.createElement("div")
  readlineSim.id = "readlineSim"

  const lines = [
    `${pronoun} win!`,
    replay
  ]

  lines.forEach( line => {
    const p = document.createElement("p")
    p.innerText = line
    readlineSim.append(p)
  })

  const cursorSpan = document.createElement("span")
  cursorSpan.className = "cursor"
  readlineSim.lastChild.append(cursorSpan)

  terminal.append(readlineSim)

  state = "replay"
}

function replayIfRequested(key) {
  if (key.toLowerCase() === "y") {
    while (terminal.lastChild) {
      terminal.lastChild.remove()
    }
    startGame(nextPlayer)

  } else {
    restartGame()
  }
}

function restartGame() {
  // Note: "Thanks for a good game!" is not shown because the
  // game resets immediately.

  while (terminal.lastChild) {
    terminal.lastChild.remove()
  }
  terminal.append(rules)
  rules.classList.remove("hidden")
  mask.classList.remove("hidden")

  playing    = true
  state      = "youStart"
  force      = 0

  player = nextPlayer = initial = length = undefined
}

