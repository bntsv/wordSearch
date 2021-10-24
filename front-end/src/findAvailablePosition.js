"use strict";

//diagonal directions are not fixed

let arr = [
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

console.log(arr);

// let wordsArr = [`autumn`, `winter`, `spring`, `summer`];
// let wordsArr = [`monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`];
// let wordsArr = [`january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`];
let ingredients = [`water`, `potato`, `tomato`, `peas`, `mushroom`, `spaghetti`, `carrots`, `lentils`, `onion`, `garlic`, `salt`, `pepper`];
let skippedWords = [];

let userLetters = "";
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

function makeSoup(arr, wordsArr) {

    // let arrCopy = (function clonePuzzle(puzzle) {
    //     let clone = []
    //     for (let i = 0; i < puzzle.length; i++) {
    //         clone[i] = puzzle[i].slice();
    //         // https://stackoverflow.com/questions/13756482/create-copy-of-multi-dimensional-array-not-reference-javascript
    //     }

    //     return clone
    // })(arr)

    wordsArr.forEach(word => {

        console.log(`______________________________________________________________________`);
        console.log(`word:`);
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
        console.log(`directions:`);
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
        console.log(`allPositions:`);
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
                console.log(`go: ${chosenDirection.name}`);

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
            console.log(`______________________________________________________________________`);
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
                    //this limits the number of recursions to prevent an endless loop or system overload:
                    let attempt = 0;

                    if (attempt < 5) {
                        // at this point, the goal is not to have to change the position - it must be checked in all directions, but aparently there is a bug: 
                        return changePosition(position);
                    } else {
                        // if maximum number of checks is performed and still no good position is found - skip word (and alert user for missing words - still to be done):
                        skippedWords.push(word);
                        console.log(`attempt limit exceeded!`);
                        console.log(`WORD SKIPPED`);
                    }
                    return attempt++;
                }
            }
            return arr
        }

        // see if position works: if it does, use it and add word in array;
        function checkPosition(word) {

            console.log(allPositions);
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

console.log(makeSoup(arr, ingredients));
console.log(skippedWords);
