'use strict'

const HIDDEN = ' '
const MINE = '🧨'
const MARKED = '🏁'
const SAFE = ' '

const gFullLives = ' 🌟🌟🌟'
const gTwoLives = ' 🌟🌟'
const gLastLive = ' 🌟'

var gBoard
var gFirstClick = true
var gLives = 3
var gTimerIntervalId

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// ----------------------------- onInit ----------------------------- //
function onInit() {
    gGame.isOn = true
    strGameInfoHTML()
    gBoard = createBoard()
    renderBoard(gBoard)
}

// -------------------------- createBoard -------------------------- //
function createBoard() {
    var board = []
    const boardSize = gLevel.SIZE

    for (let i = 0; i < boardSize; i++) {
        board[i] = []
        for (let j = 0; j < boardSize; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    return board
}

// -------------------------- setMinesNegCount -------------------------- //
function setMinesNegCount(board) {

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            currCell.minesAroundCount = countNegMines(i, j, board)
        }
    }
}

// ---------------------------- renderBoard ---------------------------- //
function renderBoard(board) {
    if (!gGame.isOn) return

    renderTimer()
    const elFlags = document.querySelector('.flags span')
    elFlags.innerText = gGame.markedCount

    var strBoardHTML = ''
    for (let i = 0; i < board.length; i++) {
        strBoardHTML += '<tr>'
        for (let j = 0; j < board[0].length; j++) {

            var cell = board[i][j]
            var className

            if (!cell.isShown && cell.isMarked) {
                cell = MARKED
                className = `cell hidden`

            } else if (!cell.isShown) {
                cell = HIDDEN
                className = `cell hidden`

            } else {
                if (cell.isMine) {
                    cell = MINE
                    className = `cell mine`

                } else if (cell.minesAroundCount !== 0) {
                    cell = cell.minesAroundCount
                    className = `cell mines-around`

                } else if (cell.minesAroundCount === 0) {
                    cell = SAFE
                    className = `cell safe`
                }
            }
            strBoardHTML += `<td class="${className}" data-i="${i}" data-j="${j}" onclick="onCellClicked(this, +${i}, +${j})" oncontextmenu="onCellMarked(event, this, +${i}, +${j})">${cell}</td>`
        }
        strBoardHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strBoardHTML
}

// -------------------------- onCellClicked -------------------------- //
function onCellClicked(elCell, i, j) {

    if (!gTimerIntervalId) {
        console.log('onCellClick - gTimerIntervalId', gTimerIntervalId)
        startTimer()
    }

    // console.log('gFirstClick ', gFirstClick)

    if (gFirstClick) {
        setRandomMines(elCell, gBoard)
        setMinesNegCount(gBoard)
        gFirstClick = !gFirstClick
        renderBoard(gBoard) //
    }

    const cell = gBoard[i][j]
    if (cell.isMarked) return

    checkMine(elCell, i, j)
    checkMinesAroundCount(elCell, i, j)
    checkSafeCell(elCell, i, j)

    checkGameIsWin()
}

// ---------------------------- checkMine ---------------------------- //
function checkMine(elCell, i, j) {

    const cell = gBoard[i][j]
    if (cell.isMine) {
        gLives--
        strGameInfoHTML()
        playKaboomSound()

        if (gLives === 0) {
            cell.isShown = true
            elCell.classList.remove('hidden')
            elCell.classList.add('mine')
            showGameIsLost(elCell)
        }
    }
}

// ---------------------- checkMinesAroundCount ---------------------- //
function checkMinesAroundCount(elCell, i, j) {

    const cell = gBoard[i][j]

    if (!cell.isMine && cell.minesAroundCount !== 0) {
        cell.isShown = true
        elCell.classList.remove('hidden')
        elCell.classList.add('mines-around')
        renderBoard(gBoard)
    }
}

// -------------------------- checkSafeCell -------------------------- //
function checkSafeCell(elCell, i, j) {

    const cell = gBoard[i][j]

    if (!cell.isMine && cell.minesAroundCount === 0) {
        cell.isShown = true
        elCell.classList.remove('hidden')
        elCell.classList.add('safe')
        expandShown(gBoard, elCell, i, j)
        renderBoard(gBoard)
    }
}

// --------------------------- expandShown -------------------------- //
function expandShown(board, elCell, cellI, cellJ) {

    if (gBoard[cellI][cellJ] === MARKED) return

    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            var currCell = board[i][j]

            if (currCell.isMarked) continue

            currCell.isShown = true

            if (currCell.minesAroundCount !== 0) {
                elCell.classList.remove('hidden')
                elCell.classList.add('mines-around')

            } else {
                elCell.classList.remove('hidden')
                elCell.classList.add('safe')
            }
        }
    }
}

