var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };


var canvas = document.createElement('canvas');
var width = 800;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
	document.body.appendChild(canvas);
	animate(step);
};
var step = function() {
	update();
	render();
	animate(step);
};

var update = function() {	
};

var render = function() {
	context.fillStyle = "#000000";
	context.fillRect(0,0,width,height);
};

function Paddle(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
};

Paddle.prototype.render = function() {
	context.fillStyle = "#FFFFFF";
	context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
	this.paddle = new Paddle(25, (canvas.height - 25)/2, 20, 100);
};

function Computer() {
	this.paddle = new Paddle(canvas.width - 50, (canvas.height - 25)/2, 20, 100)
};

Player.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.render = function() {
	this.paddle.render();
};

function Ball(x,y) {
	this.x = x;
	this.y = y;
	if(Math.random()*2 >= 1) {
		this.x_speed = 4;
	} else {
		this.x_speed = -4;
	}
	if(Math.random()*2 >= 1) {
		this.y_speed = Math.random() * 4;
	} else {
		this.y_speed = Math.random() * -4;
	}
	this.radius = 10;
};

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x,this.y,this.radius, 2* Math.PI, false);
	context.fillStyle = "FFFFFF";
	context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball((width/2),(height/2));

var render = function() {
	context.fillStyle = "#000000";
	context.fillRect(0,0,width,height);
	player.render();
	computer.render();
	ball.render();
};

var update = function() {
	player.update();
	computer.update(ball);
	ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function(ball) {
  var y_pos = ball.y;
  var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
  if(diff < 0 && diff < -4) { // max speed up
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed down
    diff = 5;
  }
  this.paddle.move(0, diff);
  if(this.paddle.y < 0) {
    this.paddle.y = 0;
  } else if (this.paddle.y + this.paddle.height > height) {
    this.paddle.y = height - this.paddle.height;
  }
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) { // up arrow
      this.paddle.move(0, -4);
    } else if (value == 40) { // down arrow
      this.paddle.move(0, 4);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x,y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;
	if(this.y < 0) {
		this.y = 0;
		this.y_speed = 0;
	} else if(this.y + this.height > height) {
		this.y = height - this.height;
		this.y_speed = 0;
	}
}

Ball.prototype.update = function(paddle1, paddle2) {
	this.x += this.x_speed;
	this.y += this.y_speed;
	var left_x = this.x - 10;
	var top_y = this.y - 10;
	var right_x = this.x + 10;
	var bottom_y = this.y +10;
	
	if(this.y -10 < 0) {
		this.y = 10;
		this.y_speed = -this.y_speed;
	} else if(this.y + 10 > height) {
		this.y = height - 10;
		this.y_speed = -this.y_speed;
	}
	
	if(this.x < 0 || this.x > width) {
		this.x = (width/2);
		this.y = (height/2);
		if(Math.random()*2 >= 1) {
			this.x_speed = 4;
		} else {
			this.x_speed = -4;
		}
		if(Math.random()*2 >= 1) {
			this.y_speed = Math.random() * 4;
		} else {
			this.y_speed = Math.random() * -4;
		}
	}
		
	if(left_x < (width/2)) {
		if(left_x < (paddle1.x + paddle1.width) && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
			this.y_speed += (paddle1.y_speed / 2);
			this.x_speed = -this.x_speed;
			this.x += this.x_speed;
		}
		
	} else {
		if(right_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
			this.y_speed += (paddle1.y_speed / 2);
			this.x_speed = -this.x_speed;
			this.x += this.x_speed;
		}
	}
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.which] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.which];
});