/***************
 * PART FIVE - Finishing touches
 ***************/

/* NOTES TO REMEMBER
 * Could add
 * - hitboxes to all objects to make collision better
 * - levels
 * - bosses
 * - explosions / particles
 * - parallax background
 * - vectors for movement
 * - lirbraries! http://www.createjs.com/#!/CreateJS
 */

/* RESOURCES
 * http://www.w3schools.com/html5/html5_ref_av_dom.asp
 * http://www.superflashbros.net/as3sfxr/
 */

 /*ADJUSTABLE VARIABLES*/
var level = 2;

 var timeLimitSecsTenths;
 var timeLimitSecsHundredths;
 var timeLimitMins;
 var timerExecute;

 var secsTenthsZero = false;
 var secsHundredthsZero = false;
 var mins = false;

 var rainDensity = 0;
 var rainSpeed = 0;

 var umbrellaDensity = 0;
 var umbrellaSpeed = 0;
 var hit_umbrella;

 var cloudAmount;
 var cloudSpeed;
 var cloudSpacing;
 var cloudScreenEdge;

 var hit_counter = 0;

 var mute = false;

 if(level == 1) {
 	timeLimitSecsTenths = 0;
	timeLimitSecsHundredths = 0;
	timeLimitMins = 1;

	cloudAmount = 6;
	cloudSpeed = 2;
	cloudSpacing = 300;
	cloudScreenEdge = 480;
 }

 if(level == 2) {
 	timeLimitSecsTenths = 0;
	timeLimitSecsHundredths = 3;
	timeLimitMins = 1;

	cloudAmount = 6;
	cloudSpeed = 3;
	cloudSpacing = 300;
	cloudScreenEdge = 480;
 }

/**
 * Initialize the Game and start it.
 */
var gameover = false;
var game = new Game();

function init() {

	game.init();

	document.getElementById("mins").innerHTML = timeLimitMins + ':';
	document.getElementById("secsHundredths").innerHTML = timeLimitSecsHundredths;
	document.getElementById("secsTenths").innerHTML = timeLimitSecsTenths;
}

/*GAME TIMER*/
function myTimer() {

	/*SPEED UP RAIN SPEED WITH TIME*/
	/*if(timeLimitMins <= 1 && timeLimitSecsHundredths <= 2 && timeLimitSecsTenths <= 9) {
		rainSpeed = 10;
	}

	if(timeLimitMins <= 0 && timeLimitSecsHundredths <= 2 && timeLimitSecsTenths <= 9) {
		rainSpeed = 12;
	}*/

	if(timeLimitSecsTenths <= 0) {
		timeLimitSecsHundredths -= 1;
		timeLimitSecsTenths = 10;

		if(mins) {
			secsTenthsZero = true;
		}
	}

	if(timeLimitSecsHundredths < 0) {
		timeLimitMins -= 1;
		timeLimitSecsHundredths = 5;

		if(mins) {
			secsHundredthsZero = true;
		}
	}

	if(timeLimitMins <= 0) {
		timeLimitMins = 0;

		mins = true;
	}

	timeLimitSecsTenths -= 1;

	document.getElementById("mins").innerHTML = timeLimitMins + ':';
    document.getElementById("secsHundredths").innerHTML = timeLimitSecsHundredths;
    document.getElementById("secsTenths").innerHTML = timeLimitSecsTenths;

	if(secsTenthsZero && secsHundredthsZero && mins) {

 		game.character.alive = false;
 		gameover = true;
 		document.getElementById('win').style.display = "block";

 		hit_counter = 0;
 		imageRepository.character.src = "images/character_umbrella.png";
		imageRepository.character.height = 96;
		game.characterStartY = game.characterCanvas.height - imageRepository.character.height - 100;

 		clearInterval(timerExecute);

 		mins = false;
 		secsHundredthsZero = false;
 		secsTenthsZero = false;

 		document.getElementById("mins").innerHTML = '0' + ':';
		document.getElementById("secsHundredths").innerHTML = '0';
		document.getElementById("secsTenths").innerHTML = '0';

		game.backgroundAudio.pause();
		game.backgroundMusic.pause();

	}
}


