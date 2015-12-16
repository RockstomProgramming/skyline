// Definição de variaveis locais
MyGame.Game = function (game) {
    this.velocidade = 3;
    this.velocidadeMissel = 5;
    this.tempoMissel = 0;
    this.tempoBala = 0;
    this.tiro = [];
    this.qntArvores = 15;
    this.elementosMapa = [];
    this.qntMissil = 10;
};

MyGame.Game.prototype = {

    create: function () {
        // Camadas
        this.fundoLayer = this.add.group();
        this.fundoLayer.z = 0;

        this.mapaLayer = this.add.group();
        this.mapaLayer.z = 1

        this.aviaoLayer = this.add.group();
        this.aviaoLayer.z = 2;
        
        // Distribuição dos elementos nas camadas
        this.fundo = this.add.sprite(0, 0, 'background');
        this.fundoLayer.add(this.fundo);

        this.rand = new Phaser.RandomDataGenerator();

        for (var i = 0; i < this.qntArvores; i++) {
            var elemento = this.add.sprite(this.rand.between(0,800), this.rand.between(0,600), 'arvore');
            this.mapaLayer.add(elemento);
            this.elementosMapa.push(elemento);
        }

        this.player = this.add.sprite(400, 400, 'jogador');
        this.aviaoLayer.add(this.player);

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
        this.btnAcao = this.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.SHIFT, Phaser.Keyboard.R]);
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

        this.atirar();

        if (this.tiro.length > 0) {
            for (var i = 0; i < this.tiro.length; i++) {
                var tiro = this.tiro[i];
                tiro.y -= this.velocidadeMissel;

                if (tiro.y < -600) {
                    this.tiro.splice(this.tiro.indexOf(tiro), 1);
                }
            }
        }

        this.recarregarMissil();
        this.atualizarElementos();
    },

    recarregarMissil: function() {
        if (this.input.keyboard.isDown(Phaser.Keyboard.R)) {
            this.qntMissil = 10;
        }
    },

    atirar: function() {
        if (this.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            if (this.time.now > this.tempoMissel && this.qntMissil > 0) {
                var x = this.player.x + 15;
                var y = this.player.y - 10;

                missil = this.add.sprite(x, y, 'missil');

                this.tiro.push(missil);

                this.tempoMissel = this.time.now + 200;
                this.qntMissil --;
            }
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if (this.time.now > this.tempoBala) {
                var x = this.player.x + 15;
                var y = this.player.y - 10;

                bala = this.add.sprite(x, y, 'bala');

                this.tiro.push(bala);

                this.tempoBala = this.time.now + 200;
            }
        }
    },

    atualizarElementos: function () {
        if (this.elementosMapa.length > 0) {
            for (var i = 0; i < this.elementosMapa.length; i++) {
                if (this.elementosMapa[i].y >= this.game.height) {
                    this.elementosMapa[i].y = 0;
                    this.elementosMapa[i].x = this.rand.between(0,800);
                }

                this.elementosMapa[i].y += this.velocidade + 2;
            }
        }
    },

    render: function () {
        this.game.debug.text('Disparos Ativos: ' + this.tiro.length, 32, 32);
        this.game.debug.text('Mísseis: ' + this.qntMissil, 32, 64);
    }
};
