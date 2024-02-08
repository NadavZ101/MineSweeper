'use strict'

const HIDDEN = ' '
const MINE = '🧨'
const MARKED = '🏁'
const SAFE = '🟩'

var gBoard
var gFirstClick = true
var gLives = 3

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


    board[2][0].isMine = true
    board[1][3].isMine = true
    setMinesNegCount(board)

    console.table(board) // remove in final version
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

    // if (gFirstClick) {
    //     setRandomMines(gBoard)
    //     setMinesNegCount(gBoard)
    //     gFirstClick = !gFirstClick
    // }

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

        alert('you are on a mine')
        console.log('gLives = ', gLives--)

        cell.isShown = true
        elCell.classList.remove('hidden')
        elCell.classList.add('mine')

        if (gLives === 0) {
            showGameIsLost(elCell)
        }
    }
}

// ---------------------- checkMinesAroundCount ---------------------- //
function checkMinesAroundCount(elCell, i, j) {

    const cell = gBoard[i][j]

    if (cell.minesAroundCount !== 0) {
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
        gGame.markedCount++ //need to show the num of flags? - only if have time
    }

    if (!cell.isMarked) {
        if (elCell.classList.contains('hidden')) elCell.innerHTML = HIDDEN
        if (elCell.classList.contains('safe')) elCell.innerHTML = SAFE
        if (elCell.classList.contains('mine')) elCell.innerHTML = MINE
        if (elCell.classList.contains('mines-around')) elCell.innerHTML = cell.minesAroundCount
        gGame.markedCount--
    }

    if (gGame.markedCount === gLevel.MINES) checkGameIsWin()
}

// ------------------------- showGameLost ------------------------- //
function showGameIsLost(elCell) {
    if (gLives === 0) {
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

        alert('GAME OVER - LOST') // Do it With the 'SAD SMILY'
    }
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
        console.log('WINNER!!!') // change it to smily
    }
}

// ----------------------- setRandomMines ----------------------- //
function setRandomMines(board) {
    for (let i = 0; i < gLevel.MINES; i++) {
        var randIdxI
        var randIdxJ

        while (true) {
            randIdxI = getRandomInt(0, board.length - 1)
            randIdxJ = getRandomInt(0, board.length - 1)

            if (!board[randIdxI][randIdxJ].isMine) break
        }
        board[randIdxI][randIdxJ].isMine = true
    }
}

// ---------------------- changeBoardSize ---------------------- //
function changeBoardSize(boardSize) {
    const elBtn4 = document.querySelector('.btn4')
    const elBtn8 = document.querySelector('.btn8')
    const elBtn12 = document.querySelector('.btn12')

    console.log('elBtn4: ', elBtn4)

    gLevel.SIZE = boardSize

    if (gLevel.SIZE === 4) {
        gLevel.MINES = 2
    } else if (gLevel.SIZE === 8) {
        gLevel.MINES = 14
    } else if (gLevel.SIZE === 12) {
        gLevel.MINES = 32
    }

    const strMinesCountHTML = gLevel.MINES
    console.log('gLevel.MINES ', gLevel.MINES)
    const elMinesCount = document.querySelector('.mines-count span')
    elMinesCount.innerText = strMinesCountHTML

    onInit()
}

// ---------------------- strLivesHTML ---------------------- //
function strLivesHTML() {
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = '&#10084'
}


