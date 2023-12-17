"use strict"
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function detectCollisionCubes(object1, object2){
  object1.geometry.computeBoundingBox();
  object2.geometry.computeBoundingBox();
  object1.updateMatrixWorld();
  object2.updateMatrixWorld();
  let box1 = object1.geometry.boundingBox.clone();
  box1.applyMatrix4(object1.matrixWorld);
  let box2 = object2.geometry.boundingBox.clone();
  box2.applyMatrix4(object2.matrixWorld);
  
  return box1.intersectsBox(box2);
}

function distanceBetweenObjs(object1, object2){
  var vec1 = new THREE.Vector2(object1.position.x, object1.position.y)
  var vec2 = new THREE.Vector2(object2.position.x, object2.position.y)
  
  return vec1.distanceTo( vec2 );
}

function distanceBetweenObjs2(object1, object2){
  var vec1 = new THREE.Vector2(object1.getWorldPosition(new THREE.Vector3()).x, object1.getWorldPosition(new THREE.Vector3()).y)
  var vec2 = new THREE.Vector2(object2.position.x, object2.position.y)
  
  return vec1.distanceTo( vec2 );
}

function moveAB(a,b,speed) {
  let point1 = new THREE.Vector2(a.position.x, a.position.y);
  let point2 = new THREE.Vector2(b.getWorldPosition(new THREE.Vector3()).x, b.getWorldPosition(new THREE.Vector3()).y);
  let vx = point1.x - point2.x;
  let vy = point1.y - point2.y;
  let d = Math.sqrt(vx*vx+vy*vy);
  vx = vx/d;
  vy = vy/d;
  d = Math.min(d+0.00001,speed+0.00001);
  a.position.x = a.position.x - vx*d;
  a.position.y = a.position.y - vy*d;
}

function moveAB2(a,i,posX,posY,speed) {
  let point1 = new THREE.Vector2(a.position.x, a.position.y);
  let point2 = new THREE.Vector2(a.firstPosX+i +posX, a.firstPosY + posY);
  let vx = point1.x - point2.x;
  let vy = point1.y - point2.y;
  let d = Math.sqrt(vx*vx+vy*vy);
  vx = vx/d;
  vy = vy/d;
  d = Math.min(d+0.00001,speed+0.00001);
  a.position.x = a.position.x - vx*d;
  a.position.y = a.position.y - vy*d;
}


function dist1(x, y, x1, y1, x2, y2) {
  var A = x - x1;
  var B = y - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

//////////////////////////////////////////////////////////////////////////////

let DD = 'block';
let GK = 'GK';
let LB = 'LB';
let LCB = 'LCB';
let CB = 'CB';
let RCB = 'RCB';
let RB = 'RB';

let LDM = 'LDM';
let DM = 'DM';
let RDM = 'RDM';

let LM = 'LM';
let LCM = 'LCM';
let CM = 'CM';
let RCM = 'RCM';
let RM = 'RM';

let LAM = 'LAM';
let AM = 'AM';
let RAM = 'RAM';

let LW = 'LW';
let RW = 'RW';

let LF = 'LF';
let CF = 'CF';
let RF = 'RF';

let fieldPosMas = [
  [ DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD],
  [ DD,  0,  0, LB,  0, LM, LW,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,LCB,LDM,LCM,LAM, LF,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD, GK,  0, CB, DM, CM, AM, CF,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,RCB,RDM,RCM,RAM, RF,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0, RB,  0, RM, RW,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD]
]

let fieldPosMas2 = [
  [ DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0, RW, RM,  0, RB,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0, RF,RAM,RCM,RDM,RCB,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0, CF, AM, CM, DM, CB,  0, GK, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0, LF,LAM,LCM,LDM,LCB,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, DD],
  [ DD,  0,  0,  0,  0,  0,  0,  0,  0, LW, LM,  0, LB,  0,  0, DD],
  [ DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD, DD]
]

let fieldWidth = 1000;
let fieldHeight = 629;
let fieldBlockWidth = fieldWidth / fieldPosMas[0].length;
let fieldBlockHeight = fieldHeight / fieldPosMas.length;


let playerPlane = {
  GK : {
    obj: {},
    player: {},
    speed: 0.7,
    attack: 30,
    defense: -30,
    color: new THREE.Color( 0xffffff ),
    deff: 70,
    att: 70
  },
  LB : {
    obj: {},
    player: {},
    speed: 0.85,
    attack: 300,
    defense: -100,
    color: new THREE.Color( 0xff0000 ),
    deff: 70,
    att: 70
  },
  LCB : {
    obj: {},
    player: {},
    speed: 0.73,
    attack: 30,
    defense: -10,
    color: new THREE.Color( 0xff0000 ),
    deff: 70,
    att: 70
  },
  CB : {
    obj: {},
    player: {},
    speed: 0.75,
    attack: 100,
    defense: -100,
    color: new THREE.Color( 0xff0000 ),
    deff: 70,
    att: 70
  },
  RCB : {
    obj: {},
    player: {},
    speed: 0.71,
    attack: 100,
    defense: -100,
    color: new THREE.Color( 0xff0000 ),
    deff: 70,
    att: 70
  },
  RB : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0xff0000 ),
    deff: 70,
    att: 70
  },
///////////////
  LDM : {
    obj: {},
    player: {},
    speed: 0.85,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x000088 ),
    deff: 70,
    att: 70
  },
  DM : {
    obj: {},
    player: {},
    speed: 0.86,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x000088 ),
    deff: 70,
    att: 70
  },
  RDM : {
    obj: {},
    player: {},
    speed: 0.84,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x000088 ),
    deff: 70,
    att: 70
  },
////////////////
  LM : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 350,
    defense: -250,
    color: new THREE.Color( 0x0000ff ),
    deff: 70,
    att: 70
  },
  LCM : {
    obj: {},
    player: {},
    speed: 0.8,
    attack: 350,
    defense: -250,
    color: new THREE.Color( 0x0000ff ),
    deff: 70,
    att: 70
  },
  CM : {
    obj: {},
    player: {},
    speed: 0.81,
    attack: 350,
    defense: -250,
    color: new THREE.Color( 0x0000ff ),
    deff: 70,
    att: 70
  },
  RCM : {
    obj: {},
    player: {},
    speed: 0.83,
    attack: 350,
    defense: -250,
    color: new THREE.Color( 0x0000ff ),
    deff: 70,
    att: 70
  },
  RM : {
    obj: {},
    player: {},
    speed: 0.92,
    attack: 350,
    defense: -250,
    color: new THREE.Color( 0x0000ff ),
    deff: 70,
    att: 70
  },
////////////
  LAM : {
    obj: {},
    player: {},
    speed: 0.75,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x009999 ),
    deff: 70,
    att: 70
  },
  AM : {
    obj: {},
    player: {},
    speed: 0.86,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x009999 ),
    deff: 70,
    att: 70
  },
  RAM : {
    obj: {},
    player: {},
    speed: 0.79,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x009999 ),
    deff: 70,
    att: 70
  },
