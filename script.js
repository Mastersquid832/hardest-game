// World's Hardest Game, 2019

// Details for the screen and its size
var xMin;
var xMax;
var yMin;
var yMax;

// Global variables for the HTML5 canvas
var canvas;
var context;
var player;
var obstacles;
var level;
var course;
var objective;

// Information for setInterval() and clearInterval()
var intervalId;
const updateInterval = 10; // interval in milliseconds

// Movement booleans for keyboard input from user
var up;
var down;
var right;
var left;

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.code === "ArrowUp") {
        up = true;
    } else if (e.code === "ArrowDown") {
        down = true;
    } else if (e.code === "ArrowRight") {
        right = true;
    } else if (e.code === "ArrowLeft") {
        left = true;
    }
});

document.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.code === "ArrowUp") {
        up = false;
    } else if (e.code === "ArrowDown") {
        down = false;
    } else if (e.code === "ArrowRight") {
        right = false;
    } else if (e.code === "ArrowLeft") {
        left = false;
    }
});

function loadGame() {
    xMin = 0;
    xMax = 1200;
    yMin = 0;
    yMax = 500;
    
    canvas = document.getElementById("board");
    canvas.width = xMax;
    canvas.height = yMax;
    context = canvas.getContext("2d");
    
    intervalId = null; 

    up = false;
    down = false;
    right = false;
    left = false;
}

function stopGame() {
    if (intervalId != null) {
        clearInterval(intervalId);
    }
    intervalId = null;
}

function startGame() {
    stopGame();
    
    var andrewFace = "https://greenecounty.alumni.osu.edu/wp-content/uploads/sites/25/2018/06/Andrew-Haberlandt.jpg";
    var aleksFace = "https://scontent-sea1-1.cdninstagram.com/vp/e92b43bf1d1c01d0a298e3937733c06c/5DD9D0C6/t51.2885-19/s150x150/52486763_624841137975557_4315053367689740288_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com";
    var blockO = "https://i.pinimg.com/originals/e6/93/9b/e6939b21548bcf2d2a98b150c3867cdb.png"

    player = new Player(andrewFace, 80, 80, 3, 10, 10);
    objective = new Objective(blockO, 80, 80, new Point(1020, 210));

    var levelDropdown = document.getElementById("level-select");
    level = levelDropdown.options[levelDropdown.selectedIndex].value;

    if(level == 1)
    {
        course = [];

        obstacles = [
            new Obstacle(aleksFace, 80, 80, 0, .25, 0, 0, 1200, 500, 100, 0),
            //new Obstacle(aleksFace, 80, 80, 0, -.25, 0, 0, 1200, 500, 300, 420),
            //new Obstacle(aleksFace, 80, 80, .1, .2, 0, 0, 1200, 500, 600, 0),
            //new Obstacle(aleksFace, 80, 80, -.1, .2, 0, 0, 1200, 500, 900, 0),
        ];
    }
    else if(level == 2)
    {
        course = [];

        obstacles = [
            new Obstacle(aleksFace, 80, 80, 0, .25, 0, 0, 1200, 500, 100, 0)
        ];
    }
    else {
        console.log("No level selected. ");
    }

    let restartInnerHtml = "<i class='material-icons float-left'>replay</i>Restart";

    document.getElementById("playRestartButton").innerHTML = restartInnerHtml;

    intervalId = setInterval(updateGameState, updateInterval);
}

class Objective {
    constructor(image, width, height, point)
    {
        this.image = new Image(width, height)
        this.image.src = image;
        this.point = point;
    }
}

// 2D point within bounds of screen
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.checkPoint();
    }

    checkPoint() {
        if (this.x < xMin || this.x > xMax) {
            alert("x-coordinate " + this.x + " is out of range, xMin = " + xMin + " and xMax = " + xMax);
        }
        if (this.y < yMin || this.y > yMax) {
            alert("y-coordinate " + this.y + " is out of range, yMin = " + yMin + " and yMax = " + yMax);
        }
    }
    
    subtractX(subtractFromX) {
        this.x -= subtractFromX;
    }

    subtractY(subtractFromY) {
        this.y -= subtractFromY;
    }

    addX(addToX) {
        this.x += addToX;
    }

    addY(addToY) {
        this.y += addToY;
    }
}

// Game obstacle
class Obstacle {
    constructor(imageSrc, imageWidth, imageHeight, speedX, speedY, startPointX, startPointY, endPointX, endPointY, currentPointX, currentPointY) {
        this.image = new Image(imageWidth, imageHeight);
        this.image.src = imageSrc;
        this.speedX = speedX;
        this.speedY = speedY;
        this.startPoint = new Point(startPointX, startPointY);
        this.currentPoint = new Point(currentPointX, currentPointY);
        this.endPoint = new Point(endPointX - (this.image.width), endPointY - (this.image.height));
    }
}

