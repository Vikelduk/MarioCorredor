var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var bowser, bowserImg;

var invisibleGround, background, backgroundImg;;

var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundMario.avif")
  
  mario_running = loadAnimation("mario_walking.png", "mario_walkingB.jpg", "mario_walkingC.png");
  mario_collided = loadAnimation("mario_collided.png");

  bowserImg = loadAnimation("bowser_andando.gif");
  
  obstacle1 = loadImage("obstacle_1Mario.webp");
  obstacle2 = loadImage("obstacle_2Mario.webp");
  obstacle3 = loadImage("plantaCarnivora_Mario.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() 
{
  createCanvas(windowWidth, windowHeight);
  
  mario = createSprite(150,height-70,20,50);

  bowser = createSprite(50, height-70,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.setCollider('circle',0,0,350);
  mario.scale = 0.08;
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  background = createSprite(width/2,height,width,2);
  background.addImage("background", backgroundImg);
  background.x = width/2
  background.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(0)
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    background.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && mario.y  >= height-120) {
      jumpSound.play( )
      mario.velocityY = -10;
       touches = [];
    }
    
    mario.velocityY = mario.velocityY + 0.8
  
    if (background.x < 0){
      background.x = background.width/2;
    }
  
    mario.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    background.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
               
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = mario.depth;
    mario.depth +=1;
    obstaclesGroup.add(obstacle);
  }
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  score = 0;
}
