// Definição de variaveis locais
MyGame.Game = function (game) {

    // Camadas
    this.fundoLayer, this.player, this.aviaoLayer = null;
    this.velocidade = 5;
    this.velocidadeMissel = 5;
    this.tempoMissel = 0;
    this.tiro = [];
};

MyGame.Game.prototype = {

    create: function () {
        // Camadas
        this.aviaoLayer = this.add.group();
        this.aviaoLayer.z = 1;

        this.fundoLayer = this.add.group();
        this.fundoLayer.z = 0;

        // Distribuição dos elementos nas camadas
        this.player = this.add.sprite(400, 400, 'jogador');
        this.aviaoLayer.add(this.player);

        //this.fundo = this.add.sprite(0, 0, 'background');
        //this.fundoLayer.add(this.fundo);

        //this.explosao = this.add.sprite(30, 30, 'explosao');
        //this.explosao.animations.add('explodir', [0, 1, 2, 3, 4], 15, true);

        //this.explosao.play('explodir');

        this.player.animations.add('esquerda', [2], 5, false);
        this.player.animations.add('centro', [0], 5, false);
        this.player.animations.add('direita', [1], 5, false);

        this.player.play('centro');

         // Iniciando a engine arcade.
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.btnAcao = this.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
    },

    update: function() {
        if (this.cursor.up.isDown) {
            this.player.y -= this.velocidade;
        } else if (this.cursor.down.isDown) {
            this.player.y += this.velocidade;
        } else if (this.cursor.right.isDown) {
            this.player.x += this.velocidade;
             this.player.play('direita');
        } else if (this.cursor.left.isDown) {
            this.player.x -= this.velocidade;
             this.player.play('esquerda');
        } else {
             this.player.play('centro');
        }

        if (this.btnAcao.isDown) {
            this.atirar();
        }

        if (this.tiro.length > 0) {
            for (var i = 0; i < this.tiro.length; i++) {
                var tiro = this.tiro[i];
                tiro.y -= this.velocidadeMissel;
            }
        }
    },

    atirar: function() {
        if (this.time.now > this.tempoMissel) {
            var x = this.player.x + 15;
            var y = this.player.y - 10;

            missil = this.add.sprite(x, y, 'missil');

            this.tiro.push(missil);

            this.tempoMissel = this.time.now + 200;
        }
    },

    render: function () {
        this.game.debug.text('Mísseis Lançados: ' + this.tiro.length, 32, 32);
    }
};
