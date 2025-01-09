/**
 * script.js
 */


const terminal = document.getElementById("terminal")
window.addEventListener("keydown", treatKey)
let state = "youStart"

const nailIs    = "The nail is "
const long      = " units long."
const replay    = "\nDo you want to play again? (Type Y for Yes)"
const yourTurn  = "Your turn. How hard do you plan to hit?"
const strength  = [ "gently", "firmly", "hard" ]
const hit       = " hit the nail "
const endGame   = "Thanks for a good game!"
const best     = 3
const oneOver  = best + 1

let playing    = true
let force      = 0
let toDelete   = 10
let prompt     // "The nail is X units long." | "Y hit the nail Z."
let nail       // "-==========<|" ... "=====<|" ... "<|"
let started    // false until first hit

let player, nextPlayer, initial, length


function treatKey({ key }) {
  switch(state) {
    case "youStart":
      return startGame(key.toLowerCase() === "y")

  }
}

function startGame(whoStarts) {
  player = whoStarts
  nextPlayer = !player
  initial = 12 + Math.floor(Math.random() * oneOver)
  length = initial

  while (terminal.lastChild) {
    terminal.lastChild.remove()
  }

  prompt = ` ${nailIs} ${length} ${long}`
   
  showNail(false)
}

function showNail() {
  if (!started) {
    // Draw the whole nail, including the tip
    nail = "-" + "=".repeat(length - 2) + "<|"
  } else {
    // There will be at least one unit show, because the game
    // is not yet over
    nail = "=".repeat(length - 1) + "<|"
  }

  const p = document.createElement("p")
  p.innerText = nail + prompt
  terminal.append(p)
}