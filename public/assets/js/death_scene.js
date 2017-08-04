var Death_Scene = {
    preload: function () {
        // load the needed image for this game screen.
        game.load.image('deathscene', './assets/images/Death_Scene.png');
        game.load.image('corpse', './assets/images/corpse.png');

        /*
         //  In the texture atlas the jellyfish uses the frame names blueJellyfish0000 to blueJellyfish0032
         //  So we can use the handy generateFrameNames function to create this for us.
         jellyfish.animations.add('swim', Phaser.Animation.generateFrameNames('blueJellyfish', 0, 32, '', 4), 30, true);
         jellyfish.animations.play('swim');

         */

    },
    create : function() {
        var self = this;
        var x = this.state.states.Death_Scene.x;
        var y = this.state.states.Death_Scene.y;
        this.corpseChunks = [];
        this.add.sprite(0,0,'deathscene');
        var corpseLeft = this.add.sprite(x - 40, y, 'corpse');
        var corpseTopLeft = this.add.sprite(x - 20, y - 20, 'corpse');
        var corpseTop = this.add.sprite(x, y - 40, 'corpse');
        var corpseTopRight = this.add.sprite(x + 20, y - 20, 'corpse');
        var corpseRight = this.add.sprite(x+40, y, 'corpse');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.enable(corpseLeft, Phaser.Physics.ARCADE);
        game.physics.enable(corpseTopLeft, Phaser.Physics.ARCADE);
        game.physics.enable(corpseTop, Phaser.Physics.ARCADE);
        game.physics.enable(corpseTopRight, Phaser.Physics.ARCADE);
        game.physics.enable(corpseRight, Phaser.Physics.ARCADE);
        corpseLeft.body.velocity.x = -300;
        corpseTopLeft.body.velocity.x = -200;
        corpseTopLeft.body.velocity.y = -200;
        corpseTop.body.velocity.y = -300;
        corpseTopRight.body.velocity.x = 200;
        corpseTopRight.body.velocity.y = -200;
        corpseRight.body.velocity.x = 300;
        setTimeout(function() {self.startGame();}, 2000);

    },

    startGame: function () {
        // change the state back to Game
        this.state.start('Game');
    }
};
Death_Scene.prototype = {
    init: function (x) {
        this.x = x;
    }
};