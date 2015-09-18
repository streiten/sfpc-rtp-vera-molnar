var segments = 5;

var frameHeight = 512;
var frameWidth = 512;

var inOutClickCount = 0;
var inOutCords = { 	'in' : [0,0],
					'out': [0,0]	
				};


function setup() {
 
	createCanvas(windowWidth,windowHeight);
	drawCenteredFrame(512,512);
	setupBand();

}

function setupBand () {

	stroke(unhex(['5A','23','36']));
	strokeWeight(40);
	strokeJoin(BEVEL);
	strokeCap(SQUARE);

}

function draw() {
	//console.log(inOutCords['in'][0]);
	//console.log(inOutCords['in'][1]);
}

function mouseReleased() {

	switch(inOutClickCount) {
		case 0: 
			inOutCords['in'] = [ mouseX,mouseY ];
			inOutClickCount++;
			break;

		case 1:
			inOutCords['out'] = [ mouseX,mouseY ];
			console.log(inOutCords['out']);
			drawBand();
			inOutClickCount++;
			break;
		default: 
	}
}



function drawCenteredFrame() {
  
	var posY = windowHeight/2 - frameHeight/2;
	var posX = windowWidth/2 -  frameWidth/2;
	
	rect(posX,posY,frameWidth,frameHeight);

}


function createCords( x , y ) {
	
	var newCords = Array();

	newCords['x'] = x + windowWidth/2 -  frameHeight/2;
	newCords['y'] = y + windowHeight/2 -  frameWidth/2;
	
	return newCords; 

}


function drawBand (){

	var vertices = new Array(segments);
	generateVertices(vertices);
	
	beginShape(LINES);

	var last = {};	
	last['x'] = inOutCords['in'][0] ;
	last['y'] = inOutCords['in'][1] ;

	for (var i = vertices.length - 1; i >= 0; i--) {

		vertex(last['x'],last['y']);
		offsetCords = createCords(vertices[i]['x'],vertices[i]['y']);
		
		x = offsetCords['x'];
		y = offsetCords['y'];

		last['x'] = x ;
		last['y'] = y ;

		vertex(x,y);
	
	};

	vertex(x,y);
	vertex(inOutCords['out'][0],inOutCords['out'][1]);

	endShape();

}

function generateVertices ( vertices ) {
	
	for (var i = segments - 1; i >= 0; i--) {
		vertices[i] = [];
		vertices[i]['x'] = random(frameHeight);
		vertices[i]['y'] = random(frameWidth);
	};
}


