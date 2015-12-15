// Definição inicial do objeto, criação de variaveis globais
var MyGame = {
    scorePlayerOne: 3,
    scorePlayerTwo: 3
};

MyGame.Boot = function(game) {};

MyGame.Boot.prototype = {

    preload: function () {

        // carrega barra de loader e background para mostrar no loader.

    },

    // chamado sempre após o preloader ser completado
    create: function () {

        // pausa o jogo ao perder foco
        this.stage.disableVisibilityChange = false;

        // alinha o canvas no centro
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // redimensionar o canvas de acordo com a area disponivel
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setScreenSize(true);
        this.scale.setMaximum();
        this.scale.refresh();
        
        // inicia o pré carregamento de assets
        this.state.start('Preloader');

    },

};