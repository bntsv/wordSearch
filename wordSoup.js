"use strict";

// console.log(document); //document  not defined under node.js? 

let soupRows = document.querySelector(".soupRows").value;
let soupCols = document.querySelector(".soupCols").value;
let soupTitle = document.querySelector(".soupTitle").value;


// let soupTitle = "melon";
let titleAsArray = Array.from(soupTitle.toUpperCase());
let numCol = 30;
let numRow = 20;
let emptySpace = "";

// let numCol = (soupCols - titleAsArray.length);
// let numRow = (soupRows - 1);


function makeBlankSoup() {

    let soup = [];


    soup.push(titleAsArray);

    for (let i = 0; i < (numCol / 2); i++) {
        function addColumns() {
            titleAsArray.unshift(emptySpace);
            titleAsArray.push(emptySpace);
        }
        addColumns()
    }

    for (let j = 0; j < (numRow / 2); j++) {

        function addRows() {
            let row = [];
            for (let i = 0; i < titleAsArray.length; i++) {
                row.push(emptySpace);
            }

            soup.unshift(row);
            soup.push(row);
        }
        addRows()
    }

    return soup
}

let blankSoup = makeBlankSoup();
console.log(blankSoup);
let puzzleParentDiv = document.querySelector(".puzzle");
puzzleParentDiv.style.gridTemplateColumns = `repeat(${numCol + soupTitle.length}, 1fr)`;
puzzleParentDiv.style.gridTemplateRows = `repeat(${numRow + 1}, 1fr)`;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

console.log(soupTitle);

function fillPuzzleDiv(arr) {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        for (let j = 0; j < arr[i].length; j++) {
            const element = arr[i][j];

            let newLetterDiv = document.createElement("div");
            let newContent = document.createTextNode(element);
            newLetterDiv.appendChild(newContent);

            newLetterDiv.classList.add("item");
            puzzleParentDiv.appendChild(newLetterDiv);
        }
    }
}

fillPuzzleDiv(blankSoup);