///////////
  LW : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x009999 ),
    deff: 70,
    att: 70
  },
  RW : {
    obj: {},
    player: {},
    speed: 0.93,
    attack: 350,
    defense: -100,
    color: new THREE.Color( 0x009999 ),
    deff: 70,
    att: 70
  },
//////////////
  LF : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 400,
    defense: -100,
    color: new THREE.Color( 0x00ff00 ),
    deff: 70,
    att: 70
  },
  CF : {
    obj: {},
    player: {},
    speed: 0.85,
    attack: 400,
    defense: -100,
    color: new THREE.Color( 0x00ff00 ),
    deff: 70,
    att: 70
  },
  RF : {
    obj: {},
    player: {},
    speed: 0.98,
    attack: 400,
    defense: -100,
    color: new THREE.Color( 0x00ff00 ),
    deff: 70,
    att: 70
  }
}
playerPlane.prop = {
  color: new THREE.Color( 0x0000ff )
};

let playerPlane2 = {
  GK : {
    obj: {},
    player: {},
    speed: 0.7,
    attack: 20,
    defense: -20,
    color: new THREE.Color( 0xffffff ),
    deff: 60,
    att: 60
  },
  LB : {
    obj: {},
    player: {},
    speed: 0.85,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0xff0000 ),
    deff: 60,
    att: 60
  },
  LCB : {
    obj: {},
    player: {},
    speed: 0.73,
    attack: 10,
    defense: -50,
    color: new THREE.Color( 0xff0000 ),
    deff: 60,
    att: 60
  },
  CB : {
    obj: {},
    player: {},
    speed: 0.75,
    attack: 50,
    defense: -50,
    color: new THREE.Color( 0xff0000 ),
    deff: 60,
    att: 60
  },
  RCB : {
    obj: {},
    player: {},
    speed: 0.71,
    attack: 50,
    defense: -50,
    color: new THREE.Color( 0xff0000 ),
    deff: 60,
    att: 60
  },
  RB : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0xff0000 ),
    deff: 60,
    att: 60
  },
///////////////
  LDM : {
    obj: {},
    player: {},
    speed: 0.85,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x000088 ),
    deff: 60,
    att: 60
  },
  DM : {
    obj: {},
    player: {},
    speed: 0.86,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x000088 ),
    deff: 60,
    att: 60
  },
  RDM : {
    obj: {},
    player: {},
    speed: 0.84,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x000088 ),
    deff: 60,
    att: 60
  },
////////////////
  LM : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 250,
    defense: -150,
    color: new THREE.Color( 0x0000ff ),
    deff: 60,
    att: 60
  },
  LCM : {
    obj: {},
    player: {},
    speed: 0.8,
    attack: 250,
    defense: -150,
    color: new THREE.Color( 0x0000ff ),
    deff: 60,
    att: 60
  },
  CM : {
    obj: {},
    player: {},
    speed: 0.81,
    attack: 250,
    defense: -150,
    color: new THREE.Color( 0x0000ff ),
    deff: 60,
    att: 60
  },
  RCM : {
    obj: {},
    player: {},
    speed: 0.83,
    attack: 250,
    defense: -150,
    color: new THREE.Color( 0x0000ff ),
    deff: 60,
    att: 60
  },
  RM : {
    obj: {},
    player: {},
    speed: 0.92,
    attack: 250,
    defense: -250,
    color: new THREE.Color( 0x0000ff ),
    deff: 60,
    att: 60
  },
////////////
  LAM : {
    obj: {},
    player: {},
    speed: 0.75,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x009999 ),
    deff: 60,
    att: 60
  },
  AM : {
    obj: {},
    player: {},
    speed: 0.86,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x009999 ),
    deff: 60,
    att: 60
  },
  RAM : {
    obj: {},
    player: {},
    speed: 0.79,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x009999 ),
    deff: 60,
    att: 60
  },
///////////
  LW : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x009999 ),
    deff: 60,
    att: 60
  },
  RW : {
    obj: {},
    player: {},
    speed: 0.93,
    attack: 250,
    defense: -50,
    color: new THREE.Color( 0x009999 ),
    deff: 60,
    att: 60
  },
//////////////
  LF : {
    obj: {},
    player: {},
    speed: 0.91,
    attack: 300,
    defense: -50,
    color: new THREE.Color( 0x00ff00 ),
    deff: 60,
    att: 60
  },
  CF : {
    obj: {},
    player: {},
    speed: 0.85,
    attack: 300,
    defense: -50,
    color: new THREE.Color( 0x00ff00 ),
    deff: 60,
    att: 60
  },
  RF : {
    obj: {},
    player: {},
    speed: 0.98,
    attack: 300,
    defense: -50,
    color: new THREE.Color( 0x00ff00 ),
    deff: 60,
    att: 60
  }
}
playerPlane2.prop = {
  color: new THREE.Color( 0xff0000 )
};


let camera, scene, renderer, mesh, mesh2, mesh3, controls;

let players = {
  player1: {
    player1: 0,
    home: 1,
    teamAttack: 0,
    teamDefense: 0,
    teamWidthBall: 0
  },
  player2: {
    player2: 0,
    home2: 0,
    teamAttack: 1,
    teamDefense: 0,
    teamWidthBall: 0
  },
};

let temp1 = 0;

let gate;
let gateWidth = 82;  //ширина ворот
let gateHeight = 50;  //высота ворот
let block;
let masBlocks;

let goal = 0;

let keyPass = 0;
let keyShoot = 0;
let keyLongpass = 0;
let keyDirectpass = 0;
let keyRun = 0;

let playerBase;

let secPlayer1;

let masPlayers = [];
let masPlayers2 = [];

let masAllPlayers = [];
let masAllPlayers2 = [];

//let masDistances = [];
//let masDistancesPass = [];

let fieldPassSpeed = 0;

let ball;

let keyboard = new THREEx.KeyboardState();
//let stats;
let clock = new THREE.Clock();

let targetPass;
let currentPassSpeedAll = 1.7;
let currentPassSpeed = 1.7;
let passing1 = 2;
let passDistance = 0;

let longpassDistance = 0;

let targetDirectpass;
let currentDirectpassSpeedAll = 3.4;
let currentDirectpassSpeed = 3.4;
let directpassing1 = 2;
let directpassDistance = 0;

let targetShoot;
let currentShootSpeedAll = 3.4;
let currentShootSpeed = 3.4;
let shooting1 = 2;
let shootDistance = 0;
let shootMove = 0;
let shootMoveUp = 0;

let activeRun = 0;

let battle1 = 0;
let battle2 = 0;

