// World's Hardest Game, 2019

// The user-controlled entity that performs actions in the game
//let player = new Player();

// Global variables for the Canvas
var context;
var canvas;
var obstacles = [];
var oldTimeStamp = 0.0;

// Details for the screen and its size
let xMin = 0, xMax = 800; 
let yMin = 0, yMax = 600;

// Runs on Document Load, initializes full programs
document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById("board");
    canvas.width = xMax;
    canvas.height = yMax;
    context = canvas.getContext("2d");

    var img = new Image(20, 20);
    img.src = "https://scontent-sea1-1.cdninstagram.com/vp/e92b43bf1d1c01d0a298e3937733c06c/5DD9D0C6/t51.2885-19/s150x150/52486763_624841137975557_4315053367689740288_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com";
    var startPoint = new Point(10, 10);
    var endPoint = new Point(500, 500);
    var ob1 = new Obstacle(img, 2, startPoint, endPoint);
    obstacles.push(ob1);
    window.requestAnimationFrame(gameLoop);
}, false); // Do we need this optional boolean parameter?

// Creates a 2D Point within the bounds of the screen
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        if (x < xMin || x > xMax) {
            alert("x-coordinate " + x + " is out of range, xMin = " + xMin + " and xMax = " + xMax);
        }
        if (y < yMin || y > yMax) {
            alert("y-coordinate " + y + " is out of range, yMin = " + yMin + " and yMax = " + yMax);
        }
    }
}

// Constructor for an Obstacle
class Obstacle {
    constructor(image, speed, startPoint, endPoint) {
        //the this.image is an image object
        this.image = image;
        this.speed = speed;
        // All of these are Point's
        this.startPoint = startPoint;
        this.currentPoint = new Point(0, 0);
        this.endPoint = endPoint;
    }
}

function gameLoop(timeStamp)
{
    var timePassed = timeStamp - oldTimeStamp;
    oldTimeStamp = timeStamp;

    updateObstaclePositions(timePassed);
    window.requestAnimationFrame(gameLoop);
}

function updateObstaclePositions(timePassed)
{
    for(var i = 0; i < obstacles.length; i++)
    {
        //calculate future position of the obstacle
        obstacles[i].currentPoint.x += obstacles[i].speed * timePassed;
        obstacles[i].currentPoint.y += obstacles[i].speed * timePassed;
        if(obstacles[i].currentPoint.x > obstacles[i].startPoint.x){}
        //draw the obstacle
        drawImage(obstacles[i].image, obstacles[i].currentPoint);
    }
}

function drawImage(image, point)
{
    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //draw the image at the point
    context.drawImage(image, point.x, point.y);
}

// Makes a point class so new points can be declared with x and y properties 
function Point(x, y) 
{
  this.x = x;
  this.y = y;
}

