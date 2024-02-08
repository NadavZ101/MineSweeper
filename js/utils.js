'use strict'

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