///////
var frameRate = 1 / 60; // Seconds
var frameDelay = frameRate * 1000; // ms

var Cd = 5.47; // Dimensionless  0.47
var rho = 1.22; // kg / m^3  1.22
var A;
var ag = 7.81; // m / s^2  9.81
///////


let fieldTexture = new THREE.TextureLoader().load( "https://i.postimg.cc/Bnyjrb9J/field.jpg" )
let ballTexture = new THREE.TextureLoader().load( "https://i.postimg.cc/Zq8Vn1Lv/ball.jpg" )
//ballTexture.wrapS = THREE.RepeatWrapping;
//ballTexture.wrapT = THREE.RepeatWrapping;
ballTexture.repeat.set( 0.55, 0.55 );



init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set(0,-350,420);
  camera.lookAt(0,0,0);
  scene = new THREE.Scene
  let ambient = new THREE.AmbientLight( 0xffffff, 0.3 );
  scene.add( ambient )
  let light = new THREE.PointLight(0xffffff, 0.7, 500);
  light.position.set(10,10,200);
  light.castShadow = true;
  scene.add( light );
  
  /*controls = new THREE.OrbitControls( camera );
  controls.enableKeys = false;
  controls.update();*/
  
  let geometryPlane = new THREE.PlaneGeometry(5000,5000);
  let materialPlane = new THREE.MeshPhongMaterial({ color: 0xcccccc })
  let plane = new THREE.Mesh ( geometryPlane, materialPlane );
  scene.add( plane )
  
  let geometryfootballField = new THREE.PlaneGeometry(fieldWidth,fieldHeight);
  let materialfootballField = new THREE.MeshPhongMaterial({ color: 0xffffff, map: fieldTexture })
  let footballField = new THREE.Mesh ( geometryfootballField, materialfootballField );
  footballField.position.z = 0.2;
  footballField.receiveShadow = true;
  scene.add( footballField )
  
  block = new THREE.Group();
  
  var geometry = new THREE.BoxGeometry(fieldWidth,10,40);
  var material = new THREE.MeshPhongMaterial({ color: 0x000000 });
  var block1 = new THREE.Mesh(geometry, material);
  block1.position.y = fieldHeight/2;
  var block2 = new THREE.Mesh(geometry, material);
  block2.position.y = -fieldHeight/2;
  var geometry2 = new THREE.BoxGeometry(10,fieldHeight,40);
  var block3 = new THREE.Mesh(geometry2, material);
  block3.position.x = -fieldWidth/2;
  var block4 = new THREE.Mesh(geometry2, material);
  block4.position.x = fieldWidth/2;
  
  block.add( block1 );
  block.add( block2 );
  block.add( block3 );
  block.add( block4 );
  scene.add( block );
  
  gate = new THREE.Group();
  var geometry = new THREE.BoxGeometry(2,gateWidth,gateHeight);
  var material = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent:true, opacity: 0.3 });
  var gate1 = new THREE.Mesh(geometry, material);
  
  var material = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent:true, opacity: 0 });
  var gate0 = new THREE.Mesh(geometry, material);
  gate0.position.x = -22;
  
  var geometry = new THREE.BoxGeometry(5,5,5);
  var material = new THREE.MeshPhongMaterial({ color: 0xff00ff, transparent:true, opacity: 1 });
  var gateShoot = new THREE.Mesh(geometry, material);
  gateShoot.position.x = 0;
  
  var geometry = new THREE.BoxGeometry(25,2,50);
  var material = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent:true, opacity: 0.3 });
  var gate2 = new THREE.Mesh(geometry, material);
  gate2.position.x = -12;
  gate2.position.y = gateWidth/2;
  
  var gate3 = new THREE.Mesh(geometry, material);
  gate3.position.x = -12;
  gate3.position.y = -gateWidth/2;
  
  gate.add( gate0 );
  gate.add( gateShoot );
  gate.add( gate1 );
  gate.add( gate2 );
  gate.add( gate3 );
  gate.gateLine = gate0;
  gate.top = gate2;
  gate.bottom = gate3;
  gate.gateShoot = gateShoot;
  gate.position.x = fieldWidth/2-30;
  scene.add( gate );
  
  //////////////////////////////////////////////////////////////////////////////////
  
  function addPosFields(mas, posName, plane) {
    for (var i = 0; i < mas.length; i++) {
      for (var j = 0; j < mas[i].length; j++) {
        if (mas[i][j] == posName) {
          var geometryPosPlane = new THREE.PlaneGeometry(100,100);
          var materialPosPlane = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
          plane[posName].obj = new THREE.Mesh ( geometryPosPlane, materialPosPlane );
          plane[posName].obj.position.z = 0.4;
          plane[posName].obj.position.x = -fieldWidth/2 + (j * fieldBlockWidth + fieldBlockWidth/2);
          plane[posName].obj.position.y = fieldHeight/2 - (i * fieldBlockHeight + fieldBlockHeight/2);
          plane[posName].obj.material.color.set(plane[posName].color);
          scene.add( plane[posName].obj );
        }
      }
    }
  }
 
  function addPlayers(player, pos, mas, masAll) {
    player[pos].player = new THREE.Group();
    var geometry = new THREE.BoxGeometry(5,5,10);
    var material = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    var body = new THREE.Mesh( geometry, material );
    body.material.color.set(player.prop.color)
    body.position.z = 5;
    body.castShadow = true;

    var movePoint = new THREE.Group();
      var geometry = new THREE.BoxGeometry(1,1,1);
      var material = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0 })
      var movePoint1 = new THREE.Mesh( geometry, material );
      movePoint1.position.z = 2.5;
      movePoint1.castShadow = true;
      movePoint1.position.x = 15.6;

      var geometry = new THREE.BoxGeometry(1,1,1);
      var material = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0 })
      var movePoint2 = new THREE.Mesh( geometry, material );
      movePoint2.position.z = 2.5;
      movePoint2.castShadow = true;
      movePoint2.position.x = -15.6;
    movePoint.add(movePoint1);
    movePoint.add(movePoint2);
    movePoint.up = movePoint1;

    var ballPoint = new THREE.Group();
      var geometry = new THREE.BoxGeometry(3,3,3);
      var material = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true, opacity: 0})
      var ballPoint1 = new THREE.Mesh( geometry, material );
      ballPoint1.position.z = 2.5;
      ballPoint1.passDistance = 80;
      ballPoint1.position.x = ballPoint1.passDistance;
      var geometry = new THREE.BoxGeometry(3,3,3);
      var material = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true, opacity: 0 })
      var ballPoint2 = new THREE.Mesh( geometry, material );
      ballPoint2.position.z = 2.5;
      ballPoint2.position.x = -ballPoint1.passDistance;
   ballPoint.add(ballPoint1);
   ballPoint.add(ballPoint2);
   ballPoint.up = ballPoint1;
  
   var shootPoint = new THREE.Group();
      var geometry = new THREE.BoxGeometry(3,3,3);
      var material = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0})
      var shootPoint1 = new THREE.Mesh( geometry, material );
      shootPoint1.position.z = 2.5;
      shootPoint1.shootDistance = 150;
      shootPoint1.position.x = shootPoint1.shootDistance;
      //shootPoint1.position.y = 0;
      var geometry = new THREE.BoxGeometry(3,3,3);
      var material = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true, opacity: 0 })
      var shootPoint2 = new THREE.Mesh( geometry, material );
      shootPoint2.position.z = 2.5;
      shootPoint2.position.x = -shootPoint1.shootDistance;
   shootPoint.add(shootPoint1);
   shootPoint.add(shootPoint2);
   shootPoint.up = shootPoint1;

   var geometry = new THREE.BoxGeometry(4,4,1);
   var material = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
   var active = new THREE.Mesh( geometry, material );
   active.position.z = 11;

   var geometry = new THREE.BoxGeometry(6,6,1);
   var material = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true, opacity: 0 })
   var activeToPass = new THREE.Mesh( geometry, material );
   activeToPass.position.z = 14;

   player[pos].player.add(body);
   player[pos].player.add(movePoint);
   player[pos].player.add(ballPoint);
   player[pos].player.add(shootPoint);
   player[pos].player.add(active);
   player[pos].player.add(activeToPass);

   player[pos].player.body = body;
   player[pos].player.movePoint = movePoint;
   player[pos].player.ballPoint = ballPoint;
   player[pos].player.shootPoint = shootPoint;
   player[pos].player.activeBlock = active;
   player[pos].player.activeToPassBlock = activeToPass;
   
   player[pos].player.pos = pos;
   if (player[pos].attack) player[pos].player.attack = player[pos].attack;
   else player[pos].player.attack = 0
  
   if (player[pos].defense) player[pos].player.defense = player[pos].defense;
   else player[pos].player.defense = 0
  
   player[pos].player.pass = 0;
   player[pos].player.longpass = 0;
   player[pos].player.directpass = 0;
   player[pos].player.shoot = 0;
   player[pos].player.shootPower = 1.5;
   player[pos].player.walkAll = 0.5;
   player[pos].player.runAll = player[pos].speed;
   player[pos].player.walk = 0.5;
   player[pos].player.run = player[pos].speed;
   player[pos].player.speed = player[pos].player.walk;
    
   player[pos].player.deff = player[pos].deff;
   player[pos].player.att = player[pos].att;
    
   player[pos].player.speedPass = 4.5;
   player[pos].player.speedLongpass = 2.5;
   player[pos].player.active = 0;
   player[pos].player.activeToPass = 0;
   player[pos].player.tic = 0;
   player[pos].player.cover = 0;
   player[pos].player.activeRun = 0;
   player[pos].player.stop = 0;
    
   masAll.push(player[pos].player); 
   if (pos != GK) mas.push(player[pos].player);
  
   player[pos].player.posY = 1;
   player[pos].player.posX = 1;
  
   player[pos].player.firstPosX = player[pos].obj.position.x;
   player[pos].player.firstPosY = player[pos].obj.position.y;
  
   player[pos].player.position.x = player[pos].obj.position.x;
   player[pos].player.position.y = player[pos].obj.position.y;
  
   scene.add( player[pos].player )
  }
  
  function addPosPlayersAll(p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p,field,plane,mas,masAll,my,home) {
    if (my == 1) {
      p.player1.player1 = 1;
      if (home == 0) {
        p.player1.home = -1;
      }
    }
    else {
      p.player2.player2 = 1;
      if (home == 0) {
        p.player2.home = -1;
      }
    }
    for (var i = 0; i < arguments.length-7; i++) {
      addPosFields(field, arguments[i], plane);
      addPlayers(plane, arguments[i], mas, masAll)
    }
  }
  
  
  addPosPlayersAll(GK, LB, LCB, RCB, RB, LDM, AM, RDM, CF, LW, RW, players,fieldPosMas,playerPlane,masPlayers,masAllPlayers,1,1);
  addPosPlayersAll(GK, LB, LCB, CB, RCB, RB, LDM, RDM, CF, LW, RW, players,fieldPosMas2,playerPlane2,masPlayers2,masAllPlayers2,0,0);
  
  
