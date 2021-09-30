"use strict";

let arr = [
    ["x","x"," ","x","x","x"],
    ["x","x"," ","x","x","x"],
    ["x","x"," ","x","x","x"],
    ["x","x"," ","x","x","x"],
    ["x","x"," ","x","x","x"],
    ["x","x","x","x","x","x"],
    ["x","x","x","x","x","x"],
    ["x","x","x","x","x","x"],
    ["x","x","x","x","x","x"],
];

let word = "apple";
let rowsIndexesArr = [];
let colsIndexesArr = [];


for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    rowsIndexesArr.push(i);
    
    
}
for (let j = 0; j < arr[0].length; j++) {
    const element = arr[0][j];
    colsIndexesArr.push(j);
}

// console.log(rowsIndexesArr);
// console.log(colsIndexesArr);

function findAvailablePosition (wordArr, rowsArr, colsArr){
    console.log(wordArr.length);
    let rowsIndex = Math.floor(Math.random() * rowsArr.length);
    let colsIndex = Math.floor(Math.random() * colsArr.length);

    let rowsIndexInitial = rowsIndex.toString();
    let colsIndexInitial = colsIndex.toString();

    let verticalORhorizontal = Math.random() <= 0.5 ? true : false;

    // console.log(rowsIndex);
    // console.log(colsIndex);

    for (let l = 0; l < wordArr.length; l++) {
        const element = wordArr[l];

        if(arr[rowsIndex][colsIndex] === " " || arr[rowsIndex][colsIndex] === element){
            console.log(arr[rowsIndex][colsIndex].localeCompare(element));
            // console.log(arr[rowsIndex][colsIndex] === " " || arr[rowsIndex][colsIndex] === element);
            // console.log(arr[rowsIndex][colsIndex]);
            // console.log(element);
            // console.log("a" === "x");

            arr[rowsIndex][colsIndex] = element;
            verticalORhorizontal ? rowsIndex++ : colsIndex++;
            // return arr;

        } else if(arr[rowsIndex][colsIndex] !== " " || arr[rowsIndex][colsIndex] !== element){

            // go back to initial position:
            let previousSelectedDirection = verticalORhorizontal ? rowsIndex : colsIndex;
            previousSelectedDirection = previousSelectedDirection - l;

            verticalORhorizontal = !verticalORhorizontal;

            arr[rowsIndex][colsIndex] = element;
            verticalORhorizontal ? rowsIndex++ : colsIndex++;
            // return arr;
            
        } else{
            rowsArr = rowsArr.splice(rowsIndexInitial*1, 1);
            colsArr = colsArr.splice(colsIndexInitial*1, 1);

            // findAvailablePosition (wordArr, rowsArr, colsArr);
        }
        
    }
}

console.log(findAvailablePosition (word, rowsIndexesArr, colsIndexesArr));
