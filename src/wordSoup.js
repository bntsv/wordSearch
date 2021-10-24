"use strict";

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
    //https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
}

function randomSelection(data) {

    if (isIterable(data)) {

        if (Array.isArray(data) || (typeof data === "string")) {

            if ((typeof data === "string") || (data.filter(element => element.isArray).length !== data.length)) {
                const randomIndex = Math.floor(Math.random() * data.length);
                const randomEl = data[randomIndex];

                return randomEl

            } else {
                const randomRow = Math.floor(Math.random() * data.length);
                const randomCol = Math.floor(Math.random() * data[randomRow].length);
                const randomEl2D = data[randomRow][randomCol];

                return randomEl2D

            }

        } else if (typeof data === "object") {
            const keys = Object.keys(data);
            const randomProp = keys[Math.floor(Math.random() * keys.length)];

            return randomProp
            //https://thewebdev.info/2021/06/03/how-to-pick-a-random-property-from-a-javascript-object/
        }

    } else {

        return console.log(`${data} not iterable`);
    }
}

function makeBlankSoup(soupTitle, soupCols, soupRows) {

    let soup = [];
    let titleAsArray = Array.from(soupTitle.toUpperCase());
    let emptySpace = " ";

    soup.push(titleAsArray);

    for (let i = 0; i < (soupCols / 2); i++) {
        function addColumns() {
            titleAsArray.unshift(emptySpace);
            titleAsArray.push(emptySpace);
        }
        addColumns()
    }

    for (let j = 0; j < (soupRows / 2); j++) {
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

function makeSoup(arr, wordsArr) {

    // let arrCopy = (function clonePuzzle(puzzle) {
    //     let clone = []
    //     for (let i = 0; i < puzzle.length; i++) {
    //         clone[i] = puzzle[i].slice();
    //         // https://stackoverflow.com/questions/13756482/create-copy-of-multi-dimensional-array-not-reference-javascript
    //     }

    //     return clone
    // })(arr)

    // BEFORE THE LOOP, WORDS NEED TO BE SORTED BY LENGHT TO START FILLING THE PUZZLE WITH THE LONGEST ONES FIRST! -TO BE DONE

    wordsArr.forEach(word => {

        console.log(`________________________________________`);
        console.log(`WORD:`);
        console.log(word);

        // directions are defined here, so that each word starts the checks with default directions, not the already checked directions for previous words:
        let directions = [
            {
                "name": "leftToRight",
                "check": (position) => (position.x <= (arr[0].length - word.length)) ? 1 : 0,
                "step": (position) => ++position.x,
                "status": 0
            },
            {
                "name": "topToBottom",
                "check": (position) => (position.y <= (arr.length - word.length)) ? 1 : 0,
                "step": (position) => ++position.y,
                "status": 0
            },
            // {
            //     "name": "leftToBottom",
            //     "check": (position) => (position.y <= (arr.length - word.length)) ? 1 : 0,
            //     "step": (position) => (++position.x && --position.y),
            //     "status": 0
            // },
            // {
            //     "name": "rightToBottom",
            //     "check": (position) => (position.y <= (arr.length - word.length)) ? 1 : 0,
            //     "step": (position) => (--position.x && --position.y),
            //     "status": 0
            // },
            {
                "name": "rightToLeft",
                "check": (position) => (position.x >= (word.length - 1)) ? 1 : 0,
                "step": (position) => --position.x,
                "status": 0
            },
            {
                "name": "bottomToTop",
                "check": (position) => (position.y >= (word.length - 1)) ? 1 : 0,
                "step": (position) => --position.y,
                "status": 0
            },
            // {
            //     "name": "leftToTop",
            //     "check": (position) => (position.y >= (word.length - 1)) ? 1 : 0,
            //     "step": (position) => (++position.x && ++position.y),
            //     "status": 0
            // },
            // {
            //     "name": "rightToTop",
            //     "check": (position) => (position.y >= (word.length - 1)) ? 1 : 0,
            //     "step": (position) => (--position.x && ++position.y),
            //     "status": 0
            // }
        ];
        console.log(`ALL directions:`);
        console.log(directions);

        // get all positions as x(cols) and y(rows) pairs:
        let allPositions = (function getAllPositions(array2d) {

            let positionsArr = [];

            for (let i = 0; i < array2d.length; i++) {
                for (let j = 0; j < array2d[i].length; j++) {

                    let position = { "x": j, "y": i };
                    positionsArr.push(position);
                }
            }

            return positionsArr;
        })(arr);
        console.log(`ALL positions:`);
        console.log(allPositions);

        // check if a position can fit a letter:
        function checkCurrentPosition(letter, position) {

            let isPositionSame = (arr[position.y][position.x] === letter);
            let isPositionEmpty = (arr[position.y][position.x] === " ");
            let isAvailable = isPositionSame || isPositionEmpty;

            if (isAvailable) {
                return 1;
            } else {
                return 0;
            }
        }

        // check if a direction is good for current word:
        function checkDirection(word, position, direction) {
            let initialX = position.x;
            let initialY = position.y;

            for (const letter of word) {
                let currentPosition = checkCurrentPosition(letter, position);
                if (currentPosition) {
                    direction.step(position);
                } else {
                    return -1
                }
            }
            // IF PLACE IS FOUND FOR ALL LETTERS OF WORD (CYCLE IS COMPLETE):

            // go back to initial position(to test next direction):
            position.x = initialX;
            position.y = initialY;

            // say position is ok:
            return 1
        }

        //get directions that are good for current word at selected position:
        function getGoodDirections(word, position) {

            // filter the directions, in which there is enough space for word lenght:
            let possibleDirections = directions.filter(direction => direction.check(position) === 1);
            console.log(`POSSIBLE directions:`);
            console.log(possibleDirections);

            // for the directions with enough space, check if all letters of word can fit in:
            let checkedDirections = possibleDirections.map(direction => {
                let answer = checkDirection(word, position, direction);
                direction.status = answer;

                return direction
            })

            // filter the directions that can fit the word:
            let goodDirections = checkedDirections.filter(direction => direction.status === 1)

            return goodDirections;
        }

        // check if any directions are available:
        function checkStatus(goodDirections, position) {

            console.log(`GOOD directions:`);
            console.log(goodDirections);

            // if there are no good directions: select a new starting position; 
            // if there are good directions: randomly select one to be used:

            if (!goodDirections.length) {

                console.log("no directions available!");
                console.log(`(${position.x}, ${position.y}) is a BAD position`);

                changePosition(position);

            } else {
                console.log("directions available!");

                let chosenDirection = randomSelection(goodDirections)
                console.log(`GO: ${chosenDirection.name}`);

                return chosenDirection
            }
        }

        // change position if needed(needs more work):
        function changePosition(previousPosition) {

            //get index of the bad previous position:
            let indexOfPreviousPosition = allPositions.indexOf(previousPosition);
            //remove the bad previous position, so it cant be selected again:
            allPositions.splice(indexOfPreviousPosition, 1);
            //reset direction statuses:
            directions.forEach(direction => direction.status = 0);

            // start another cycle of checks for the new position:
            console.log(`________________________________________`);
            console.log(`POSITION CHANGE`);
            return checkPosition(word);
        }

        // write word into puzzle array(needs more work):
        function fillWordInPuzzle(word, position, direction) {
            

            for (let l = 0; l < word.length; l++) {
                const letter = word[l];

                // console.log(`CURRENT POSITION:`);
                // console.log(`"${arr[position.y][position.x]}"`);
                // console.log(`CURRENT LETTER:`);
                // console.log(letter);

                // arr[position.y][position.x] = letter;
                // direction.step(position);


                // if the logic is working properly, this check should not be needed. however, without it words are overwritten on top of eachother in the array...TO BE FIXED!
                let currentPosition = checkCurrentPosition(letter, position);
                if (currentPosition) {

                    console.log(`CURRENT POSITION: "${arr[position.y][position.x]}"`);
                    console.log(`CURRENT LETTER: "${letter}"`);


                    arr[position.y][position.x] = letter.toUpperCase();
                    direction.step(position);

                } else {

                    // THE FOLLOWING CODE NEEDS TO BE ADJUSTED (WHILE?) AND PROBABLY ELSEWHERE (INSIDE changePosition?) CURRENTLY NOT WORKING - POSITIONS ARE CHECHED UNTIL NO MORE POSITIONS ARE LEFT!
                    // this functionality is very important for when user has control over words and size of puzzle!

                    // attempt needs to be defined elsewhere to work!
                    //this limits the number of recursions to prevent an endless loop or system overload:
                    let attempt = 0;

                    if (attempt < 5) {
                        // at this point, the goal is not to have to change the position - it must be checked in all directions, but aparently there is a bug: 
                        console.log(`LETTERS DO NOT MATCH POSITIONS`);
                        attempt++;
                        return changePosition(position);
                    } else {
                        // if maximum number of checks is performed and still no good position is found - skip word (and alert user for missing words - still to be done):
                        skippedWords.push(word);
                        console.log(`attempt limit exceeded!`);
                        console.log(`WORD SKIPPED`);
                    }
                }
            }
            return arr
        }

        // see if position works: if it does, use it and add word in array;
        function checkPosition(word) {

            // console.log(allPositions);
            if (!allPositions.length) {
                skippedWords.push(word);
                console.log(`no more positions!`);
                console.log(`WORD SKIPPED`);
            } else {
                let position = randomSelection(allPositions);
                console.log(position);

                let goodDirections = getGoodDirections(word, position);

                let result = checkStatus(goodDirections, position);
                if (result) {
                    let direction = result;
                    console.log(`FILL ${word} AT POSITION`);

                    return fillWordInPuzzle(word, position, direction)
                }
            }
        };
        checkPosition(word);
    });
    return arr;
}

let puzzleParentDiv = document.querySelector(".puzzle");

// USER INTERACTION FUNCTIONALLITY TO BE IMPLEMENTED!

// let eatBtn = document.querySelector(".eat");
// let stirBtn = document.querySelector(".stir");
// let smellBtn = document.querySelector(".smell");

// let soupTitle = document.querySelector(".soupTitle").value || "soup";
// let soupCols = document.querySelector(".soupCols").value || 30;
// let soupRows = document.querySelector(".soupRows").value || 20;

// let soupTitle = "melon";
let soupTitle = "soup";
console.log(soupTitle);

let soupCols = 12;
let soupRows = 8;

let blankSoup = makeBlankSoup(soupTitle, soupCols, soupRows);
console.log(`blank soup:`);
console.log(blankSoup);

let blankSoupHardcoded = [
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", "S", "O", "U", "P", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
];
console.log(`hardcoded blank soup:`);
console.log(blankSoupHardcoded);

let ingredients = [`water`, `potato`, `tomato`, `peas`, `mushroom`, `spaghetti`, `carrots`, `lentils`, `onion`, `garlic`, `salt`, `pepper`];

let skippedWords = [];

let userLetters = "";
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let lettersToFillBlanks = userLetters || alphabet;

// if `blanckSoup` is used instead of `blankSoupHardcoded` the puzzle is filled in a mirror-like pattern.. still have to fix that bug:
let soup = makeSoup(blankSoupHardcoded, ingredients);
console.log(soup);

// let solved = false;
// function solvePuzzle(){
//     solved = !solved;
//     console.log(solved);
// }

function renderPuzzle(arr) {

    puzzleParentDiv.style.gridTemplateColumns = `repeat(${soupCols + soupTitle.length}, 2em)`;
    puzzleParentDiv.style.gridTemplateRows = `repeat(${soupRows + 1}, 2em)`;
    // let main = document.querySelector("main");
    // main.style.height = `${blankSoup.length*2 + (blankSoup.length+1)/10}em`;

    // puzzleParentDiv.style.width = `${blankSoup[0].length + (blankSoup[0].length-1)/10}em`;
    // puzzleParentDiv.style.margin = `0 auto`;

    // console.log(arr.length);
    for (let i = 0; i < arr.length; i++) {
        
        // let element = arr[i];
        for (let j = 0; j < arr[i].length; j++) {
            let element = arr[i][j];
            // console.log(element);

            let newLetterDiv = document.createElement("div");

            if(element === " "){
                let useFill = randomSelection(lettersToFillBlanks);
                element = useFill;

                let newContent = document.createTextNode(element);
                newLetterDiv.appendChild(newContent);
                
                newLetterDiv.classList.add("item");
                newLetterDiv.classList.add("solved");
                // newLetterDiv.classList.add(`${solved}?solved:item`);
            }else{
                let newContent = document.createTextNode(element);
                newLetterDiv.appendChild(newContent);

                newLetterDiv.classList.add("item");
            }

            puzzleParentDiv.appendChild(newLetterDiv);
        }
    }
}
renderPuzzle(soup);

// eatBtn.addEventListener(`click`, ()=>{
//     solvePuzzle();
//     renderPuzzle(soup);
// });

console.log(`skipped words:`);
console.log(skippedWords);