/////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////
  
  

/////////////////////////////////////////////////////////
  
  
  /////////////////////////////////////////////////////////////////////////
  var geometry = new THREE.SphereGeometry(3,10,10);
  var material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: ballTexture })
  ball = new THREE.Mesh( geometry, material );
  //ball.position.z = 2.5;
  ball.castShadow = true;
  ball.passing = 0;
  ball.longpassing = 0;
  ball.directpassing = 0;
  ball.shooting = 0;
  ball.speed = 0;
  
  ball.position.z = 150
  ball.position.x = 0
  ball.velocity = {x: 0, y: 0, z: 0}
  ball.mass = 0.009 //kg
  ball.radius = 15 // 1px = 1cm
  ball.restitution = -0.4
  
  A = Math.PI * ball.radius * ball.radius / 10000; // m^2
  
  scene.add( ball )
  
  

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0xffffff)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  //stats = new Stats();
  //document.body.appendChild( stats.dom );
  document.body.appendChild( renderer.domElement );
  //////////////////////////////////////////////////////////
}

function key() {
  document.onkeydown = function(e) {
    if (e.which == 83) keyPass = 1;
    else if (e.which == 68) keyShoot = 1;
    else if (e.which == 65) keyLongpass = 1;
    else if (e.which == 69) keyDirectpass = 1;
    else if (e.which == 87) keyRun = 1;
    else if (e.which == 81) activeRun = 1;  //Q
  }
  document.onkeyup = function(e) {
    if (e.which == 83) {
      keyPass = 2;
      setTimeout(function() {
        keyPass = 0;
      }, 30) 
    }
    else if (e.which == 68) {
      keyShoot = 2;
      setTimeout(function() {
        keyShoot = 0;
      }, 30) 
    }
    else if (e.which == 65) {
      keyLongpass = 2;
      setTimeout(function() {
        keyLongpass = 0;
      }, 30) 
    }
    else if (e.which == 69) {
      keyDirectpass = 2;
      setTimeout(function() {
        keyDirectpass = 0;
      }, 30) 
    }
    else if (e.which == 87) {
      keyRun = 2;
      setTimeout(function() {
        keyRun = 0;
      }, 30) 
    }
    else if (e.which == 90) { //Z
      for (var i in masAllPlayers) {
        masAllPlayers[i].posY = getRandomInRange(-fieldBlockHeight/2, fieldBlockHeight/2)
      }
      players.player1.teamAttack = 0;
      players.player1.teamDefense = 1;
    }
    else if (e.which == 67) { //C
      
      for (var i in masAllPlayers) {
        masAllPlayers[i].posY = getRandomInRange(-fieldBlockHeight/2, fieldBlockHeight/2)
      }
      
      players.player1.teamAttack = 1;
      players.player1.teamDefense = 0;
    }
    else if (e.which == 88) { //X
      players.player1.teamAttack = 0;
      players.player1.teamDefense = 0;
    }
    else if (e.which == 81) { //Q
     activeRun = 0; 
    }
    else if (e.which == 80) { //P
      ball.position.x = -380
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////
function passPlayer(player) {
  if (player.longpass == 0 && player.pass == 0 && player.shoot == 0) {
    if (keyPass == 1) {
      player.ballPoint.up.position.x += passDistance;
      if (player.pass == 0 && distanceBetweenObjs(player, ball) < 7) {
        player.shootPoint.up.material.opacity = 0;
        if (currentPassSpeed < 10 && player.pass == 0) {
          passDistance = 4; 
          currentPassSpeed+=0.2;
          //passing1 = 1;
        }
        else if (currentPassSpeed >= 10 && player.pass == 0) {
          player.pass = 1;
          ball.speed = player.speedPass;
          //passing1 = 0;
        }
      }
    }
    else if (keyPass == 2) {
      passDistance = 0;
      if (player.pass == 0 && distanceBetweenObjs(player, ball) < 7) {
        player.pass = 1;
        //passing1 = 0;
        ball.speed = player.speedPass;
      }
    }
  }
  else if (distanceBetweenObjs(player, ball) < 7 && player.pass == 1) {
    passDistance = 0;

    ball.passing = 1;
    targetPass = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial());
    player.speed = player.walk;
    for (var i in masAllPlayers) {
      if (masAllPlayers[i].activeToPass == 1) {

        player.ballPoint.up.position.x = player.ballPoint.up.position.x
        targetPass.position.x = masAllPlayers[i].activeBlock.getWorldPosition(new THREE.Vector3()).x;
        targetPass.position.y = masAllPlayers[i].activeBlock.getWorldPosition(new THREE.Vector3()).y;
        player.ballPoint.up.position.x = player.ballPoint.up.passDistance;
      }
    }
    player.pass = 0;
    currentPassSpeed = currentPassSpeedAll;
  }
  if (ball.passing == 1) {
    player.ballPoint.up.material.opacity = 0;
    player.shootPoint.up.material.opacity = 0;
    moveAB(ball, targetPass, ball.speed);
    //passing1 = 0;
    setTimeout(function(){
      if (detectCollisionCubes(player.body, ball)) {
        ball.speed = 0;
      }  
    },100)
    ball.speed -=0.02;
    if (ball.speed <= 0) {
      ball.speed = 0;
      ball.passing = 0;
    }
  }
  /*if (passing1 == 1) {
    fieldPassSpeed +=3
    $('.pass-field-back').css({'width':fieldPassSpeed +'%'})
  }
  else if (passing1 == 0) {
    fieldPassSpeed = 0
    $('.pass-field-back').css({'width':fieldPassSpeed +'%'})
  } */ 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
function longpassPlayer(player) {
  if (player.longpass == 0 && player.pass == 0 && player.shoot == 0) {
    if (keyLongpass == 1) {
      player.ballPoint.up.position.x += longpassDistance;
      if (player.longpass == 0 && distanceBetweenObjs(player, ball) < 7) {
        player.shootPoint.up.material.opacity = 0;
        if (currentPassSpeed < 10 && player.longpass == 0) {
          longpassDistance = 7; 
          currentPassSpeed+=0.2;
          //passing1 = 1;
        }
        else if (currentPassSpeed >= 10 && player.longpass == 0) {
          player.longpass = 1;
          ball.speed = player.speedLongpass;
          //passing1 = 0;
        }
      }
    }
    else if (keyLongpass == 2) {
      longpassDistance = 0;
      if (player.longpass == 0 && distanceBetweenObjs(player, ball) < 7) {
        player.longpass = 1;
        //passing1 = 0;
        ball.speed = player.speedLongpass;
      }
    }
  }
  else if (distanceBetweenObjs(player, ball) < 7 && player.longpass == 1) {
    longpassDistance = 0;

    ball.longpassing = 1;
    targetPass = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial());
    player.speed = player.walk;
    for (var i in masAllPlayers) {
      if (masAllPlayers[i].activeToPass == 1) {

        /*player.ballPoint.up.position.x = player.ballPoint.up.position.x * 1.5
        player.ballPoint.up.position.y = player.ballPoint.up.position.y * 1.5*/
        
        
        targetPass.position.x = masAllPlayers[i].activeBlock.getWorldPosition(new THREE.Vector3()).x;
        targetPass.position.y = masAllPlayers[i].activeBlock.getWorldPosition(new THREE.Vector3()).y;
        
        player.ballPoint.up.position.x = player.ballPoint.up.passDistance;
      }
    }
    var distBall = distanceBetweenObjs(player, targetPass);
    ball.velocity.z = distBall * 3 / 100;
    player.longpass = 0;
    currentPassSpeed = currentPassSpeedAll;
  }
  if (ball.longpassing == 1) {
    player.ballPoint.up.material.opacity = 0;
    player.shootPoint.up.material.opacity = 0;
    moveAB(ball, targetPass, ball.speed);
    //passing1 = 0;
    setTimeout(function(){
      if (detectCollisionCubes(player.body, ball)) {
        ball.speed = 0;
      }  
    },100)
    ball.speed -=0.005;
    if (ball.speed <= 0) {
      ball.speed = 0;
      ball.longpassing = 0;
    }
  }
  /*if (passing1 == 1) {
    fieldPassSpeed +=3
    $('.pass-field-back').css({'width':fieldPassSpeed +'%'})
  }
  else if (passing1 == 0) {
    fieldPassSpeed = 0
    $('.pass-field-back').css({'width':fieldPassSpeed +'%'})
  } */ 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
function directpassPlayer(player) {
  player.shootPoint.up.position.x += directpassDistance;
  
  if (player.longpass == 0 && player.shoot == 0 && player.directpass == 0) {
    if (keyDirectpass == 1) {
      if (player.directpass == 0 && distanceBetweenObjs(player, ball) < 7) {
        if (currentDirectpassSpeed < 10 && player.directpass == 0) {
          directpassDistance = 3;
          currentDirectpassSpeed+=0.1;
        }
        else if (currentDirectpassSpeed >= 10 && player.directpass == 0) {
          player.directpass = 1;
          ball.speed = currentDirectpassSpeed*player.shootPower/2;
        }
      }
      
    }
    else if (keyDirectpass == 2) {
      directpassDistance = 0;
      if (player.directpass == 0 && distanceBetweenObjs(player, ball) < 7) {
        player.directpass = 1;
        ball.speed = currentDirectpassSpeed*player.shootPower/2;
      }
    }
  }
  else if (distanceBetweenObjs(player, ball) < 7 && player.directpass == 1) {
    directpassDistance = 0;
    ball.directpassing = 1;
    targetDirectpass = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0x000000}));
    
    player.shootPoint.up.position.x = player.shootPoint.up.position.x * 4;
    player.shootPoint.up.position.y = player.shootPoint.up.position.y * 4;
    
    targetDirectpass.position.x = player.shootPoint.up.getWorldPosition(new THREE.Vector3()).x;
    targetDirectpass.position.y = player.shootPoint.up.getWorldPosition(new THREE.Vector3()).y;
    player.shootPoint.up.position.x = player.shootPoint.up.shootDistance;
    
    player.directpass = 0;
    currentDirectpassSpeed = currentDirectpassSpeedAll;
  }
  
  
  
  if (ball.directpassing == 1) {
    player.shootPoint.up.material.opacity = 0;
    player.ballPoint.up.material.opacity = 0;
    moveAB(ball, targetDirectpass, ball.speed);
    

    setTimeout(function(){
      if (detectCollisionCubes(player.body, ball)) {
        ball.directpassing = 0;
      }  
    },100)
    
    
    //ball.speed -=0.05;
    if (ball.speed > 0.1) {
      ball.speed -= 0.05;
    }
    else if (ball.speed < -0.1) {
      ball.speed += 0.05;
    }
    else {
      ball.speed = 0
      ball.directpassing = 0;
    }
  }

}
/////////////////////////////////////////////////////////////////////////////////////
function shootPlayer(player) {
  
  if (gate.gateShoot.position.y < gateWidth/2+20 && gate.gateShoot.position.y > -gateWidth/2-20) {
    gate.gateShoot.position.y -= shootMove*1.5;
    shootMove = 0;  
  }
  if (!keyboard.pressed("up") && !keyboard.pressed("down")) {
      gate.gateShoot.position.y = 0;
  }
  
  
  player.shootPoint.up.position.x += shootDistance;
  
  if (player.longpass == 0 && player.shoot == 0) {
    if (keyShoot == 1) {
      if (player.shoot == 0 && distanceBetweenObjs(player, ball) < 7) {
        if (currentShootSpeed < 10 && player.shoot == 0) {
          shootDistance = 10;
          currentShootSpeed+=0.2;
        }
        else if (currentShootSpeed >= 10 && player.shoot == 0) {
          player.shoot = 1;
          ball.speed = currentShootSpeed*player.shootPower/2;
        }
      }
      
    }
    else if (keyShoot == 2) {
      shootDistance = 0;
      if (player.shoot == 0 && distanceBetweenObjs(player, ball) < 7) {
        player.shoot = 1;
        ball.speed = currentShootSpeed*player.shootPower/2;
      }
    }
  }
  else if (distanceBetweenObjs(player, ball) < 7 && player.shoot == 1) {
    var distShoot = player.activeBlock.getWorldPosition(new THREE.Vector3()).distanceTo(player.shootPoint.up.getWorldPosition(new THREE.Vector3()));
    shootDistance = 0;
    
    ball.shooting = 1;
    targetShoot = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0x000000}));
    
    player.shootPoint.up.position.x = player.shootPoint.up.position.x * 4;
    player.shootPoint.up.position.y = player.shootPoint.up.position.y * 4;
    
    targetShoot.position.x = gate.gateShoot.getWorldPosition(new THREE.Vector3()).x;
    targetShoot.position.y = gate.gateShoot.getWorldPosition(new THREE.Vector3()).y;
    player.shootPoint.up.position.x = player.shootPoint.up.shootDistance;
    
    player.shoot = 0;
    currentShootSpeed = currentShootSpeedAll;

    ball.velocity.z = distShoot * 8 / distShoot;
    
  }
  
  
  
  if (ball.shooting == 1) {
    player.shootPoint.up.material.opacity = 0;
    player.ballPoint.up.material.opacity = 0;
    moveAB(ball, targetShoot, ball.speed);
    

    setTimeout(function(){
      if (detectCollisionCubes(player.body, ball)) {
        ball.speed = 0;
      }  
    },100)
    
    
    //ball.speed -=0.05;
    if (ball.speed > 0.1) {
      ball.speed -= 0.05;
    }
    else if (ball.speed < -0.1) {
      ball.speed += 0.05;
    }
    else {
      ball.speed = 0
      ball.shooting = 0;
    }
  }

}

