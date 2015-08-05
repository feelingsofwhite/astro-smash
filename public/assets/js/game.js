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
  makeBaddie: function (type)
  {
    var self = this;
    var image = type;
    switch (type)
    {
      case "big":
        image = "big" + (Math.floor((Math.random() * 5) + 1));
        break;
      case "small":
        image = "small" + (Math.floor((Math.random() * 7) + 1));
        break;
    }

    var baddie = game.add.sprite(0, -64, image);
    var padding = 16;
    baddie.anchor.set(0.5,0.5);
    baddie.x = Math.floor((Math.random() * (game.world.width - baddie.offsetX - (padding * 2)))) + padding;
    game.physics.arcade.enable(baddie);
    baddies.push(baddie);
    baddie.shotUp = function () {
      self.scoreChange(200);
    };
    switch(type)
    {
      case "big":
      case "small":
        baddie.body.velocity.y = 50 + Math.floor((Math.random() * 25));
        baddie.hitGround = function(){
            self.scoreChange(-100);
        };
        baddie.think = function(){};
        break;
      case "seaker":
        var speed = 75 + Math.floor((Math.random() * 25));
        baddie.body.velocity.y = speed;
        baddie.hitGround = function(){};
        baddie.think = function(){
          var delta = player.x - baddie.x;
          var qty = Math.abs(delta);
          if (qty > 2) //solve unknown shudder issue
          {
            var direction = delta / qty; // -1 or +1
            baddie.body.velocity.x = direction * speed;
          } else {
            baddie.body.velocity.x = 0;
          }
        };
        break;
    }
  },
  dropFromTheSky: function(){
    if (this.gameover) {
        return;
    }
    switch (Math.floor((Math.random() * 7) ))
    {
      case 0:
        this.makeBaddie("big");
        break;
      case 1:
        this.makeBaddie("seaker");
        break;
      case 2:
      case 3:
      case 4:
        this.makeBaddie("small");
        break;
    }
  },

  preload: function () {
    // here we load all theneeded resources for the level
    // in our case that's just two squares. Ane for a snake body and one for the apple
    game.load.image('big1', './assets/images/big1.png');
    game.load.image('big2', './assets/images/big2.png');
    game.load.image('big3', './assets/images/big3.png');
    game.load.image('big4', './assets/images/big4.png');
    game.load.image('big5', './assets/images/big5.png');

    game.load.image('small1', './assets/images/small1.png');
    game.load.image('small2', './assets/images/small2.png');
    game.load.image('small3', './assets/images/small3.png');
    game.load.image('small4', './assets/images/small4.png');
    game.load.image('small5', './assets/images/small5.png');
    game.load.image('small6', './assets/images/small6.png');
    game.load.image('small7', './assets/images/small7.png');

    game.load.image('seaker', './assets/images/seaker.png');

    game.load.image('hero', 'assets/images/hero.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('bullet', 'assets/images/bullet.png');
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  create: function () {
    game.stage.backgroundColor = '#061f27';

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
    game.physics.arcade.enable(this.bullets[0]);
    game.physics.arcade.enable(this.bullets[1]);
    game.physics.arcade.enable(this.bullets[2]);

    this.bullets[0].exists = false;
    this.bullets[1].exists = false;
    this.bullets[2].exists = false;

    player = game.add.sprite(32, 0, 'hero');
    player.anchor.set(0.5,0.5);
    player.y = game.world.height - ground.height - player.offsetY;
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

    this.makeBaddie('small');
    this.makeBaddie('small');
    this.makeBaddie('small');
    this.makeBaddie('big');
    this.makeBaddie('seaker');

    game.time.events.loop(Phaser.Timer.SECOND * 4, this.dropFromTheSky, this);

    var key = game.input.keyboard.addKey(Phaser.Keyboard.T); //see here: http://docs.phaser.io/Keyboard.js.html for the keycodes
    key.onDown.add(this.teleport, this);

	this.fireDown = false;
    this.gameover = false;
  },

  update: function () {
    if (this.gameover) {
        return;
    }
    var i;

    for (i = 0; i < this.bullets.length; i++) {
      var bullet = this.bullets[i];
      if (bullet.exists && bullet.y <= 0) {
        bullet.exists = false;
      }
    }

    if (this.fireKey.isDown && !this.fireDown) {
      console.log('pewpew');
      this.firePhasoidCannons();
      this.fireDown = true;
    }

    if (this.fireKey.isUp && this.fireDown) {
      console.log('stopfiring!');
      this.fireDown = false;
    }

    //reset players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown && cursors.right.isDown) {
        // do nothing
    } else if (cursors.left.isDown) {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
    }

    for (i = 0; i < this.bullets.length; i++) {
      game.physics.arcade.overlap(this.bullets[i], baddies, this.bulletHitBaddie, null, this);
    }

    game.physics.arcade.overlap(player, baddies, this.baddieHitPlayer, null, this);

    game.physics.arcade.overlap(ground, baddies, this.baddieHitGround, null, this);

    for (i=baddies.length-1;i>=0;i--)
    {
      var baddie = baddies[i];
      baddie.think();
    }
    debugText.text =
        "player.body.x=" + player.body.x;
  },
  baddieHitPlayer: function (player, baddie){
      if (this.gameover) {
        return;
      }
      var self = this;
      var life = player.lives.length-1;
      while((life>=0) && (!player.lives[life].exists)){
        life--;
      }
      if (life === -1) {
        self.gameOverManGAMEOVER(baddie);
      } else {
        baddie.kill();
        player.lives[life].kill();
      }
  },
  gameOverManGAMEOVER: function(responsible){
    this.gameover = true;
    player.body.velocity.x = 0;
    for (i=baddies.length-1;i>=0;i--)
    {
      var baddie = baddies[i];
      baddie.body.velocity.x = 0;
      baddie.body.velocity.y = 0;
    }
    game.time.events.add(Phaser.Timer.SECOND * 2, function(){ player.kill(); responsible.kill(); }, this);
    game.time.events.add(Phaser.Timer.SECOND * 3, function(){ this.state.start('Game_Over'); }, this);
  },
  baddieHitGround: function (ground, baddie){
      baddie.hitGround();
      baddie.kill();
  },
  firePhasoidCannons: function () {
    for (var i = 0; i < this.bullets.length; i++) {
      var bullet = this.bullets[i];
      if (!bullet.exists) {
        bullet.y = player.top;
        bullet.x = player.left + (player.width/2);
        bullet.body.velocity.y = -500;
        bullet.exists = true;
        break;

      }
    }
    console.log("gun's empty, yo!");
  },
  bulletHitBaddie: function (bullet, baddie) {
    baddie.shotUp();
    baddie.kill();
    bullet.exists = false;
  },
  teleport: function(){
    var padding = 2;
    player.x = Math.floor((Math.random() * (game.world.width - player.width - (padding * 2)))) + padding;
  }

};