/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var imageRepository = new function() {
	// Define images
	this.background = new Image();
	this.character = new Image();
	this.cloud = new Image();
	this.rain = new Image();
	this.umbrella = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 4;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.character.onload = function() {
		imageLoaded();
	}
	this.cloud.onload = function() {
		imageLoaded();
	}
	this.rain.onload = function() {
		imageLoaded();
	}
	this.umbrella.onload = function() {
		imageLoaded();
	}

	// Set images src
	this.character.src = "images/character_umbrella.png";
	this.cloud.src = "images/cloud.png";
	this.rain.src = "images/rain.png";
	this.umbrella.src = "images/umbrella.png";
}


/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions.
 */
function Drawable() {
	this.init = function(x, y, width, height) {
		// Defualt variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.collidableWith = "";
	this.isColliding = false;
	this.type = "";

	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
	this.move = function() {
	};
	this.isCollidableWith = function(object) {
		return (this.collidableWith === object.type);
	};
}


/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function Background() {
	this.speed = 0; // Redefine speed of the background for panning

	// Implement abstract function
	this.draw = function() {
		// Pan background
		this.y += this.speed;
		//this.context.clearRect(0,0, this.canvasWidth, this.canvasHeight);
		this.context.drawImage(imageRepository.background, this.x, this.y);

		// Draw another image at the top edge of the first image
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();


/**
 * Creates the Bullet object which the character fires. The bullets are
 * drawn on the "main" canvas.
 */
function Bullet(object) {
	this.alive = false; // Is true if the bullet is currently in use
	var self = object;
	/*
	 * Sets the bullet values
	 */
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	/*
	 * Uses a "dirty rectangle" to erase the bullet and moves it.
	 * Returns true if the bullet moved of the screen, indicating that
	 * the bullet is ready to be cleared by the pool, otherwise draws
	 * the bullet.
	 */
	this.draw = function() {
		this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
		this.y -= this.speed;

		if (this.isColliding) {
			return true;
		}
		else if (self === "rain" && this.y >= (this.canvasHeight - 100)) {
			return true;
		}
		else {
			if (self === "rain") {
				this.context.drawImage(imageRepository.rain, this.x, this.y);
			}

			return false;
		}
	};

	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Bullet.prototype = new Drawable();

function Umbrella_bullet(object) {
	this.alive = false; // Is true if the bullet is currently in use
	var self = object;
	/*
	 * Sets the bullet values
	 */
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	/*
	 * Uses a "dirty rectangle" to erase the bullet and moves it.
	 * Returns true if the bullet moved of the screen, indicating that
	 * the bullet is ready to be cleared by the pool, otherwise draws
	 * the bullet.
	 */
	this.draw = function() {
		this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
		this.y -= this.speed;

		this.context.drawImage(imageRepository.umbrella, this.x, this.y);

		if (this.isColliding) {
			console.log('umbrella collide');
			hit_umbrella = true;

			this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
			this.alive = false;
		}
		// else if (self === "umbrella" && this.y >= (this.canvasHeight - 100)) {
		// 	return true;
		// }
		if (self === "umbrella" && this.y >= (this.canvasHeight - 150)) {
			this.speed = 0;
		}
		// else {
		// 	if (self === "umbrella") {
				
		// 	}

		// 	return false;
		// }
	};

	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Umbrella_bullet.prototype = new Drawable();


/**
 * QuadTree object.
 *
 * The quadrant indexes are numbered as below:
 *     |
 *  1  |  0
 * ----+----
 *  2  |  3
 *     |
 */
function QuadTree(boundBox, lvl) {
	var maxObjects = 10;
	this.bounds = boundBox || {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	var objects = [];
	this.nodes = [];
	var level = lvl || 0;
	var maxLevels = 5;

	/*
	 * Clears the quadTree and all nodes of objects
	 */
	this.clear = function() {
		objects = [];

		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].clear();
		}

		this.nodes = [];
	};

	/*
	 * Get all objects in the quadTree
	 */
	this.getAllObjects = function(returnedObjects) {
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].getAllObjects(returnedObjects);
		}

		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}

		return returnedObjects;
	};

	/*
	 * Return all objects that the object could collide with
	 */
	this.findObjects = function(returnedObjects, obj) {
		if (typeof obj === "undefined") {
			console.log("UNDEFINED OBJECT");
			return;
		}

		var index = this.getIndex(obj);
		if (index != -1 && this.nodes.length) {
			this.nodes[index].findObjects(returnedObjects, obj);
		}

		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}

		return returnedObjects;
	};

	/*
	 * Insert the object into the quadTree. If the tree
	 * excedes the capacity, it will split and add all
	 * objects to their corresponding nodes.
	 */
	this.insert = function(obj) {
		if (typeof obj === "undefined") {
			return;
		}

		if (obj instanceof Array) {
			for (var i = 0, len = obj.length; i < len; i++) {
				this.insert(obj[i]);
			}

			return;
		}

		if (this.nodes.length) {
			var index = this.getIndex(obj);
			// Only add the object to a subnode if it can fit completely
			// within one
			if (index != -1) {
				this.nodes[index].insert(obj);

				return;
			}
		}

		objects.push(obj);

		// Prevent infinite splitting
		if (objects.length > maxObjects && level < maxLevels) {
			if (this.nodes[0] == null) {
				this.split();
			}

			var i = 0;
			while (i < objects.length) {

				var index = this.getIndex(objects[i]);
				if (index != -1) {
					this.nodes[index].insert((objects.splice(i,1))[0]);
				}
				else {
					i++;
				}
			}
		}
	};

	/*
	 * Determine which node the object belongs to. -1 means
	 * object cannot completely fit within a node and is part
	 * of the current node
	 */
	this.getIndex = function(obj) {

		var index = -1;
		var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
		var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

		// Object can fit completely within the top quadrant
		var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
		// Object can fit completely within the bottom quandrant
		var bottomQuadrant = (obj.y > horizontalMidpoint);

		// Object can fit completely within the left quadrants
		if (obj.x < verticalMidpoint &&
				obj.x + obj.width < verticalMidpoint) {
			if (topQuadrant) {
				index = 1;
			}
			else if (bottomQuadrant) {
				index = 2;
			}
		}
		// Object can fix completely within the right quandrants
		else if (obj.x > verticalMidpoint) {
			if (topQuadrant) {
				index = 0;
			}
			else if (bottomQuadrant) {
				index = 3;
			}
		}

		return index;
	};

	/*
	 * Splits the node into 4 subnodes
	 */
	this.split = function() {
		// Bitwise or [html5rocks]
		var subWidth = (this.bounds.width / 2) | 0;
		var subHeight = (this.bounds.height / 2) | 0;

		this.nodes[0] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[3] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
	};
}


