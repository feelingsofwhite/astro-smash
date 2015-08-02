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
    var self = this;
    var baddie = game.add.sprite(x, 64, type);
    game.physics.arcade.enable(baddie);
    baddie.body.velocity.y = 75;
    baddie.hitGround = function(){
        self.scoreChange(-100);
    };
    baddies.push(baddie);
  },

  preload: function () {
    // here we load all theneeded resources for the level
    // in our case that's just two squares. Ane for a snake body and one for the apple

    game.load.image('big1', './assets/images/big1.png');

    game.load.image('asteroid-lg', 'assets/asteroid-64.png');
    game.load.image('asteroid-sm', 'assets/asteroid-32.png');
    game.load.image('hero', 'assets/images/hero.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('bullet', 'assets/images/bullet.png');
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  create: function () {

    game.stage.backgroundColor = '#061f27';
    this.big1 = game.add.sprite(130, 0, 'big1');

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We will enable physics for any object that is created in this group
    platforms = game.add.group();
    platforms.enableBody = true;

    ground = platforms.create(0, game.world.height - 60, 'ground');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2,2);
    ground.body.immovable=true;

    this.bullets = [];
    this.bullets[0] = game.add.sprite(0, 0, 'bullet');
    this.bullets[1] = game.add.sprite(0, 0, 'bullet');
    this.bullets[2] = game.add.sprite(0, 0, 'bullet');

    this.bullets[0].exists = false;
    //this.bullets[1].exists(false);
    //this.bullets[2].exists(false);

    player = game.add.sprite(32, game.world.height -150, 'hero');
    //enable phaysics on player
    game.physics.arcade.enable(player);


    //player.body.bounce.y = 0.2
    //player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.lives = [];
    for(var i=3;i>0;i--)
    {
      player.lives.push(
          game.add.sprite(game.world.width - (i*(player.width+16)), game.world.height - player.height - 16, 'hero')
        );
    }


    cursors = game.input.keyboard.createCursorKeys();
    scoreText = game.add.text(16,game.world.height - 48,'', {fontSize: '32px', fill: '#fff'});
    this.scoreChange(0);
    debugText = game.add.text(16,16,'debug', {fontSize: '16px', fill: '#aaa'});

    this.makeBaddie(32, 'asteroid-lg');
    this.makeBaddie(128, 'asteroid-sm');
    this.makeBaddie(128+32, 'asteroid-sm');
    this.makeBaddie(128+32+32, 'asteroid-sm');
  },

  update: function () {
    
    // do game stuff only if the counter is aliquot to (10 - the game speed).
    // the higher the speed, the more  frequently this is fulfilled,
    // making the snake move faster.
    this.big1.y = this.big1.y +1;

    //reset players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown && cursors.right.isDown) {
        player.faceCamera();
    } else if (cursors.left.isDown) {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
    }

    game.physics.arcade.overlap(player, baddies, this.baddieHitPlayer, null, this);
    if (player.alive)
    {
      game.physics.arcade.overlap(ground, baddies, this.baddieHitGround, null, this);
    }
    debugText.text =
        "player.body.x=" + player.body.x;
  },
  baddieHitPlayer: function (player, baddie){
      var self = this;
      baddie.kill();
      var i = player.lives.length-1;
      while((i>=0) && (!player.lives[i].exists)){
        i--;
      }
      if (i === -1) {
        player.kill();
        window.setTimeout(function(){
          self.state.start('Game_Over');
        }, 2000);
      } else {
        player.lives[i].kill();
      }
  },
  baddieHitGround: function (ground, baddie){
      baddie.hitGround();
      baddie.kill();
  }

};