function touchBall(player) {
  player.ballPoint.up.material.opacity = 1;
  player.shootPoint.up.material.opacity = 1;
  if (detectCollisionCubes(player.body, ball) && player.pass == 0) {
    moveAB(ball, player.movePoint.up, player.speed);
    ball.rotation.x += 0.1 
  } 
}
 
function choosePlayerToPass(player) {
 var masDistancesPass = [];
  
  for (var i in masAllPlayers) {  
    if (masAllPlayers[i].active == 0 && distanceBetweenObjs(player, ball) < 7) {
      masDistancesPass[i] = distanceBetweenObjs2(player.ballPoint.up, masAllPlayers[i])
      if (masAllPlayers[i].activeToPass == 0) {
        masAllPlayers[i].activeToPassBlock.material.opacity = 0;
      }
      if (masAllPlayers[i].activeToPass == 1) {
        masAllPlayers[i].activeToPassBlock.material.opacity = 1;
      }
    }
    else {
      masDistancesPass[i] = 1000000;
      masAllPlayers[i].activeToPassBlock.material.opacity = 0;
    }
    masAllPlayers[i].activeToPass = 0;
    
    if (masAllPlayers[i].activeRun == 1) {
      var targ = new THREE.Mesh(new THREE.BoxGeometry(1,1,1))
      targ.position.y = masAllPlayers[i].position.y
      targ.position.x = masAllPlayers[i].position.x+1;
      if (masAllPlayers[i].active == 0) {
        moveAB(masAllPlayers[i], targ, masAllPlayers[i].run)
      }
      
    }
    
    
  }
  
  
  
  let min1 = Math.min.apply(null, masDistancesPass);
  let current1 = masDistancesPass.indexOf(min1);
  masAllPlayers[current1].activeToPass = 1;
  
  if (activeRun == 1) {
    var currentRun = masAllPlayers[current1];
    currentRun.activeRun = 1;
    setTimeout(function() {
      currentRun.activeRun = 0;
    },4000)
  }
  
  

}

