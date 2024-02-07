'use strict'

const HIDDEN = ' '
const MINE = '🧨'
const MARKED = '🏁'
const SAFE = '  '

var gBoard

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
    gBoard = createBoard()
    renderBoard(gBoard)
    gGame.isOn = true
}

// -------------------------- createBoard -------------------------- //
function createBoard() {
    var board = []
    const boardSize = gLevel.SIZE

    for (let i = 0; i < boardSize; i++) {
        board[i] = []
        for (let j = 0; j < boardSize; j++) {
            const cell = {
                minesAroundCount: 2,
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
    // console.log('setMinesNegCount - board', board)

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            currCell.minesAroundCount = countNegMines(i, j, board)
        }
    }
}

// ---------------------------- renderBoard ---------------------------- //
function renderBoard(board) {

    const strMinesCountHTML = gLevel.MINES
    const elMinesCount = document.querySelector('.mines-count span')
    elMinesCount.innerText = strMinesCountHTML


    var strBoardHTML = ''
    for (let i = 0; i < board.length; i++) {
        strBoardHTML += '<tr>'
        for (let j = 0; j < board[0].length; j++) {

            var cell = board[i][j]
            var className

            if (!cell.isShow) {
                cell = HIDDEN
                className = `cell hidden`
            } else {
                if (cell.isMine) {
                    cell = MINE
                    className = `cell mine`

                } else if (cell.isMarked) {   // the reveal with right click - handle it
                    cell = MARKED
                    className = `cell mark`

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




    // const elLeftClick = document.getElementById("contextmenu")
    // elLeftClick.addEventListener('contextmenu', function (e) {

    //     onCellMarked(elLeftClick)

    //     e.preventDefault();

    // }, false);

}

// function leftClickMark() {
//     const elLeftClick = document.getElementById("contextmenu")
//     elLeftClick.addEventListener('contextmenu', function (e) {

//         console.log("HELOOOOO")
//         onCellMarked(elCell)

//         e.preventDefault();
//     }, false);
// }


// --------------------------- onCellClicked --------------------------- //
function onCellClicked(elCell, i, j) {

    // if (gBoard[i][j].isMarked) return // no undo?

    checkMine(elCell, i, j) // add a game over - when return true 
    checkMinesAroundCount(elCell, i, j)
    checkSafeCell(elCell, i, j)

    // document.addEventListener('contextmenu', function (e) {
    //     onCellMarked(elCell)
    //     e.preventDefault();
    // }, false);

    renderBoard(gBoard)

}

// ---------------------------- checkMine ---------------------------- //
function checkMine(elCell, i, j) {

    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShow = true
        elCell.classList.remove('hidden')
        elCell.classList.add('mine')
        console.log('checkMine - elCell = ', elCell)

        // END THE GAME 
    }
}

// ---------------------- checkMinesAroundCount ---------------------- //
function checkMinesAroundCount(elCell, i, j) {
    if (gBoard[i][j].minesAroundCount !== 0) {
        gBoard[i][j].isShow = true
        elCell.classList.remove('hidden')
        elCell.classList.add('mines-around')
    }
}

// -------------------------- checkSafeCell -------------------------- //
function checkSafeCell(elCell, i, j) {
    if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount === 0) {
        gBoard[i][j].isShow = true
        elCell.classList.remove('hidden')
        elCell.classList.add('safe')
        expandShown(gBoard, elCell, i, j)
    }
}

// --------------------------- expandShown -------------------------- //
function expandShown(board, elCell, cellI, cellJ) {
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            var currCell = board[i][j]
            currCell.isShow = true

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

/*
    const cell = {
        minesAroundCount: 2,
        isShown: false,
        isMine: false,
        isMarked: false
    }
*/

// ------------------------ onCellMarked ------------------------ //

function onCellMarked(event, elCell, i, j) {

    document.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    }, false)

    console.log(gBoard[+i][+j])


    console.log('Checking 1-2 1-2')
    console.log('elCell = ', elCell)


    console.log(elCell.classList.contains('hidden'))

    // for undo flag
    if (elCell.classList.contains('hidden')) {
        gBoard[+i][+j] = MARKED
    }

    if (elCell.classList.contains('hidden')) {
        elCell.classList.remove('hidden')
        elCell.classList.add('marked')

        // } else if (elCell.classList.contains('mine')) {
        //     elCell.classList.add('marked-suspect')




    }
}
// ----------------------- checkGameOver ----------------------- //
function checkGameOver() {

}


