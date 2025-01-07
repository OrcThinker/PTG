"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMsg", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});

connection.on("ReceiveCubes", function (cubes) {
    console.log("receive cubes:")
    console.log(cubes)
    setCubes(cubes)
});

let setCubes = (cubesArr) => {
    for (let x = 0; x < cubesArr.length; x++) {
        for (let y = 0; y < cubesArr[0].length; y++) {
            cubesMatrix[x][y] = cubesArr[x][y]
        }
    }
} 

connection.on("ReceiveMoveRect", function (user, direction) {
    switch (direction) {
        case "up":
            rectY -= rectMs;
            break;
        case "down":
            rectY += rectMs;
            break;
        case "left":
            rectX -= rectMs;
            break;
        case "right":
            rectX += rectMs;
            break;
        default:
            break;
    }
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
    getCubes()
}).catch(function (err) {
    return console.error(err.toString());
})

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let canvasWidth = canvas.width = 400
let canvasHeight = canvas.height = 640

let rectX = 100
let rectY = 100
let rectMs = 10 
let cubesMatrix = [...Array(10)].map(_ => Array(16).fill(0))       
let vertVisibleCubes = 16
let cubeWidth = canvasWidth / cubesMatrix.length
let cubeHeight = canvasHeight / vertVisibleCubes 
let cursorPosX = 0;
let cursorPosY = 0;
let selectOneX, selectOneY, selectTwoX, selectTwoY;

//Types of cubes for now:
//1red,2green,3blue,4white,5black
//null / 0 = empty
function fillCubes(width,height) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            cubesMatrix[x][y] = getRandomInt(5) + 1
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    drawCubes();
    drawCursor();
    drawText();
    requestAnimationFrame(draw)
}

function drawCursor() {
    ctx.fillStyle = "#cccccc77"
    //ctx.strokeStyle = ""
    let posX = cursorPosX * cubeWidth
    let posY = canvasHeight - cubeHeight - (cubeHeight * cursorPosY)
    ctx.fillRect(posX, posY, cubeWidth, cubeHeight)
    ctx.strokeRect(posX - 1, posY - 1, cubeWidth+2, cubeHeight+2)
}

let drawText = () => {
    ctx.fillStyle = "black"
    ctx.fillText(`cursor: ${cursorPosX}:${cursorPosY}`, 10, 10);
    ctx.fillText(`s1: ${selectOneX}:${selectOneY}`, 10, 30);
    ctx.fillText(`s2: ${selectTwoX}:${selectTwoY}`, 10, 50);
}

function drawCubes() {
    let width = cubesMatrix.length
    let height = cubesMatrix[0].length
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            //if (cubesMatrix[x][y] == )
            switch (cubesMatrix[x][y]) {
                case 0:
                    continue;
                case 1:
                    ctx.fillStyle = "red";
                    break;
                case 2:
                    ctx.fillStyle = "blue";
                    break;
                case 3:
                    ctx.fillStyle = "green";
                    break;
                case 4:
                    ctx.fillStyle = "#666";
                    break;
                case 5:
                    ctx.fillStyle = "#333";
                    break;
                default:
                    break;
            }
            let posX = x * cubeWidth
            let posY = canvasHeight - cubeHeight - (cubeHeight * y);
            //console.log(posX)
            //console.log(posY)
            //console.log(cubeWidth)
            //console.log(cubeHeight)
            ctx.fillRect(posX, posY, cubeWidth, cubeHeight)
        }
    }
}

//fillCubes(10,10)
draw()


document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;

    randCubes();
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

let moveRectOnline = (direction) => {
    var user = document.getElementById("userInput").value;
    connection.invoke("MoveRect", user, direction).catch(function (err) {
        return console.error(err.toString());
    });
}

//Remove xd later on
//For now focus on canvas
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "ArrowDown":
            console.log("down")
            //moveRectOnline("down");
            cursorPosY--;
            break;
        case "ArrowUp":
            console.log("up")
            //moveRectOnline("up");
            cursorPosY++;
            break;
        case "ArrowLeft":
            console.log("left")
            //moveRectOnline("left");
            cursorPosX--;
            break;
        case "ArrowRight":
            console.log("right")
            //moveRectOnline("right");
            cursorPosX++;
            break;
        case " ":
            handleSelect()
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);

let handleSelect = () => {
    if (selectOneX == undefined || selectOneX == null) {
        selectOneX = cursorPosX
        selectOneY = cursorPosY
    } else if (selectTwoX == undefined || selectTwoX == null) {
        selectTwoX = cursorPosX
        selectTwoY = cursorPosY
    } else {
        swapCubes(selectOneX, selectOneY, selectTwoX, selectTwoY)
        selectOneX = null
        selectOneY = null
        selectTwoX = null
        selectTwoY = null
    }
}

let gameActive = true

let getCubes = () => {
    var user = document.getElementById("userInput").value;
    connection.invoke("SendCubes", user).catch(function (err) {
        return console.error(err.toString());
    });
}


let randCubes = () => {

    var user = document.getElementById("userInput").value;
    connection.invoke("RandomizeCubes", user).catch(function (err) {
        return console.error(err.toString());
    });
}

let swapCubes = (selectOneX, selectOneY, selectTwoX, selectTwoY) => {

    var user = document.getElementById("userInput").value;
    connection.invoke("SwapCubes", user, selectOneX, selectOneY, selectTwoX, selectTwoY).catch(function (err) {
        return console.error(err.toString());
    });
}
