let speedIncrease = 0;
let levelInterval;
let scoreInterval;
let play = true;
let gameBegin = false;
let restart = false;

//const bgAudio = document.getElementById("myAudio"); 

const playorPauseAudio = function() { 
	button = document.getElementById("pauseAudio");
	if(button.classList.contains("paused") === true){
		bgSound.play(); 
		button.classList.remove("paused");
		button.src = "images/buttons/pause.png";
	}else{
		bgSound.pause(); 
		button.classList.add("paused");
		button.src = "images/buttons/play.png";
	}
}; 

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = 1366;
canvas.height = 569;

const gameOverSound = new Audio('audio/gameover.mp3');
const bgSound = new Audio('audio/game-sound.mp3');

const goodGuyImg = new Image();
goodGuyImg.src = 'images/hero_ninja.png';

const badGuysImagesPath = 'images/enemies/';
const badGuyImages = [];
for(let i = 1; i < 12; i++){
	badGuyImages.push(badGuysImagesPath+'enemy'+i+'.png');
}

const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;
document.addEventListener('keydown', function(event) {
	hero.update(event.keyCode);
}, false);

const rand = function(num) {
	return Math.floor(Math.random() * num) + 1;
};
const plusOrMinus = function() {
	return Math.random() < 0.5 ? -1 : 1;
}
const draw = function() {
	context.drawImage(this.image, this.x, this.y, this.width, this.height);
};

const hero = {
	x: canvas.width/2 - 35,
	y: canvas.height - 70,
	xDelta: 10,
	yDelta: 10,
	width: 70,
	height: 70,
	image: goodGuyImg,
	draw: draw,
	update: function(keyCode){
		if(keyCode === upKey) {
			if(this.y <= 0) {
				return false;
			}
			this.y -= this.yDelta;
		} else if(keyCode === downKey) {
			if(this.y >= canvas.height - hero.height) {
				return false;
			}
			this.y += this.yDelta;
		} else if(keyCode === leftKey) {
			if(this.x <= 0) {
				return false;
			}
			this.x -= this.xDelta;
		} else if(keyCode === rightKey) {
			if(this.x >= canvas.width - hero.width) {
				return false;
			}
			this.x += this.xDelta;
		}
	}
};

const createEnemies = function(count, canvasWidth, canvasHeight, action = 'start') {
	const enemies = [];
	for(let i=0;i<count;++i){
		const currentEnenmy = {width: 30, height: 30, xDelta: plusOrMinus(), yDelta: plusOrMinus()};
		currentEnenmy.x = rand(canvas.width - currentEnenmy.width)
		currentEnenmy.y = rand(canvas.height - 2*hero.height - currentEnenmy.height)
		currentEnenmy.image = new Image();
		currentEnenmy.image.src = badGuyImages[rand(5)-1];
		currentEnenmy.draw = draw;
		currentEnenmy.update = function() {
			this.xDelta = (this.xDelta > 0) ? this.xDelta + speedIncrease/60 : this.xDelta - speedIncrease/60;
			this.yDelta = (this.yDelta > 0) ? this.yDelta + speedIncrease/60 : this.yDelta - speedIncrease/60;
			this.xDelta = (this.x >= canvas.width -30 || this.x <= 0) ? this.xDelta *= -1 : this.xDelta;
			this.yDelta = (this.y >= canvas.height -30 || this.y <= 0) ? this.yDelta *= -1 : this.yDelta;
			this.x += this.xDelta;
			this.y += this.yDelta;
			if(this.x + this.width >= hero.x && this.x <= hero.x + hero.width && this.y + this.height >= hero.y && this.y <= hero.y + hero.height){
				play = false;
				clearInterval(levelInterval);
				clearInterval(scoreInterval);
				playorPauseAudio();
				gameOverSound.play();
				document.getElementById("gameOver").style.display = 'flex';
			}
		};
		enemies[i] = currentEnenmy;
	}
	return enemies;
}

const moveEnemies = function(onGame = false){
	if(onGame){
		enemies = enemies.concat(createEnemies(3, canvas.width, canvas.height))
	}
	if(restart){
		enemies.length = 5;
	}
	for(let enemy of enemies){
		if(restart){
			enemy.x = rand(canvas.width - 30)
			enemy.y = rand(canvas.height - 2*hero.height - 30)
			enemy.xDelta = Math.abs(enemy.xDelta) / enemy.xDelta
			enemy.yDelta = Math.abs(enemy.yDelta) / enemy.yDelta
		}
		enemy.draw();
		enemy.update();
	}
	if(restart){
		restart = false;
	}
}

let enemies = createEnemies(5, canvas.width, canvas.height)
const loop = function() {
	if(!play){
		return false;
	}
	if(gameBegin){
		button = document.getElementById("pauseAudio").style.visibility = 'visible';
		const background = new Image();
		background.src = 'images/bg_main.png';
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		hero.draw()
		moveEnemies();
	}
	requestAnimationFrame(loop);
};

const startGame = function(action = 'start'){
	speedIncrease = 0;
	let speedDefault = 0;
	let levelDefault = 0;
	let level = document.getElementById("level")
	level.innerHTML = levelDefault;
	let score = document.getElementById("score")
	score.innerHTML = (speedDefault).toFixed(1);
	
	scoreInterval = setInterval(function(){
		speedDefault += 0.1;
		score.innerHTML = (speedDefault).toFixed(1);
	},100)

	levelInterval = setInterval(function(){
		speedIncrease += 0.1;
		levelDefault += 1
		level.innerHTML = levelDefault;
		moveEnemies(true);
	},5000)
	hero.x = canvas.width/2 - 35;
	hero.y = canvas.height - 70;
	gameBegin = true;
	if(action === 'restart'){
		restart = true;
	}
	document.getElementById("gamePlay").style.display = 'none';
	document.getElementById("gameOver").style.display = 'none';
	play = true;
	loop();
}