// -------------------------- onCellMarked -------------------------- //
function onCellMarked(click, elCell, i, j) {

    document.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    }, false)

    var cell = gBoard[i][j]

    if (elCell.classList.contains('safe')) return
    if (elCell.classList.contains('mines-around')) return
    if (elCell.classList.contains('mine')) return

    cell.isMarked = !cell.isMarked

    if (cell.isMarked) {
        elCell.innerHTML = MARKED
        gGame.markedCount++
    }

    if (!cell.isMarked) {
        if (elCell.classList.contains('hidden')) elCell.innerHTML = HIDDEN
        if (elCell.classList.contains('safe')) elCell.innerHTML = SAFE
        if (elCell.classList.contains('mine')) elCell.innerHTML = MINE
        if (elCell.classList.contains('mines-around')) elCell.innerHTML = cell.minesAroundCount
        gGame.markedCount--
    }
    strGameInfoHTML()
    const elFlags = document.querySelector('.flags span')
    elFlags.innerText = gGame.markedCount

    if (gGame.markedCount === gLevel.MINES) checkGameIsWin()
}

// ------------------------- showGameLost ------------------------- //
function showGameIsLost(elCell) {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine) {
                cell.isShown = true
                elCell.classList.remove('hidden')
                elCell.classList.add('mine')
            }
        }
    }
    renderBoard(gBoard)
    gGame.isOn = !gGame.isOn

    clearInterval(gTimerIntervalId)
    renderTimer()
    // getLoseFace()
    strGameInfoHTML()

    setTimeout(playGameOverSound, 3000)
}

// ----------------------- checkGameIsWin ----------------------- //
function checkGameIsWin() {
    if (gGame.markedCount === gLevel.MINES) {
        for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[0].length; j++) {
                const cell = gBoard[i][j]
                if (cell.isMine && !cell.isMarked) return
                if (!cell.isShown && !cell.isMarked) return
            }
        }
        clearInterval(gTimerIntervalId)
        renderTimer()
        playWinnerSound()
    }
}

// ----------------------- setRandomMines ----------------------- //
function setRandomMines(elCell, board) {
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j

    for (let i = 0; i < gLevel.MINES; i++) {
        var randIdxI = getRandomInt(0, board.length - 1)
        var randIdxJ = getRandomInt(0, board.length - 1)

        if (elCellI !== randIdxI || elCellJ !== randIdxJ) {
            if (!board[randIdxI][randIdxJ].isMine) {
                board[randIdxI][randIdxJ].isMine = true
            } else {
                i--
                continue
            }
        }
    }
}

// ---------------------- changeBoardSize ---------------------- //
function changeBoardSize(boardSize) {
    gLevel.SIZE = boardSize

    if (gLevel.SIZE === 4) {
        gLevel.MINES = 2
    } else if (gLevel.SIZE === 8) {
        gLevel.MINES = 14
    } else if (gLevel.SIZE === 12) {
        gLevel.MINES = 32
    }
    gFirstClick = true

    strGameInfoHTML()

    restartGame()
}

// ---------------------- strGameInfoHTML ---------------------- //
function strGameInfoHTML() {

    const strMinesCountHTML = gLevel.MINES
    const elMinesCount = document.querySelector('.mines-count span')
    elMinesCount.innerText = strMinesCountHTML

    const zeroLives = ' '
    const elLives = document.querySelector('.lives span')

    if (gGame.isOn && gLives === 3) {
        elLives.innerHTML = gFullLives
    }

    if (gLives === 2) {
        elLives.innerHTML = gTwoLives
    } else if (gLives === 1) {
        elLives.innerHTML = gLastLive
    } else if (!gGame.isOn) {
        elLives.innerHTML = zeroLives
    }

}

function restartGame() {
    gLives = 3
    gGame.shownCount = 0
    gGame.markedCount = 0
    gFirstClick = true
    resetTimer()
    onInit()

}




