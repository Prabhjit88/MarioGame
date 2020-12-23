//Creating global variables

var background,mario,ground,brick,checkpoint,mario_collided,gameover,obstacleimage,restart,invisibleground,obstaclegroup,checkpointsound,diesound,jumpsound;
var score= 0;
var backgroundimage,mariorunning,groundimage,brickimage,collidedimage,gameoverimage,restartimage,bricksgroup,obstacles;
//value of capital letter variable name is fixed during the whole program
var PLAY = 1;
var END = 0;

//the values of small letter variable name can be changed
var gamestate = PLAY;

//loading images,animation,sounds
function preload()
{
  
  //creating animation
  mariorunning=loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  //loading images
  backgroundimage = loadImage("bg.png");
  groundimage = loadImage("ground2.png");
  brickimage = loadImage("brick.png");
mario_collided= loadAnimation("collided.png");
  gameoverimage= loadImage("gameOver.png");
  obstacleimage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  restartimage = loadImage("restart.png");
  checkpointsound = loadSound("checkPoint.mp3");
  diesound= loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");
}

//code want to execute once
function setup(){
  createCanvas(600,350);
 
  //creating mario and adding animation
  mario = createSprite(50,295,20,50);
  mario.addAnimation("running", mariorunning);
  mario.addAnimation("collided",mario_collided);
  mario.scale = 2;
  
  //creating ground and adding image
  ground = createSprite(300,330,600,20);
  ground.addImage("groundimage", groundimage);
  
  //to create illusion that mario is walking on the ground
 invisibleground = createSprite(300,310,600,20);
  invisibleground.visible = false;
  
  //adding image so need of width and height
  restart = createSprite(300,100);
  restart.addImage(restartimage);
  restart.scale = 0.5;
  restart.visible = false;
  
  //creating gameover
  gameover= createSprite(300,140);
  gameover.addImage(gameoverimage);
  gameover.scale = 0.5;
  gameover.visible= false;
  
  //creating groups to set properties to all obstacles and brick at once
  bricksgroup = new Group();
  obstaclegroup = new Group();
  
  //increasing text sixe
  textSize(20);
  fill(0);
  
}
function draw(){
  
  //adding background
 background(backgroundimage);
  
  if(gamestate===PLAY){
    //mario jumps when space is pressed and will only jump when comes down to ground
  if(keyDown("space") && mario.y>250){
    jumpsound.play();
    mario.velocityY = -12;
  }
    //giving gravity to mario
  mario.velocityY = mario.velocityY +0.8;
    
    //creating illusion that mario is moving by giving moving ground
  ground.velocityX = -6;
    
    
  //resetting ground to create infinte ground 
  if(ground.x<0){
    ground.x = ground.width/2;
    
  }
  
  //calling spawnbricks function
  spawnbricks();
  
  //calling spwanobstacle function
  spawnobstacle();
    
    //change gamestate to END 
  if(obstaclegroup.isTouching(mario)){
   gamestate= END;
    diesound.play();
  }
  }
  else if(gamestate===END){
  
     mario.changeAnimation("collided",mario_collided);
    
    ground.velocityX = 0;
   obstaclegroup.setVelocityXEach(0);
    bricksgroup.setVelocityXEach(0);
    obstaclegroup.setLifetimeEach(-1);
 bricksgroup.setLifetimeEach(-1);
   gameover.visible= true;
    restart.visible= true;
    mario.velocityY = 0;
    if(mousePressedOver(restart)){
      reset(); 
    }
  }
  
    
  //to avoid mario from falling ground
 mario.collide(invisibleground);
 //displaying score text
  text("Score :" + score,480,30);
  
  
  //destroying individual bricks as mario touches the brick and score increase
  for(var i = 0;i<bricksgroup.length;i=i+1){
    if(bricksgroup.get(i).isTouching(mario)){
    score= score+1;
      //destroying bricks individually
      bricksgroup.get(i).remove();
  }
  }
  //drawing sprites
  drawSprites();
}
function reset(){
  gameover.visible = false;
  restart.visible= false;
  gamestate= PLAY;
  mario.changeAnimation("running",mariorunning);
  obstaclegroup.destroyEach();
  bricksgroup.destroyEach();
  score= 0;
  
}
function spawnbricks(){
  //creating bricks after every 60 seconds
  if(frameCount%60===0){
    brick = createSprite(600,120,40,10);
    brick.addImage("bricks",brickimage);
    brick.velocityX = -5;
    //assigning random y position to brick
    brick.y = random(150,200);
    //destryoing sprites as they leave the screen to aviod memory leak
    brick.lifetime = 200;
  mario.depth = brick.depth+1; 
    bricksgroup.add(brick);
    
  }
}
function spawnobstacle(){
  //obstacles are created after every 60 sec
  if(frameCount%60===0){
    obstacles = createSprite(600,270,10,40);
    obstacles.velocityX = -6;
    obstacles.addAnimation("obstacle",obstacleimage);
    obstacles.lifetime = 100;
    obstaclegroup.add(obstacles);
  }
}