function movePlayer(player) {
    if (keyboard.pressed("left")) {
      player.rotation.z = Math.PI;
    }
    if (keyboard.pressed("right")) {
      player.rotation.z = 0;
    }
    if (keyboard.pressed("up")) {
      player.rotation.z = Math.PI/2;
      shootMove = -1;
    }
    if (keyboard.pressed("down")) {
      player.rotation.z = 0 - Math.PI/2;
      shootMove = 1;
    }
    if (keyboard.pressed("right") && keyboard.pressed("down")) {
      player.rotation.z = 0 - Math.PI/4;
      shootMove = 1;
    }
    if (keyboard.pressed("right") && keyboard.pressed("up")) {
      player.rotation.z = Math.PI/4;
      shootMove = -1;
    }
    if (keyboard.pressed("left") && keyboard.pressed("up")) {
      player.rotation.z = Math.PI - Math.PI/4;
      shootMove = -1;
    }
    if (keyboard.pressed("left") && keyboard.pressed("down")) {
      player.rotation.z = Math.PI + Math.PI/4;
      shootMove = 1;
    }
    
  if (keyboard.pressed("left") || keyboard.pressed("right") || keyboard.pressed("up") || keyboard.pressed("down")) {
    if (ball.passing == 0 && ball.longpassing == 0) moveAB(player, player.movePoint.up, player.speed);
    else moveAB(player, ball, player.speed);
  }
  
  
  player.active = 1;
  if (player.active == 1) {
    player.activeBlock.material.opacity = 1;
  }
  if (player.active == 1 && distanceBetweenObjs(player, ball) > 7) {
      moveAB(player, ball, player.speed/5);
  }
  
  if (player.stop == 1) {
    player.walk = 0;
    player.run = 0;
  }
  else if (player.stop == 0 && player.run != player.runAll) {
    player.walk = player.walkAll;
    player.run = player.runAll;
  }
  
  choosePlayerToPass(player);
  
  
  
}

