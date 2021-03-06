// Definição de variaveis locais
MyGame.Game = function (game) {
    this.init();
};

MyGame.Game.prototype = {
    init: function() {
        this.velocidade = 2;
        this.velocidadeMissel = 5;
        this.tempoMissel = 0;
        this.tempoBala = 0;
        this.tiro = [];
        this.qntArvores = 30;
        this.elementosMapa = [];
        this.qntMissil = 10;
        this.velocidadeInimigo = 1;
        this.qntInimigos = 5;
        this.inimigos = [];
        this.maxDanoInimigo = 2;
        this.vidas = 3;
        this.pontos = 0;
        this.isTirosMultiplos = false;
    },

    create: function () {
        // Camadas
        this.fundoLayer = this.add.group();
        this.fundoLayer.z = 0;

        this.mapaLayer = this.add.group();
        this.mapaLayer.z = 1

        this.playerLayer = this.add.group();
        this.playerLayer.enableBody = true;
        this.playerLayer.z = 2;

        this.inimigoLayer = this.add.group();
        this.inimigoLayer.enableBody = true;
        this.inimigoLayer.z = 2;

        this.tiroLayer = this.add.group();
        this.tiroLayer.enableBody = true;
        this.tiroLayer.z = 2;

        this.tiroInimigoLayer = this.add.group();
        this.tiroInimigoLayer.enableBody = true;
        this.tiroInimigoLayer.z = 2;

        this.gameLayer = this.add.group();
        this.gameLayer.enableBody = true;
        this.gameLayer.add(this.playerLayer);
        this.gameLayer.add(this.inimigoLayer);
        
        // Distribuição dos elementos nas camadas
        this.fundo = this.add.sprite(0, 0, 'background');
        this.fundoLayer.add(this.fundo);

        this.rand = new Phaser.RandomDataGenerator();

        for (var i = 0; i < this.qntArvores; i++) {
            var key = this.rand.pick(['arvore', 'planta1', 'pedra', 'planta2', 'planta3']);
            var elemento = this.add.sprite(this.rand.between(0,800), this.rand.between(0,600), key);
            this.mapaLayer.add(elemento);
            this.elementosMapa.push(elemento);
        }

        this.tirosMultiplosLayer = this.add.group();
        this.tirosMultiplosLayer.enableBody = true;
        this.tirosMultiplosLayer.create(0.5, 0.5, 'tiroMultiplo');
        this.melhoriaTiro = this.tirosMultiplosLayer.getFirstExists(true);

        this.maisMissilLayer = this.add.group();
        this.maisMissilLayer.enableBody = true;
        this.maisMissilLayer.create(0.5, 0.5, 'melhoriaMissil');
        this.melhoriaMissil = this.maisMissilLayer.getFirstExists(true);

        this.elementosMapa.push(this.melhoriaTiro);
        this.elementosMapa.push(this.melhoriaMissil);

        this.game.time.events.add(Phaser.Timer.SECOND * 10, this.addMelhorias, this);

        this.player = this.add.sprite(400, 400, 'jogador');
        this.playerLayer.add(this.player);

        this.gerarInimigos();

        this.explosaoLayer = this.add.group();
        this.explosaoLayer.createMultiple(2, 'explosao');
        this.explosaoLayer.setAll('anchor.x', 0.5);
        this.explosaoLayer.setAll('anchor.y', 0.5);

        this.player.animations.add('esquerda', [2], 5, false);
        this.player.animations.add('centro', [0], 5, false);
        this.player.animations.add('direita', [1], 5, false);

        this.player.play('centro');

        this.cursor = this.input.keyboard.createCursorKeys();
        this.btnAcao = this.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.SHIFT, Phaser.Keyboard.R]);
    },

    addMelhorias: function() {
        this.melhoriaTiro.reset(this.rand.between(10, this.game.width - 10), 0.5);
    },

    update: function() {
        if (this.cursor.up.isDown) {
            this.player.y -= this.velocidade + 1;
        } else if (this.cursor.down.isDown) {
            this.player.y += this.velocidade + 1;
        } else if (this.cursor.right.isDown) {
            this.player.x += this.velocidade + 1;
            this.player.play('direita');
        } else if (this.cursor.left.isDown) {
            this.player.x -= this.velocidade + 1;
            this.player.play('esquerda');
        } else {
             this.player.play('centro');
        }

        this.atirar();
        this.movimentarTiro();
                
        this.physics.arcade.overlap(this.tiroInimigoLayer, this.playerLayer, (tiro, player) => {
            this.animarColisao(player);

            tiro.kill();

            this.player.reset(400, 400);

            this.gameOver();
        });

        this.physics.arcade.overlap(this.inimigoLayer, this.playerLayer, (inimigo, player) => {
            this.animarColisao(inimigo);
            this.animarColisao(player);

            inimigo.kill();

            this.player.reset(400, 400);

            this.gameOver();
        });

        this.physics.arcade.overlap(this.tiroLayer, this.inimigoLayer, (tiro, inimigo) => {
            tiro.kill();

            if (tiro.tipo == 'MISSIL')
                inimigo.dano += 2;
            else
                inimigo.dano++;

            if (inimigo.dano >= this.maxDanoInimigo) {
                this.animarColisao(inimigo);

                inimigo.reset(this.rand.between(0, 800), -50);

                this.pontos += 10;
                inimigo.dano = 0;
            }
            
        });

        this.physics.arcade.overlap(this.playerLayer, this.tirosMultiplosLayer, (player, melhoria) => {
            melhoria.kill();
            this.isTirosMultiplos = true;
        });

        this.physics.arcade.overlap(this.playerLayer, this.maisMissilLayer, (player, melhoria) => {
            melhoria.kill();
            this.qntMissil = 10;
        });

        this.movimentarInimigos();
        this.atualizarElementos();
    },

    animarColisao: function(sprite) {
        explosao = this.explosaoLayer.getFirstExists(false);
        if (explosao) {
            explosao.animations.add('explodir');
            explosao.reset(sprite.body.x, sprite.body.y);
            explosao.play('explodir', 30, false, true);
        }
    },

    gameOver: function() {
        this.vidas --;

        if (this.vidas <= 0) {
            this.game.state.restart(true, true);
            this.game.state.start('MainMenu');
        }
    },

    movimentarInimigos: function() {
        for (var i = 0; i < this.inimigos.length; i++) {
            var inimigo = this.inimigos[i].sprite;

            inimigo.y += this.inimigos[i].velocidade;

            if (inimigo.y > this.game.height) {
                inimigo.y = -50;
                inimigo.x = this.rand.between(10, 790);
                inimigo.velocidade = this.rand.between(1, 2);
                this.inimigos[i].dano = 0;

                if (this.pontos > 0)
                    this.pontos -= 10;
            }

            if (this.inimigos[i].y > this.game.height) {
                inimigo.missil.kill();
            }

            this.disparar(this.inimigos[i]);
        }
    },

    disparar: function(inimigo) {
        if (inimigo.disparo == 0) {
            inimigo.disparo = this.rand.between(0, 600);
        }

        if (inimigo.sprite.y == inimigo.disparo) {
            if (!inimigo.missil) {
                var missil = this.add.sprite(inimigo.sprite.body.x, inimigo.sprite.body.y, 'missil_inimigo');
                this.tiroInimigoLayer.add(missil);

                inimigo.missil = missil;
            }
        }

        if (inimigo.missil) {
            inimigo.missil.y += 2;
            if (inimigo.missil.y > this.game.height) {
                inimigo.missil.kill();
                inimigo.missil = null;
            }
        }
    },

    gerarInimigos: function() {
        for (var i = 0; i < this.qntInimigos; i++) {
            var inimigo = this.add.sprite(this.rand.between(0, 790), -50, 'inimigo');
            inimigo.name = this.guid();
            inimigo.dano = 0;

            this.inimigoLayer.add(inimigo);

            this.inimigos.push({
                sprite: inimigo, 
                velocidade: this.rand.between(1, 3), 
                missil: null, 
                disparo: 0,
                dano: 0
            });
        }
    },

    atirar: function() {
        if (this.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            if (this.time.now > this.tempoMissel && this.qntMissil > 0) {
                var x = this.player.x + 15;
                var y = this.player.y - 10;

                var missil = this.add.sprite(x, y, 'missil');
                missil.tipo = 'MISSIL';

                this.tiroLayer.add(missil);

                this.tiro.push(missil);

                this.tempoMissel = this.time.now + 200;
                this.qntMissil --;
            }
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if (this.time.now > this.tempoBala) {
                var x = this.player.x + 15;
                var y = this.player.y - 10;

                bala = this.add.sprite(x, y, 'bala');

                this.tiroLayer.add(bala);

                this.tiro.push(bala);

                if (this.isTirosMultiplos) {
                    bala1 = this.add.sprite(x, y, 'bala');
                    bala1.especial = true;
                    bala1.isDireita = true;

                    bala2 = this.add.sprite(x, y, 'bala');
                    bala2.especial = true;
                    bala2.isDireita = false;

                    this.tiroLayer.add(bala1);
                    this.tiroLayer.add(bala2);

                    this.tiro.push(bala1);
                    this.tiro.push(bala2);
                }

                this.tempoBala = this.time.now + 200;
            }
        }
    },

    movimentarTiro: function() {
        if (this.tiro.length > 0) {
            for (var i = 0; i < this.tiro.length; i++) {
                var tiro = this.tiro[i];
                tiro.y -= this.velocidadeMissel;

                if (tiro.especial) {
                    if (tiro.isDireita) 
                        tiro.x += this.velocidadeMissel;
                    else
                        tiro.x -= this.velocidadeMissel;
                }

                if (tiro.y < -600) {
                    tiro.kill();
                    this.tiro.splice(this.tiro.indexOf(this.tiro[i]), 1);
                }
            }
        }
    },

    atualizarElementos: function () {
        if (this.elementosMapa.length > 0) {
            for (var i = 0; i < this.elementosMapa.length; i++) {
                if (this.elementosMapa[i].y >= this.game.height) {
                    this.elementosMapa[i].y = -50;
                    this.elementosMapa[i].x = this.rand.between(0,800);
                }

                this.elementosMapa[i].y += this.velocidade + 2;
            }
        }
    },

    guid: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },

    render: function () {
        this.game.debug.text('Disparos Ativos: ' + this.tiro.length, 32, 32);
        this.game.debug.text('Mísseis: ' + this.qntMissil, 32, 64);
        this.game.debug.text('Vidas: ' + this.vidas, 32, 96);
        this.game.debug.text('Pontos: ' + this.pontos, 32, 128);
    }
};
