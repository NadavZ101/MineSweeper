'use strict'

var gStartTime
var gMins = 0
var gSecs = 0
var gMiliSecs = 0
gMiliSecs = gMiliSecs.toString().padStart(3, '0')

// -------------------------------- countNegMines -------------------------------- //
function countNegMines(cellI, cellJ, board) {
    var neighborsCount = 0
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            var currCell = board[i][j]
            if (currCell.isMine) neighborsCount++
        }
    }
    return neighborsCount
}

// ------------------------------ countNegSafeCells ------------------------------ //
function countNegSafeCells(cellI, cellJ, board) {
    var neighborsCount = 0
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            var currCell = board[i][j]
            if (!currCell.isMine) neighborsCount++
        }
    }
    return neighborsCount
}

// -------------------------------- getRandomInt -------------------------------- //
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// -------------------------------- startTimer --------------------------------- //
function startTimer() {

    gStartTime = new Date().getTime()
    gTimerIntervalId = setInterval(updateTimer, 10)
}

// -------------------------------- updateTimer --------------------------------- //
function updateTimer() {
    const currTime = Date.now()
    var elapsedTime = currTime - gStartTime

    gMins = Math.floor(elapsedTime / (1000 * 60))
    gSecs = Math.floor((elapsedTime % (1000 * 60)) / 1000)
    gMiliSecs = Math.floor(elapsedTime % 1000)
    gMiliSecs = gMiliSecs.toString().padStart(3, '0')

    renderTimer()
}

// -------------------------------- renderTimer --------------------------------- //
function resetTimer() {
    clearInterval(gTimerIntervalId)
    gTimerIntervalId = null
    gStartTime = 0
    gMins = 0
    gSecs = 0
    gMiliSecs = 0
    gMiliSecs = gMiliSecs.toString().padStart(3, '0')
}

// -------------------------------- renderTimer --------------------------------- //
function renderTimer() {
    var strHTMLStopTimer = ''

    strHTMLStopTimer +=
        `<div class="timer">${gMins}${gSecs}:${gMiliSecs}</div>`

    const elStopWatch = document.querySelector('.timer')
    elStopWatch.innerHTML = strHTMLStopTimer
}

// ------------------------------ playWinnerSound ------------------------------- //
function playWinnerSound() {
    const winnerSound = new Audio('mp3/winner.mp3')
    winnerSound.play()
}

// ------------------------------ playKaboomSound ------------------------------- //
function playKaboomSound() {
    const kaboomSound = new Audio('mp3/kaboom.mp3')
    kaboomSound.play()
}

function playGameOverSound() {
    const gameOverSound = new Audio('mp3/gameOver.mp3')
    gameOverSound.play()
}