function run(player) {
  if (keyRun == 1) {
    player.speed = player.run;
    //console.log(player)
  }
  else if (keyRun == 2) {
    player.speed = player.walk;
  }
}

function player(mas) {
  var masDistances = [];
  for (var i in mas) {
    masDistances[i] = distanceBetweenObjs(mas[i], ball);
  }
  let min = Math.min.apply(null, masDistances);
  let current = masDistances.indexOf(min);
  
  for (var i in mas) {
    if (i != current )mas[i].active = 0;
    else mas[i].active = 1;
    if (mas[i].active == 0) {
      mas[i].activeBlock.material.opacity = 0;
    }
  }
  return mas[current];
}

function playerIE(mas) {
  if (players.player1.teamAttack == 1) {
    for (var i in mas) {
      if (mas[i].attack > 0 && mas[i].active == 0 && mas[i].activeRun == 0) {
        moveAB2(mas[i], mas[i].attack*players.player1.home, mas[i].posX, mas[i].posY, mas[i].run/getRandomInRange(1, 3));
      }
    }
  }
  else if (players.player1.teamDefense == 1) {
    for (var i in mas) {
      if (mas[i].defense < 0 && mas[i].active == 0 && mas[i].activeRun == 0) {
        moveAB2(mas[i], mas[i].defense*players.player1.home, mas[i].posX, mas[i].posY, mas[i].run/getRandomInRange(1, 3));
      }
    }
  }
  else {
    for (var i in mas) {
      if ( mas[i].active == 0 && mas[i].activeRun == 0) {
        moveAB2(mas[i], 1,mas[i].posX, mas[i].posY, mas[i].run/getRandomInRange(1, 3));
      }
    }
  }
  
  for (var i in mas) {
    mas[i].tic++
    if ( mas[i].tic > getRandomInRange(70, 450)) {
      mas[i].posY = getRandomInRange(-fieldBlockHeight*2, fieldBlockHeight*2);
      mas[i].posX = getRandomInRange(-fieldBlockWidth*2, fieldBlockWidth*2);
      mas[i].tic = 0;
    }
  }
    
}

function playerGKIE(mas) {

  if ( mas[0].active == 0) {
    if (mas[0].position.y < gate.top.getWorldPosition(new THREE.Vector3()).y && mas[0].position.y > gate.bottom.getWorldPosition(new THREE.Vector3()).y) {
      moveAB2(mas[0], 1,mas[0].posX, ball.position.y, mas[0].walk);
    }
    else moveAB2(mas[0], 1,mas[0].posX, gate.top.getWorldPosition(new THREE.Vector3()).y, mas[0].walk/1.5);
  }

  

    
}

function enginePlayer() {
  if (players.player1.player1 == 1) {
    movePlayer(player(masAllPlayers));

    key();
    run(player(masAllPlayers));
    
    
    
    if (players.player1.teamWidthBall == 1) {
      touchBall(player(masAllPlayers));
      passPlayer(player(masAllPlayers));
      directpassPlayer(player(masAllPlayers))
      shootPlayer(player(masAllPlayers));
      longpassPlayer(player(masAllPlayers));
      
    }
    playerIE(masPlayers)
    playerGKIE(masAllPlayers)
  }
  
}



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//

function player2(mas) {
  var masDistances = [];
  for (var i in mas) {
    masDistances[i] = distanceBetweenObjs(mas[i], ball);
  }
  let min = Math.min.apply(null, masDistances);
  let current = masDistances.indexOf(min);
  
  for (var i in mas) {
    if (i != current )mas[i].active = 0;
    else mas[i].active = 1;
    if (mas[i].active == 0) {
      mas[i].activeBlock.material.opacity = 0;
    }
  }
  return mas[current];
}

function movePlayer2(player) {

  player.active = 1;
  if (player.active == 1) {
    player.activeBlock.material.opacity = 1;
  }
  if (player.active == 1 && !detectCollisionCubes(player.body, ball)) {
      moveAB(player, ball, player.run/1.2);
  }
  else if (detectCollisionCubes(player.body, ball) && players.player2.teamWidthBall == 1) {
    player.rotation.z = Math.PI;
    moveAB(player, player.movePoint.up, player.run);
    moveAB(ball, player.movePoint.up, player.run);
    ball.rotation.x += 0.1
  }
  
  if (detectCollisionCubes(player.body, ball) && player.pass == 0 && players.player2.teamWidthBall == 1) {
    
  }
  
  
  $('.info1').text(player.stop);
  
  
  
  if (player.stop == 1) {
    player.walk = 0;
    player.run = 0;
  }
  else if (player.stop == 0) {
    player.walk = player.walkAll;
    player.run = player.runAll;
  }
}

function touchBall2(player) {
  player.ballPoint.up.material.opacity = 1;
  player.shootPoint.up.material.opacity = 1;
  if (detectCollisionCubes(player.body, ball) && player.pass == 0) {
    moveAB(ball, player.movePoint.up, player.speed);
    ball.rotation.x += 0.1 
  } 
}