/**
 * Custom Pool object. Holds Bullet objects to be managed to prevent
 * garbage collection.
 * The pool works as follows:
 * - When the pool is initialized, it popoulates an array with
 *   Bullet objects.
 * - When the pool needs to create a new object for use, it looks at
 *   the last item in the array and checks to see if it is currently
 *   in use or not. If it is in use, the pool is full. If it is
 *   not in use, the pool "spawns" the last item in the array and
 *   then pops it from the end and pushed it back onto the front of
 *   the array. This makes the pool have free objects on the back
 *   and used objects in the front.
 * - When the pool animates its objects, it checks to see if the
 *   object is in use (no need to draw unused objects) and if it is,
 *   draws it. If the draw() function returns true, the object is
 *   ready to be cleaned so it "clears" the object and uses the
 *   array function splice() to remove the item from the array and
 *   pushes it to the back.
 * Doing this makes creating/destroying objects in the pool
 * constant.
 */
function Pool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];

	this.getPool = function() {
		var obj = [];
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				obj.push(pool[i]);
			}
		}
		return obj;
	}

	/*
	 * Populates the pool array with the given object
	 */
	this.init = function(object) {
		if (object == "cloud") {
			for (var i = 0; i < size; i++) {
				var cloud = new Cloud();
				cloud.init(0,0, imageRepository.cloud.width,
									 imageRepository.cloud.height);
				pool[i] = cloud;
			}
		}
		else if (object == "rain") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("rain");
				bullet.init(0,0, imageRepository.rain.width,
										imageRepository.rain.height);
				bullet.collidableWith = "character";
				bullet.type = "rain";
				pool[i] = bullet;
			}
		}
		else if (object == "umbrella") {
			for (var i = 0; i < size; i++) {
				var umbrella_bullet = new Umbrella_bullet("umbrella");
				umbrella_bullet.init(0,0, imageRepository.umbrella.width,
										imageRepository.umbrella.height);
				umbrella_bullet.collidableWith = "character";
				umbrella_bullet.type = "umbrella";
				pool[i] = umbrella_bullet;
			}
		}
		//console.log(size);
	};

	/*
	 * Grabs the last item in the list and initializes it and
	 * pushes it to the front of the array.
	 */
	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};

	/*
	 * Used for the character to be able to get two bullets at once. If
	 * only the get() function is used twice, the character is able to
	 * fire and only have 1 bullet spawn instead of 2.
	 */
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].alive && !pool[size - 2].alive) {
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}
	};

	/*
	 * Draws any in use Bullets. If a bullet goes off the screen,
	 * clears it and pushes it to the front of the array.
	 */
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			// Only draw until we find a bullet that is not alive
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}


