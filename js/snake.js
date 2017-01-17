
	var canvas = document.getElementById("c");
	var interval;
	var ctx = canvas.getContext("2d");
	var startingLength = 5;
	var x = 0, y = 0, direction = 2;
	var length = 5, columns = 50, rows = 50;
	var columnSize = (canvas.width/columns);
	var rowSize = (canvas.height/rows);
	var snakeX = [];
	var snakeY = [];
	var foodX, foodY, killTail = true;
	var grid;
	var startingTime, ticks = 0;
	var go = function() {
		document.getElementById("b").innerHTML = "Restart";
		document.getElementById("status").innerHTML = "Status = Alive";
		ticks = 0;
		for(var i = 0; i < length; ++i)
		{
			snakeX[i] = 10 - i;
			snakeY[i] = 10;
		}
		length = startingLength;
		clearInterval(interval);
		interval = setInterval(tick, 20);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var c = 0; c < columns; ++c)
		{
			ctx.strokeStyle = "#b2b2b2";
			ctx.beginPath();
			ctx.moveTo(columnSize*c, 0);
			ctx.lineTo(columnSize*c, canvas.height);
			ctx.moveTo(0,rowSize*c);
			ctx.lineTo(canvas.width, rowSize*c);
			ctx.stroke();
			grid = ctx.getImageData(0,0,canvas.width, canvas.height);
		}	
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		generatePoint();
		startingTime = new Date().getTime();
	}

	var reset = function() {
		clearInterval(interval);
	}
	

	var generatePoint = function() {
		var cont = false;
		while(!cont)
		{
			cont = true;
			foodX = Math.floor(Math.random() * columns);
			foodY = Math.floor(Math.random() * rows);
			for(var i = 0; i < length; ++i)
			{
				if(foodX == snakeX[i] && foodY == snakeY[i] || foodX > 49 || foodY > 49)
				{
					cont = false;
					break;
				}
			}
		}
//	foodX = 30;
//	foodY = snakeY[0];
//console.log("New snake food placed at " + foodX + ", " + foodY);
}

var getDecision = function()
{
	var d = 0;
	var forwardPriority = 1, leftPriority = 1, rightPriority = 1;
	var forwardX = snakeX[0] + x;
	var forwardY = snakeY[0] + y;
	var potentialLeftX = parseXDirection(newDirection(-1)), potentialLeftY = parseYDirection(newDirection(-1));
	var potentialRightX = parseXDirection(newDirection(1)), potentialRightY = parseYDirection(newDirection(1));
	var leftX = snakeX[0] + potentialLeftX;
	var leftY = snakeY[0] + potentialLeftY;
	var rightX = snakeX[0] + potentialRightX;
	var rightY = snakeY[0] + potentialRightY;
	var forwardD = Math.abs(foodX - forwardX) + Math.abs(foodY - forwardY);
	var leftD = Math.abs(foodX - leftX) + Math.abs(foodY - leftY);
	var rightD = Math.abs(foodX - rightX) + Math.abs(foodY - rightY);
	var fx = forwardX;
	
	if(forwardD > leftD)
		++forwardPriority;
	if(forwardD > rightD)
		++forwardPriority;
	if(leftD > forwardD)
		++leftPriority;
	if(leftD > rightD)
		++leftPriority;
	if(rightD > leftD)
		++rightPriority;
	if(rightD > forwardD)
		++rightPriority;

	
//	console.log(forwardD + " vs " + leftD + " vs " + rightD);
for(var i = 0; i < length; ++i)
{
	if((forwardX == snakeX[i] && forwardY == snakeY[i]) || forwardX > columns - 1 || forwardX < 0 || forwardY > rows - 1 || forwardY < 0)
	{
		forwardPriority += 20;
	}
	if((rightX == snakeX[i] && rightY == snakeY[i]) || rightX > columns - 1 || rightX < 0 || rightY > rows - 1 || rightY < 0)
	{
		rightPriority += 20;
	}
	if((leftX == snakeX[i] && leftY == snakeY[i]) || leftX > columns - 1 || leftX < 0 || leftY > rows - 1 || leftY < 0)
	{
		leftPriority += 20;
	}
}
leftObstacle = 0;
rightObstacle = 0;
var foodBetween = false;
if(leftPriority < forwardPriority || rightPriority < forwardPriority)
{
	if(potentialRightX != 0)
	{
		for(var a = snakeX[0]; a < 49 && a > 0 && rightObstacle == 0 && !foodBetween; a+= potentialRightX)
		{
			for(var b = 0; b < length && rightObstacle == 0 && !foodBetween; ++b)
			{
				if(a == snakeX[b] && snakeY[0] == snakeY[b])
				{
					rightObstacle = Math.abs(snakeX[0] - a);
				}
				else if(a == foodX && snakeY[0] == foodY)
				{
					rightObstacle == 0;
//					console.log("FOOD BETWEEN US");
					foodBetween = true;
				}
			}
		}
	}
	else if(potentialRightY != 0)
	{
		for(var a = snakeY[0]; a < 49 && a > 0 && rightObstacle == 0 && !foodBetween; a+= potentialRightY)
		{
			for(var b = 0; b < length && rightObstacle == 0 && !foodBetween; ++b)
				if(a == snakeY[b] && snakeX[0] == snakeX[b])
				{
					rightObstacle = Math.abs(snakeY[0] - a);
				}
				else if(a == foodY && snakeX[0] == foodX)
				{
					rightObstacle == 0;
//					console.log("FOOD BETWEEN US");
					foodBetween = true;
				}
		}
	}

	if(potentialLeftX != 0)
	{
		for(var a = snakeX[0]; a < 49 && a > 0 && leftObstacle == 0 && !foodBetween; a+= potentialLeftX)
		{
			for(var b = 0; b < length && leftObstacle == 0 && !foodBetween; ++b)
			{
				if(a == snakeX[b] && snakeY[0] == snakeY[b])
				{
					leftObstacle = Math.abs(snakeX[0] - a);
				}
				else if(a == foodX && snakeY[0] == foodY)
				{
					leftObstacle == 0;
//					console.log("FOOD BETWEEN US");
					foodBetween = true;
				}
			}
		}
	}
	else if(potentialLeftY != 0)
	{
		for(var a = snakeY[0]; a < 49 && a > 0 && leftObstacle == 0 && !foodBetween; a+= potentialLeftY)
		{
			for(var b = 0; b < length && leftObstacle == 0 && !foodBetween; ++b)
				if(a == snakeY[b] && snakeX[0] == snakeX[b])
				{
					leftObstacle = Math.abs(snakeY[0] - a);
				}
				else if(a == foodY && snakeX[0] == foodX)
				{
					leftObstacle == 0;
//					console.log("FOOD BETWEEN US");
					foodBetween = true;
				}
		}
	}


//	console.log(leftObstacle + " away VS " + rightObstacle + " away");
	if((leftObstacle > rightObstacle && rightObstacle > 0) || (leftObstacle == 0 && rightObstacle != 0))
	{
		rightPriority += 3;
//		console.log("DECIDED LEFT");
	}
	else if((rightObstacle > leftObstacle && leftObstacle > 0) || (rightObstacle == 0 && leftObstacle != 0))
	{
		leftPriority += 3;
//		console.log("DECIDED RIGHT");
	}
}

if(forwardPriority <= leftPriority && forwardPriority <= rightPriority)
	d = 0;
else if(leftPriority <= forwardPriority && leftPriority <= rightPriority)
	d = -1;
else if(rightPriority <= leftPriority && rightPriority <= forwardPriority)
	d = 1;
//console.log("d = " + d + ", " + forwardPriority + " vs" + leftPriority + " vs " +rightPriority);
return d;

}