function playerIE2(mas) {
  if (players.player2.teamAttack == 1) {
    for (var i in mas) {
      if (mas[i].attack > 0 && mas[i].active == 0) {
        moveAB2(mas[i], mas[i].attack*players.player2.home, mas[i].posX, mas[i].posY, mas[i].run/getRandomInRange(1, 3));
      }
    }
  }
  else if (players.player2.teamDefense == 1) {
    for (var i in mas) {
      if (mas[i].defense < 0 && mas[i].active == 0 && mas[i].cover == 0) {
        moveAB2(mas[i], mas[i].defense*players.player2.home, mas[i].posX, mas[i].posY, mas[i].run/getRandomInRange(1, 3));
      }
    }
  }
  else {
    for (var i in mas) {
      if ( mas[i].active == 0) {
        moveAB2(mas[i], 1,mas[i].posX, mas[i].posY, mas[i].run/getRandomInRange(1, 3));
      }
    }
  }
  
  for (var i in mas) {
    mas[i].tic++
    if ( mas[i].tic > getRandomInRange(70, 250)) {
      mas[i].posY = getRandomInRange(-fieldBlockHeight, fieldBlockHeight);
      mas[i].posX = getRandomInRange(-fieldBlockWidth, fieldBlockWidth);
      mas[i].tic = 0;
    }
    
    if (detectCollisionCubes(mas[i].body, ball)) {
      ball.speed = ball.speed/2;
      temp1++;
    }
  }
  //$('.info1').text(temp1);
    
}

function playerGKIE2(mas) {

  
  if (distanceBetweenObjs(mas[0], ball) <= 100 && distanceBetweenObjs(mas[0], gate) < 200) {
    moveAB(mas[0], ball, mas[0].run);
    if (distanceBetweenObjs(mas[0], ball) <= 20) {
      mas[0].position.z = ball.position.z
      moveAB(mas[0], ball, mas[0].run*2);
    }
    
    if (distanceBetweenObjs(mas[0], ball) <= 10) {
      ball.speed = 0
    }
  }
  else {

      if (mas[0].position.y < gate.top.getWorldPosition(new THREE.Vector3()).y && mas[0].position.y > gate.bottom.getWorldPosition(new THREE.Vector3()).y && distanceBetweenObjs(mas[0], ball) > 100) {
        moveAB2(mas[0], 1,mas[0].posX, ball.position.y, mas[0].run*2);
      }
      else moveAB2(mas[0], 1,mas[0].posX, gate.top.getWorldPosition(new THREE.Vector3()).y, mas[0].run*2);


    
  }
  
  
}

function enginePlayer2() {
  if (players.player2.player2 == 1) {
    
    movePlayer2(player2(masPlayers2))
    
    playerIE2(masPlayers2)  
    
    if (players.player2.teamWidthBall == 1) {
      touchBall2(player2(masPlayers2))
    }
    
    
    playerGKIE2(masAllPlayers2)
  }
  
}



function allEngine() {
  for (var i in masPlayers) {
    for (var j in masPlayers2) {
      if (distanceBetweenObjs(masPlayers[i], masPlayers2[j]) < 80 && masPlayers[i].cover == masPlayers2[j].cover) {
        if (players.player1.teamWidthBall == 1) {
          moveAB(masPlayers2[j], masPlayers[i], masPlayers2[j].walk/1.5)
        }
        if (players.player2.teamWidthBall == 1) {
          moveAB(masPlayers[i], masPlayers2[j], masPlayers[i].walk/1.5)
        }
      }
      else if (distanceBetweenObjs(masPlayers[i], masPlayers2[j]) >= 80 && masPlayers[i].cover == masPlayers2[j].cover) {
        masPlayers[i].cover = 0
        masPlayers2[j].cover = 0
      }
      if (distanceBetweenObjs(masPlayers[i], masPlayers2[j]) < 70 && masPlayers[i].cover == masPlayers2[j].cover) {
        var aa = getRandomInRange(0, 999)
        masPlayers[i].cover = aa
        masPlayers2[j].cover = aa
      }
      /*if (distanceBetweenObjs(masPlayers[i], masPlayers2[j]) >= 10 && masPlayers[i].cover == 1) {
        masPlayers[i].cover = 0
      }*/
    
    }
  }
  
  if (distanceBetweenObjs(player(masAllPlayers), ball) < 5 && distanceBetweenObjs(player2(masAllPlayers2), ball) > 5) {
    players.player1.teamWidthBall = 1
    players.player2.teamWidthBall = 0
  }
  else if (distanceBetweenObjs(player(masAllPlayers), ball) > 5 && distanceBetweenObjs(player2(masAllPlayers2), ball) < 5) {
    players.player1.teamWidthBall = 0
    players.player2.teamWidthBall = 1
  }
  else if (distanceBetweenObjs(player(masAllPlayers), ball) < 5 && distanceBetweenObjs(player2(masAllPlayers2), ball) < 5) {
    
    if (players.player1.teamWidthBall == 0 || players.player2.teamWidthBall == 0) {
      battle1 = getRandomInRange(0, player(masAllPlayers).att)
      battle2 = getRandomInRange(0, player2(masAllPlayers2).deff)
    }
    
    players.player1.teamWidthBall = 1
    players.player2.teamWidthBall = 1
    

    //$('.info1').text(battle1 + '-----' + battle2)
    if (battle1 > battle2) {
      
      player2(masAllPlayers2).stop = 1
      setTimeout(function() {
        player2(masAllPlayers2).stop = 0
      },600)
    }
    else {
      player(masAllPlayers).stop = 1
      setTimeout(function() {
        player(masAllPlayers).stop = 0
      },600)
    }
    
    
  }
  
  //$('.info1').text(players.player1.teamWidthBall + '-----' + players.player2.teamWidthBall)
  
}


function ballEngine() {
  
  var Fz = -0.005 * Cd * A * rho * ball.velocity.z * ball.velocity.z * ball.velocity.z / Math.abs(ball.velocity.z);
  
    Fz = isNaN(Fz) ? 0 : Fz;
  
    var az = ag - Fz / ball.mass;
  
    ball.velocity.z -= az * frameRate;
    ball.position.z += ball.velocity.z * frameRate * 10;

  if (ball.position.z < 2.5) {
    ball.velocity.z *= ball.restitution;
    ball.position.z = 2.5;
  }
  
  
  for (var i in block.children) {
    if (detectCollisionCubes(ball, block.children[i])) {
      ball.speed = -ball.speed;
    }
  }
  for (var i in gate.children) {
    if (detectCollisionCubes(ball, gate.children[i]) && !detectCollisionCubes(ball, gate.gateLine)) {
      ball.speed = 0;
    }
    else if (detectCollisionCubes(ball, gate.gateLine)) {
      goal = 1;
    }
  }
  
  
}


function game() {
  enginePlayer();
  enginePlayer2();
  allEngine();
  ballEngine();
}

function animate() {
  //$('.info1').text(ball.passing)
  requestAnimationFrame( animate );
  
  game();
  
  //stats.update();
  renderer.render( scene, camera );
}