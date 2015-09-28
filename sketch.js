/*
This script generates a garphic similiar to a series 'Boucle Rouge' by Vera Molnar
that can be found here: http://www.veramolnar.com/diapo.php?y=2001

The following assumptions were made: 
- each drawing contains a loop
- the band starts on a random side and follows an overall dircetion
- 

*/


function setup() {
	
	primaryColor = unhex(['5A','23','36']);
 	
 	bandWidth = 35;

 	// range defines max distance between vertices 
 	range = bandWidth * 3;

 	canvasWidth = windowWidth;
 	canvasHeight = windowHeight;

 	canvasWidth = 640;
 	canvasHeight = 640;

	createCanvas(canvasWidth,canvasHeight);

	setupBand();
	drawBand();

}


function draw() {

}

function mouseClicked() {
	clear();
	drawBand();
}

function setupBand () {
	stroke(primaryColor);
	strokeWeight(bandWidth);
	strokeJoin(BEVEL);
	strokeCap(PROJECT);
}

function drawBand (){

	var vertices = [];
	generateVertices(vertices);

	beginShape();
		for (var i = 0; i < vertices.length ; i++) {
			vertex(vertices[i].x, vertices[i].y);
		}
	endShape();
}


function generateVertices ( vertices ) {

	// generate possible starting positions
	inout = [	{ 'x': random(canvasWidth * 0.4 , canvasWidth * 0.6 ), 'y' : 0 , 'dir':'down' },
				{ 'x': canvasWidth, 'y' : random(canvasHeight * 0.4 ,canvasHeight * 0.6 ), 'dir':'left' },
				{ 'x': random(canvasWidth * 0.4 , canvasWidth * 0.6 ), 'y' : canvasHeight , 'dir':'up'}, 
				{ 'x': 0, 'y' : random(canvasHeight * 0.4 ,canvasHeight * 0.6 ),'dir':'right' } 
	];

	// randomly pick start side and position
	rand = getRandomIntInclusive(0,3);
	entry = inout[rand];
	
	// setting the start
	vertices[0] = entry;

 	/* 	divide the window height and width in 3 segments
		and calculate how many range-segements fit in.
		as range is a max value lets double this
	*/

	// we are going horizontal overall
	if(entry.dir == 'left' || entry.dir == 'right' ) {
		stepsInSegment = canvasWidth / 3 / range * 3 ;
	} else {
		stepsInSegment = canvasHeight / 3 / range * 3 ;
	}

 	console.log(stepsInSegment);

	// generate first bunch
	generateVerticeSegment(stepsInSegment, entry.dir, vertices );

	// figure out the sequence of directions in order to get a loop
	loopDirs = loopDirections(entry.dir);
	
	// generate the vertices for the loop
	for (var i = 0 ; i <= loopDirs.length - 1; i++) {
		generateVerticeSegment(3, loopDirs[i], vertices );
	};

	// and generate more then enought to exit the canvas
	generateVerticeSegment(100, entry.dir, vertices );

}

function generateVerticeSegment( num , direction, vertices ) {

	ranges = molnarRanges(direction);
	end = vertices.length + num;

	for (var i = vertices.length ; i < end ; i++) {
		vertices[i] = { 'x' : vertices[i-1]['x'] + random(ranges.minRangeX,ranges.maxRangeX),
						'y' : vertices[i-1]['y'] + random(ranges.minRangeY,ranges.maxRangeY) 
					};
	}
}


// generate a sequence of directions that make a loop
function loopDirections( current )
{

	dirs = ['up','down','left','right'];
	currentIndex = dirs.indexOf(current);

	loopDirs = [];
	// in order to make it a loop we want something direction of the other dimenstion 
	rand = getRandomIntInclusive(0,1);

	// current direction is vertical 
	if ( currentIndex < 2 ) {
		// so next something horizontal
		loopDirs.push(dirs[rand+2]);
		//remember the other one for last 
		other = dirs[+(!rand)+2];
		
		// after the horizontal we go with the other vertical
		loopDirs.push(dirs[+(!currentIndex)]);
		
		// and the remaining horizontal
		loopDirs.push(other);

	// current direction is horizontal
	} else {
		loopDirs.push(dirs[rand]);
		other = dirs[+(!rand)];
		loopDirs.push(dirs[+(!(currentIndex-2))+2]);
		loopDirs.push(other);
	}
	
	return loopDirs;
}



function molnarRanges (direction) {

		switch(direction) {
		
		case 'down':
			/*
				going down
				y not neg
			*/
			json = {
				'minRangeX' : -range,
				'minRangeY' : 0,
				'maxRangeX' : range,
				'maxRangeY' : range 
			};

		break;

		case 'up':
			/* 
				going top
				y not pos
			*/
			json = {
				'minRangeX' : -range ,
				'minRangeY' : -range ,
				'maxRangeX' : range ,
				'maxRangeY' : 0 
			};

		break;

		case 'right':
			/*
				going right
				x not neg
			*/
			json = {
				'minRangeX' : 0 ,
				'minRangeY' : -range ,
				'maxRangeX' : range ,
				'maxRangeY' : range 
			};

		break;

		case 'left':
			/*
				going left 
				x not pos
			*/
			json = {
				'minRangeX' : -range ,
				'minRangeY' : -range ,
				'maxRangeX' : 0 ,
				'maxRangeY' : range 
			};

		break;

		default:

	}

	return json; 

}

// randomly choose a new direction other than current
function newDirection ( current , inout ) {
	
	newDir = current;
	while ( current == newDir) {
		newDir = inout[getRandomIntInclusive(0,3)].dir;
	}
	return newDir;
}


/**
 *
 * Helper & Debug Functions
 *
 */


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dPoint (x,y) {
	stroke('red');
	strokeWeight(1);
	point(x,y);
	stroke(primaryColor);
	strokeWeight(bandWidth);
}

function dLine(vertices) {
	stroke('red');
	strokeWeight(1);
	line(vertices[0].x ,vertices[0].y,vertices[vertices.length-1].x ,vertices[vertices.length-1].y);
	
	strokeWeight(10);

	stroke('green');
	point(vertices[0].x ,vertices[0].y);
	stroke('red');
	point(vertices[vertices.length-1].x ,vertices[vertices.length-1].y);

	stroke(primaryColor);
	strokeWeight(bandWidth);
}

function dLog( s ) {
	fill('red');
	strokeWeight(0);
	text(s, 10,20);
	strokeWeight(bandWidth);
	fill('transparent')
}