class Rectangle{
    constructor(width, height, x, y, color)
    {
        this.width = width;
        this.height = height;
        this.position = new Point(x, y);
        this.color = color;
    }
}

class Player {
    constructor(imageSrc, imageWidth, imageHeight, speed, pointX, pointY) {
        this.image = new Image(imageWidth, imageHeight);
        this.image.src = imageSrc;
        this.speed = speed;
        this.currentPoint = new Point(pointX, pointY);
    }

    moveRight() {
        if (this.currentPoint.x  + player.speed <= xMax - this.image.width)
        {
            this.currentPoint.addX(player.speed);
        }
    }

    moveLeft() {
        if (this.currentPoint.x - player.speed >= xMin)
        {
            this.currentPoint.subtractX(player.speed);
        }
    }

    moveUp() {
        if (this.currentPoint.y - player.speed >= yMin)
        {
            this.currentPoint.subtractY(player.speed);
        }
    }

    moveDown() {
        if (this.currentPoint.y + player.speed <= yMax - this.image.height)
        {
            this.currentPoint.addY(player.speed);
        }
    }
}

function updateGameState() {
    moveAndDrawObstacles();
    moveAndDrawPlayer();
    drawCourse();
    drawObjective();
    atObjective();
    hitObstacle();
}

function atObjective() {
    var objectiveLeft = objective.point.x;
    var objectiveRight = objective.point.x + objective.image.width;
    var objectiveTop = objective.point.y;
    var objectiveBottom = objective.point.y + objective.image.height;

    var points = [new Point(player.currentPoint.x, player.currentPoint.y), 
        new Point(player.currentPoint.x + player.image.width, player.currentPoint.y),
        new Point(player.currentPoint.x, player.currentPoint.y + player.image.height),
        new Point(player.currentPoint.x + player.image.width, player.currentPoint.y + player.image.height)]

    for(var i = 0; i < 4; i++){
        var point = points[i];
        if(objectiveLeft < point.x && point.x < objectiveRight && objectiveTop < point.y && point.y < objectiveBottom)
        {
            stopGame();
            clearCanvas();
            context.font = "30px Arial";
            context.fillText("You Won!!!", 600, 250);    
        }
    }
}

function hitObstacle() {
    for(var n = 0; n < obstacles.length; n++) {
        var obstacle = obstacles[n];
        var obstacleLeft = obstacle.currentPoint.x;
        var obstacleRight = obstacle.currentPoint.x + objective.image.width;
        var obstacleTop = obstacle.currentPoint.y;
        var obstacleBottom = obstacle.currentPoint.y + objective.image.height;

        var points = [new Point(player.currentPoint.x, player.currentPoint.y), 
            new Point(player.currentPoint.x + player.image.width, player.currentPoint.y),
            new Point(player.currentPoint.x, player.currentPoint.y + player.image.height),
            new Point(player.currentPoint.x + player.image.width, player.currentPoint.y + player.image.height)]

        for(var i = 0; i < 4; i++){
            var point = points[i];
            if(obstacleLeft < point.x && point.x < obstacleRight && obstacleTop < point.y && point.y < obstacleBottom)
            {
                stopGame();
                clearCanvas();
                context.font = "30px Arial";
                context.fillText("You Lost!!!", 600, 250);    
            }
        }
    }
}

function moveAndDrawPlayer() {
    if (up) {
        player.moveUp();
    }
    if (down) {
        player.moveDown();
    }
    if (left) {
        player.moveLeft();
    }
    if (right) {
        player.moveRight();
    }
    drawImage(player.image, player.currentPoint);
}

function moveAndDrawObstacles() {
    clearCanvas();
    for (var i = 0; i < obstacles.length; i++)
    {
        //calculate future position of the obstacle
        obstacles[i].currentPoint.addX(obstacles[i].speedX * updateInterval);
        obstacles[i].currentPoint.addY(obstacles[i].speedY * updateInterval);
        
        if (obstacles[i].currentPoint.x < obstacles[i].startPoint.x || obstacles[i].currentPoint.x > obstacles[i].endPoint.x || obstacles[i].currentPoint.y < obstacles[i].startPoint.y || obstacles[i].currentPoint.y > obstacles[i].endPoint.y){
            obstacles[i].speedX *= -1;
            obstacles[i].speedY *= -1;
        }

        //draw the obstacle
        drawImage(obstacles[i].image, obstacles[i].currentPoint);
    }
}

function drawCourse()
{
    for(var i = 0; i < course.length; i++)
    {
        var rect = course[i];
        context.fillStyle = rect.color;
        context.fillRect(rect.position.x, rect.position.y, rect.width, rect.height);
    }
}

function drawObjective()
{
    drawImage(objective.image, objective.point);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Draws an image object on the canvas at the given point
function drawImage(image, point) {

    //console.log("image.width = " + image.width);
    //console.log("image.height = " + image.height);

    // Draw the image at the point
    context.drawImage(image, point.x, point.y, image.width, image.height);
}