// Used to determine if the the player shape has touched an obstacle
function isPlayerTouchingObstacle(player, obstacle)
{
    let defaultPlayerCoordinates = 
    {
        topLeft: new Point(player.x - (player.width / 2), player.y - (player.height / 2)), // Top-Left Point
        topRight: new Point(player.x + (player.width / 2), player.y - (player.height / 2)), // Top-Right Point
        bottomLeft: new Point(player.x - (player.width / 2), player.y + (player.height / 2)), // Bottom-Left Point
        bottomRight: new Point(player.x + (player.width / 2), player.y + (player.height / 2))  // Bottom-Right Point
    }

    //***We will likely need a different collision detection system for different obstacle types (squares, circles, etc.)
    let obstacleMinX = obstacle[0];
    let obstacleMaxX = obstacle[0] + obstacle[2];
    let obstacleMinY = obstacle[1];
    let obstacleMaxY = obstacle[1] + obstacle[3];

    let isPlayerTouchingObstacle = false;

    if (defaultPlayerCoordinates.topLeft.x >= obstacleMinX && defaultPlayerCoordinates.topLeft.x <= obstacleMaxX && defaultPlayerCoordinates.topLeft.y >= obstacleMinY && defaultPlayerCoordinates.topLeft.y <= obstacleMaxY ||
        defaultPlayerCoordinates.topRight.x >= obstacleMinX && defaultPlayerCoordinates.topRight.x <= obstacleMaxX && defaultPlayerCoordinates.topRight.y >= obstacleMinY && defaultPlayerCoordinates.topRight.y <= obstacleMaxY ||
        defaultPlayerCoordinates.bottomLeft.x >= obstacleMinX && defaultPlayerCoordinates.bottomLeft.x <= obstacleMaxX && defaultPlayerCoordinates.bottomLeft.y >= obstacleMinY && defaultPlayerCoordinates.bottomLeft.y <= obstacleMaxY ||
        defaultPlayerCoordinates.bottomRight.x >= obstacleMinX && defaultPlayerCoordinates.bottomRight.x <= obstacleMaxX && defaultPlayerCoordinates.bottomRight.y >= obstacleMinY && defaultPlayerCoordinates.bottomRight.y <= obstacleMaxY)
    {
        isPlayerTouchingObstacle = true;
    }

    return isPlayerTouchingObstacle;        
}

//!!! Under Construction !!!
// Used to check if player is within bounds
// This checks if any point is off a rectangle, not that any point is inside a rectangle like isCarTouchingRectangle
// Because our course is only rectangles and not defined by the walls, this needs to be much more complex :P 
function isPlayerOffPath(player)
{
    // Each corner is defined as a "Point" - Has x and y properties / data fields 
    let defaultPlayerCoordinates = 
    {
        topLeft: new Point(player.x - (player.width / 2), player.y - (player.height / 2)), // Top-Left Point
        topRight: new Point(player.x + (player.width / 2), player.y - (player.height / 2)), // Top-Right Point
        bottomLeft: new Point(player.x - (player.width / 2), player.y + (player.height / 2)), // Bottom-Left Point
        bottomRight: new Point(player.x + (player.width / 2), player.y + (player.height / 2))  // Bottom-Right Point
    }
    let areAllPointsInsideARectangle = true;
    // If any of the points are "not in a rectangle" then the player is "off path" and this entire method returns false 
    if (!isPointInsideARectangle(defaultPlayerCoordinates.topLeft)) { areAllPointsInsideARectangle = false; }    
    else if (!isPointInsideARectangle(defaultPlayerCoordinates.topRight)) { areAllPointsInsideARectangle = false; }
    else if (!isPointInsideARectangle(defaultPlayerCoordinates.bottomLeft)) { areAllPointsInsideARectangle = false; }
    else if (!isPointInsideARectangle(defaultPlayerCoordinates.bottomRight)) { areAllPointsInsideARectangle = false; }
    // If you're wondering why this is negated, the boolean value here is the opposite of what we're trying to return as part of the method
    // If they're "all inside a rectangle", it's on the path. Therefore, this function should return that it's "not off the path", or, on the path.  
    return !areAllPointsInsideARectangle;
}

// Does exactly what it says - Functions should be as self-documenting as possible w/o needing comments 
function isPointInsideARectangle(point)
{
    let isPointInsideARectangle = false;
    // Iterates through each rectangle on the course 
    for (let i = 0; i < obstacles.length; i++)
    {
        // Determining the bounds for the rectangle 
        let obstacleMinX = obstacles[i][0];
        let obstacleMaxX = obstacles[i][0] + obstalces[i][2];
        let obstacleMinY = obstacles[i][1];
        let obstacleMaxY = obstacles[i][1] + obstalces[i][3];
        if (point.x >= obstacleMinX && point.x <= obstacleMaxX && point.y >= obstacleMinY && point.y <= obstacleMaxY)
        {
            isPointInsideARectangle = true;
            break;
        }
    }
    return isPointInsideARectangle;
}
