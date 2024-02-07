'use strict'

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


/*
    const cell = {
        minesAroundCount: 2,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    */