/**
 * Create the Character object that the player controls. The character is
 * drawn on the "character" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Character() {
	this.speed = 8;
	var fireRate = 15;
	var counter = 0;
	this.collidableWith = "rain";
	//console.log(this.collidableWith);
	this.type = "character";

	this.init = function(x, y, width, height) {
		// Default variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		//console.log(this.height);
		this.alive = true;
		this.isColliding = false;
	}

	this.draw = function() {

		if(hit_umbrella) {
			imageRepository.character.src = "images/character_umbrella.png";
			this.context.clearRect(this.x, this.y, this.width, this.height);
			imageRepository.character.height = 96;
			game.characterStartY = game.characterCanvas.height - imageRepository.character.height - 100;
			game.character.init(this.x, game.characterStartY,
		               imageRepository.character.width, imageRepository.character.height);
			hit_counter = 0;
			//hit_umbrella = false;

		}

		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.context.drawImage(imageRepository.character, this.x, this.y);
	};
	this.move = function() {
		counter++;
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right ||
				KEY_STATUS.down || KEY_STATUS.up) {
			// The character moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);

			// Update x and y according to the direction to move and
			// redraw the character. Change the else if's to if statements
			// to have diagonal movement.
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 0) // Kep player within the screen
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} 
			/*else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}*/
		}

		// Redraw the character

		if (!this.isColliding) {
			this.draw();
		}
		else {

			hit_counter += 1;
			
			console.log(hit_counter);

			if(hit_counter == 1) {

				imageRepository.character.src = "images/character_rain_coat.png";
				this.context.clearRect(this.x, this.y, this.width, this.height);
				imageRepository.character.height = 48;
				
				game.characterStartY = game.characterCanvas.height - imageRepository.character.height - 100;

				game.character.init(this.x, game.characterStartY,
			               imageRepository.character.width, imageRepository.character.height);

				this.isColliding = false;

				if(hit_umbrella) {
					hit_umbrella = false;
				}
				
			}

			if(hit_counter == 2) {

				imageRepository.character.src = "images/character.png";
				this.isColliding = false;

			}

			if(hit_counter == 3) {

				imageRepository.character.src = "images/character_umbrella.png";
				imageRepository.character.height = 96;
				game.characterStartY = game.characterCanvas.height - imageRepository.character.height - 100;

				hit_counter = 0;

				this.alive = false;
				game.gameOver();
				clearInterval(timerExecute);

			}

			// if(hit_counter == 3) {

			// 	imageRepository.character.src = "images/character_umbrella.png";
			// 	this.context.clearRect(this.x, this.y, this.width, this.height);
			// 	imageRepository.character.height = 96;
			// 	game.characterStartY = game.characterCanvas.height - imageRepository.character.height - 100;
			// 	game.character.init(this.x, game.characterStartY,
			//                imageRepository.character.width, imageRepository.character.height);

			// 	this.isColliding = false;
			// 	hit_counter = 0;

			// }


			// document.getElementById("mins").innerHTML = '2' + ':';
   //  		document.getElementById("secsHundredths").innerHTML = '0';
   //  		document.getElementById("secsTenths").innerHTML = '0';
		}	
	};

}
Character.prototype = new Drawable();
/**
 * Create the cloud character object.
 */