var newDirection = function(dec) //input a decision (1, 0, -1) and it returns the new direction you will be traveling
{
	var newD = direction;
	if(dec == -1)
		newD--; //left
	else if(dec == 1)
		newD++; //right
	if(newD > 4)
		newD -= 4;
	else if(newD < 1)
		newD += 4;
	return newD;
}

var parseXDirection = function(d)
{
	var newX;
	if(d == 1)
	{
		newX = 0;
	}
	else if(d == 2)
	{
		newX = 1;
	}
	else if(d == 3)
	{
		newX = 0;
	}
	else if(d == 4)
	{
		newX = -1;
	}
	return newX;
}
var parseYDirection = function(d)
{ 
	var newY;
	if(d == 1)
	{
		newY = -1;
	}
	else if(d == 2)
	{
		newY = 0;
	}
	else if(d == 3)
	{
		newY = 1;
	}
	else if(d == 4)
	{
		newY = 0;
	}
	return newY;
}
var tick = function() 
{
	document.getElementById("time").innerHTML = "Lived for: " +(new Date().getTime() - startingTime)/1000 + " seconds...";
	ticks++;
	document.getElementById("tick").innerHTML = "Lived for: " + ticks + " ticks";
	var decision = getDecision(); //all AI behavior should be here
	direction = newDirection(decision);
	x = parseXDirection(direction);
	y = parseYDirection(direction);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(grid, 0, 0);
	for(var i = length-1; i > 0; --i)
	{
		snakeX[i] = snakeX[i -1];
		snakeY[i] = snakeY[i -1];
	}
	snakeX[0] = snakeX[1] + x;
	snakeY[0] = snakeY[1] + y;
	for(var i = 0; i < length; ++i)
	{
		ctx.fillStyle = "red";
		if(i == 0)
			ctx.fillStyle = "black";
		ctx.fillRect(snakeX[i]*columnSize,snakeY[i]*rowSize, columnSize, rowSize);
	}
	ctx.fillRect(foodX * columnSize, foodY * rowSize, columnSize, rowSize);
	checkDeath();
	checkFood();
}

var checkDeath = function()
{
	var alive = true;
	if(snakeX[0] > 49 || snakeX[0] < 0 || snakeY[0] > 49 || snakeY[0] < 0)
		alive = false;
	for(var i = 1; i < length; ++i)
	{
		if(snakeX[0] == snakeX[i] && snakeY[0] == snakeY[i])
			alive = false;
	}
	if(!alive)
	{
		clearInterval(interval);
		document.getElementById("status").innerHTML = "Status = Dead";
	}
}

var checkFood = function()
{
	if(snakeX[0] == foodX && snakeY[0] == foodY)
	{
		length++;
		killTail = false;
		generatePoint();
	}
	else
		killTail = true;
}