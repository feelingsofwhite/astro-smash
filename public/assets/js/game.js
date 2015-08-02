var snake, apple, squareSize, score, speed,
  updateDelay, direction, new_direction,
  addNew, cursors, scoreTextValue, speedTextValue,
  textStyle_Key, textStyle_Value;

var platforms;
var player;
var cursors;
var score = 0;
var scoreText;
var debugText;
var baddies=[];
var ground;

var Game = {
  scoreChange: function(delta){ score += delta; scoreText.text = "score: " + score; },
  makeBaddie: function (x, type)
  {
    var self=this;
    var baddie = game.add.sprite(x, 64, type)
    game.physics.arcade.enable(baddie)
    baddie.body.velocity.y = 75
    baddie.hitGround = function(){
        self.scoreChange(-100)
    }
    baddies.push(baddie)
  },

  preload: function () {
    // here we load all theneeded resources for the level
    // in our case that's just two squares. Ane for a snake body and one for the apple

    game.load.image('big1', './assets/images/big1.png');

    game.load.image('asteroid-lg', 'assets/asteroid-64.png');
    game.load.image('asteroid-sm', 'assets/asteroid-32.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('ground', 'assets/platform.png');
  },
  create: function () {

    game.stage.backgroundColor = '#061f27';
    this.big1 = game.add.sprite(130, 0, 'big1');

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We will enable physics for any object that is created in this group
    platforms = game.add.group()
    platforms.enableBody = true

    ground = platforms.create(0, game.world.height - 60, 'ground')
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2,2)
    ground.body.immovable=true;
    
    player = game.add.sprite(32, game.world.height -150, 'dude')
    //enable phaysics on player
    game.physics.arcade.enable(player)

    //player.body.bounce.y = 0.2
    //player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0,1,2,3], 10, true)
    player.animations.add('right', [5,6,7,8], 10, true)
    player.faceCamera = function() {
        player.animations.stop()
        player.frame = 4;
    }

    
    cursors = game.input.keyboard.createCursorKeys()
    scoreText = game.add.text(16,game.world.height - 48,'', {fontSize: '32px', fill: '#fff'})
    this.scoreChange(0);
    debugText = game.add.text(16,16,'debug', {fontSize: '16px', fill: '#aaa'})

    this.makeBaddie(32, 'asteroid-lg')
    this.makeBaddie(128, 'asteroid-sm')
  },

  update: function () {

    // do game stuff only if the counter is aliquot to (10 - the game speed).
    // the higher the speed, the more  frequently this is fulfilled,
    // making the snake move faster.
    this.big1.y = this.big1.y +1;

    //reset players velocity (movement)
    player.body.velocity.x = 0
    player.body.velocity.y = 0

    if (cursors.left.isDown && cursors.right.isDown) {
        player.faceCamera()
    } else if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    } else {
        player.faceCamera()
    }
    
    game.physics.arcade.overlap(ground, baddies, this.baddieHitGround, null, this)

    debugText.text = 
        "player.body.x=" + player.body.x
  },
  baddieHitGround: function (ground, baddie){
      baddie.hitGround()
      baddie.kill()
  }

};