function Cloud() {
	//var rainDensity = .02;
	var chance = 0;
	this.alive = false;
	//this.collidableWith = "bullet";
	this.type = "cloud";

	/*
	 * Sets the cloud values
	 */
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = speed;
		this.alive = true;
		this.leftEdge = this.x - 90;
		this.rightEdge = this.x + 90;
		this.bottomEdge = this.y + 140;

		// if(this.y < -57 && this.y >= -142.5) {
		// 	this.speedX = this.speedX * -1;
		// }
		
	};

	/*
	 * Move the cloud
	 */
	this.draw = function() {
		this.context.clearRect(this.x-1, this.y, this.width+1, this.height);
		this.x += this.speedX;
		this.y += this.speedY;
		//console.log(this.y);
		if (this.x + (this.width * cloudAmount) <= this.leftEdge - 1000) {
			//this.speedX = this.speed;
			//this.x = this.rightEdge + (this.width * cloudAmount) + this.width;
			this.x = this.rightEdge;
			this.speedX = -this.speed;
			//rainDensity += .1;
		}
		else if ( (this.x - (this.width * cloudAmount) >= this.rightEdge + 1000) && (this.y <= -7.5) ) {
			//console.log(this.y);
			//this.x = this.leftEdge - (this.width * cloudAmount) + this.width;
			this.x = this.leftEdge;
			this.speedX = +this.speed;
			//console.log(this.x);
		}
		// else if (this.x >= this.rightEdge + this.width) {
		// 	//this.speedX = -this.speed;
		// }
		else if (this.y >= this.bottomEdge) {
			this.speed = cloudSpeed;
			this.speedY = 0;
			this.y -= 5;
			//this.speedX = -this.speed;

			if(this.y <= -7.5) {
				this.speedX = +this.speed;
			}
			else {
				this.speedX = -this.speed;
				//console.log(this.speedX);
			}
			//console.log(this.y);
			if(level == 1) {
				rainDensity = .03;
			}

			if(level == 2) {
				rainDensity = .04;
				umbrellaDensity = .04;
			}
			
		}

		if (!this.isColliding) {
			this.context.drawImage(imageRepository.cloud, this.x, this.y);

			// cloud has a chance to shoot every movement
			chance = Math.floor(Math.random()*101);
			if (chance/100 < rainDensity) {
				this.fire();
			}

			return false;
		}
		else {
			game.explosion.get();
			return true;
		}
	};

	/*
	 * Fires a bullet
	 */
	this.fire = function() {
		//game.rainPool.get(this.x+this.width/2,  this.y+this.height, -10);
		//game.rainPool.get(this.x+this.width/2,  this.y+this.height, -rainSpeed);

		/*RANDOM RAIN SPEED Math.floor(Math.random()*(max-min+1)+min);*/
		if(level == 1) {
			rainSpeed = Math.floor(Math.random()*(10 - 7 + 1) + 7);
		}

		if(level == 2) {
			rainSpeed = Math.floor(Math.random()*(11 - 8 + 1) + 8);
			//umbrellaSpeed = Math.floor(Math.random()*(11 - 8 + 1) + 8);
		}

		//console.log(rainSpeed);
		
		game.rainPool.get(this.x + (Math.random()*(this.width - 1 + 1) + 1),  this.y+this.height/2, -rainSpeed);
		//game.umbrellaPool.get(this.x + (Math.random()*(this.width - 1 + 1) + 1),  this.y+this.height/2, -umbrellaSpeed);
	};

	/*
	 * Resets the cloud values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Cloud.prototype = new Drawable();


 /**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {

	/*
	 * Gets canvas information and context and sets up all game
	 * objects.
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on browsers that do not support the canvas.
	 */
	this.init = function() {
		// Get the canvas elements
		this.bgCanvas = document.getElementById('background');
		this.characterCanvas = document.getElementById('character');
		this.mainCanvas = document.getElementById('main');

		// Test to see if canvas is supported. Only need to
		// check one canvas
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.characterContext = this.characterCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

			// Initialize objects to contain their context and canvas
			// information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Character.prototype.context = this.characterContext;
			Character.prototype.canvasWidth = this.characterCanvas.width;
			Character.prototype.canvasHeight = this.characterCanvas.height;

			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;

			Umbrella_bullet.prototype.context = this.mainContext;
			Umbrella_bullet.prototype.canvasWidth = this.mainCanvas.width;
			Umbrella_bullet.prototype.canvasHeight = this.mainCanvas.height;

			Cloud.prototype.context = this.mainContext;
			Cloud.prototype.canvasWidth = this.mainCanvas.width;
			Cloud.prototype.canvasHeight = this.mainCanvas.height;

			// Initialize the background object
			this.background = new Background();
			//this.background.init(0,0); // Set draw point to 0,0

			// Initialize the character object
			this.character = new Character();
			// Set the character to start near the bottom middle of the canvas
			this.characterStartX = this.characterCanvas.width/2 - imageRepository.character.width;
			this.characterStartY = this.characterCanvas.height - imageRepository.character.height - 100;
			this.character.init(this.characterStartX, this.characterStartY,
			               imageRepository.character.width, imageRepository.character.height);

			var touch_canvas = document.getElementById("ground"), boxleft, startx, dist = 0, touchobj = null;
			touch_canvas.addEventListener("touchstart", doTouchStart, false);
			touch_canvas.addEventListener("touchmove", doTouchMove, false);

			function doTouchStart(event) {
				//console.log('doTouchStart');

				touchobj = event.changedTouches[0] // reference first touch point
				boxleft = parseInt(game.character.x) // get left position of box
				//console.log(boxleft);
				startx = parseInt(touchobj.clientX) // get x coord of touch point


				event.preventDefault();

				//touch_canvas_x = game.character.x;
				//touch_canvas_y = event.targetTouches[0].pageY;
				//alert("X=" + touch_canvas_x + " Y=" + touch_canvas_y);

			}
			function doTouchMove(event) {

				//console.log('doTouchMove');

				touchobj = event.changedTouches[0]; // reference first touch point for this event
				var dist = parseInt(touchobj.clientX) - startx; // calculate dist traveled by touch point
				// move box according to starting pos plus dist
				// with lower limit 0 and upper limit 380 so it doesn't move outside track:

				game.character.context.clearRect(game.character.x, game.character.y, game.character.width, game.character.height);
				
				game.character.x = ( (boxleft + dist > 976)? 976 : (boxleft + dist < 0)? 0 : boxleft + dist );

				//console.log('game.character.x = ' + game.character.x);


				event.preventDefault();

			}

			// Initialize the cloud pool object
			//this.cloudPool = new Pool(9);
			this.cloudPool = new Pool(cloudAmount);
			this.cloudPool.init("cloud");
			this.spawnWave();

			this.rainPool = new Pool(50);
			this.rainPool.init("rain");

			this.umbrellaPool = new Pool(1);
			this.umbrellaPool.init("umbrella");

			// Start QuadTree
			this.quadTree = new QuadTree({x:0,y:0,width:this.mainCanvas.width,height:this.mainCanvas.height});

			// Audio files
			// this.laser = new SoundPool(10);
			// this.laser.init("laser");

			// this.explosion = new SoundPool(20);
			// this.explosion.init("explosion");

			this.backgroundAudio = new Audio("sounds/rain_background.wav");
			this.backgroundAudio.loop = true;
			this.backgroundAudio.volume = 1.00;
			this.backgroundAudio.load();

			this.backgroundMusic = new Audio("sounds/raisi_k_mario_hiphop.mp3");
			this.backgroundMusic.loop = true;
			this.backgroundMusic.volume = 1.00;
			this.backgroundMusic.load();

			// this.gameOverAudio = new Audio("sounds/game_over.wav");
			// this.gameOverAudio.loop = true;
			// this.gameOverAudio.volume = .25;
			//this.gameOverAudio.load();

			// this.checkAudio = window.setInterval(function(){checkReadyState()},1000);
			checkReadyState();

			if(level == 2) {
				umbrellaSpeed = Math.floor(Math.random()*(11 - 8 + 1) + 8);
			}

		//console.log(rainSpeed);
		
		game.umbrellaPool.get(600,  575, 0);
		}
	};

	// Spawn a new wave of enemies
	this.spawnWave = function() {
		var height = imageRepository.cloud.height;
		var width = 40;
		var x = 1200;
		var y = -height;
		var spacer = y * 1.5;
		for (var i = 1; i <= cloudAmount; i++) {
			this.cloudPool.get(x,y,2);
			// x += width + 80;
			x += width + cloudSpacing;
			if (i % 3 == 0) {
				x = -1000;
				y += spacer;
			}
		}
	}

	// if(cloud.y < -57 && cloud.y >= -142.5) {
	// 	this.speedX = this.speedX * -1;
	// }

	// Start the animation loop
	this.start = function() {
		this.character.draw();
		if(!mute) {
			this.backgroundAudio.play();
			this.backgroundMusic.play();
		}
		animate();
		timerExecute = setInterval(function(){myTimer()}, 1000);
	};

	// Restart the game
	this.restart = function() {
		rainDensity = 0;
		umbrellaDensity = 0;
		gameover = false;
		// this.gameOverAudio.pause();

		document.getElementById('game-over').style.display = "none";
		document.getElementById('win').style.display = "none";
		this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
		this.characterContext.clearRect(0, 0, this.characterCanvas.width, this.characterCanvas.height);
		this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

		this.quadTree.clear();

		//this.background.init(0,0);
		this.character.init(this.characterStartX, this.characterStartY,
		               imageRepository.character.width, imageRepository.character.height);

		this.cloudPool.init("cloud");
		this.spawnWave();
		this.rainPool.init("rain");
		this.umbrellaPool.init("umbrella");

		if(!mute) {
			this.backgroundAudio.currentTime = 0;
			this.backgroundAudio.play();

			this.backgroundMusic.currentTime = 0;
			this.backgroundMusic.play();
		}
		
		mins = false;
 		secsHundredthsZero = false;
 		secsTenthsZero = false;

 		if(level == 1) {
		 	timeLimitSecsTenths = 0;
			timeLimitSecsHundredths = 0;
			timeLimitMins = 1;
		 }

		 if(level == 2) {
		 	timeLimitSecsTenths = 0;
			timeLimitSecsHundredths = 3;
			timeLimitMins = 1;
		 }

		document.getElementById("mins").innerHTML = timeLimitMins + ':';
		document.getElementById("secsHundredths").innerHTML = timeLimitSecsHundredths;
		document.getElementById("secsTenths").innerHTML = timeLimitSecsTenths;
		//timerExecute = setInterval(function(){myTimer()}, 1000);
		if(level == 1) {
			rainSpeed = Math.floor(Math.random()*(10 - 7 + 1) + 7);	
		}
		
		if(level == 2) {
			rainSpeed = Math.floor(Math.random()*(11 - 8 + 1) + 8);	
			umbrellaSpeed = Math.floor(Math.random()*(11 - 8 + 1) + 8);
		}

		this.start();
	};

	// Game over
	this.gameOver = function() {
		gameover = true;
		this.backgroundAudio.pause();
		this.backgroundMusic.pause();
		//this.gameOverAudio.currentTime = 0;
		//this.gameOverAudio.play();
		document.getElementById('game-over').style.display = "block";
	};
}

$(document).keydown(function(key) {
	switch(parseInt(key.which)) {
		case 13:
		case 32:
			if(gameover) {
				game.restart();	
			}
			break;
		defaultkey: "value"
			break;
	}
});

/**
 * Ensure the game sound has loaded before starting the game
 */
function checkReadyState() {
	//if (game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4) {
		//window.clearInterval(game.checkAudio);
		document.getElementById('loading').style.display = "none";
		game.start();
	//}
}


/**
 * A sound pool to use for the sound effects
 */
function SoundPool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];
	this.pool = pool;
	var currSound = 0;

	/*
	 * Populates the pool array with the given object
	 */
	this.init = function(object) {
		// if (object == "laser") {
		// 	for (var i = 0; i < size; i++) {
		// 		// Initalize the object
		// 		laser = new Audio("sounds/laser.wav");
		// 		laser.volume = .12;
		// 		laser.load();
		// 		pool[i] = laser;
		// 	}
		// }
		// else if (object == "explosion") {
		// 	for (var i = 0; i < size; i++) {
		// 		var explosion = new Audio("sounds/explosion.wav");
		// 		explosion.volume = .1;
		// 		explosion.load();
		// 		pool[i] = explosion;
		// 	}
		// }
	};

	/*
	 * Plays a sound
	 */
	this.get = function() {
		if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
			pool[currSound].play();
		}
		currSound = (currSound + 1) % size;
	};
}


/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {

	// Insert objects into quadtree
	game.quadTree.clear();
	game.quadTree.insert(game.character);
	game.quadTree.insert(game.cloudPool.getPool());
	game.quadTree.insert(game.rainPool.getPool());
	game.quadTree.insert(game.umbrellaPool.getPool());

	detectCollision();

	// No more enemies
	if (game.cloudPool.getPool().length === 0) {
		game.spawnWave();
	}

	// Animate game objects
	if (game.character.alive) {
		requestAnimFrame( animate );

		game.background.draw();
		game.character.move();
		
		game.rainPool.animate();
		game.umbrellaPool.animate();
		game.cloudPool.animate();
	}
}

function detectCollision() {
	var objects = [];
	game.quadTree.getAllObjects(objects);

	for (var x = 0, len = objects.length; x < len; x++) {
		game.quadTree.findObjects(obj = [], objects[x]);

		for (y = 0, length = obj.length; y < length; y++) {

			// DETECT COLLISION ALGORITHM
			if (objects[x].collidableWith === obj[y].type &&
				(objects[x].x < obj[y].x + obj[y].width &&
			     objects[x].x + objects[x].width > obj[y].x &&
				 objects[x].y < obj[y].y + obj[y].height &&
				 objects[x].y + objects[x].height > obj[y].y)) {
				objects[x].isColliding = true;
				obj[y].isColliding = true;
			}
		}
	}
};


// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  65: 'left',
  38: 'up',
  39: 'right',
  68: 'right',
  40: 'down',
  13: 'enter',
}

// Creates the array to hold the KEY_CODES and sets all their values
// to true. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
	// Firefox and opera use charCode instead of keyCode to
	// return which key was pressed.
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
		e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}


/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

$(document).ready(function() {

	if(level == 1) {
		$('#background').css('background-image', 'url("images/city_bg.png")');
	}

	if(level == 2) {
		$('#background').css('background-image', 'url("images/city_bg_2.png")');
	}

	$('#sound_on').click(function() {
		$(this).hide();
		$('#sound_off').show();
		game.backgroundAudio.pause();
		game.backgroundMusic.pause();
		mute = true;
	});

	$('#sound_off').click(function() {
		$(this).hide();
		$('#sound_on').show();
		game.backgroundAudio.play();
		game.backgroundMusic.play();
		mute = false;
	});

});