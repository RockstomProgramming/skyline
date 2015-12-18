MyGame.Preloader = function(game) {
	this.background = null;
};

MyGame.Preloader.prototype = {

	preload: function () {

		// - Carrega todos os assets -
        this.load.image('fundoTitulo', 'images/backGroundTitle.png');
        this.load.image('iniciar', 'images/play.png');
        this.load.image('background', 'images/mapa.png');
        this.load.image('arvore', 'images/arvore.png');
        this.load.image('planta1', 'images/planta1.png');
        this.load.image('planta2', 'images/planta2.png');
        this.load.image('planta3', 'images/planta3.png');
        this.load.image('pedra', 'images/pedra.png');
        this.load.image('missil', 'images/missil.png');
        this.load.image('tiroMultiplo', 'images/melhoria1.png');
        this.load.image('melhoriaMissil', 'images/melhoria2.png');
        this.load.image('missil_inimigo', 'images/missil_inimigo.png');
        this.load.image('bala', 'images/bala2.png');
        this.load.image('inimigo', 'images/inimigo.png');
        this.load.spritesheet('jogador', 'images/player.png', 40, 64);
        //this.load.spritesheet('explosao', 'images/explode2.png', 26, 26);
        this.load.spritesheet('explosao', 'images/explode.png', 128, 128);
	},

	create: function () {
	       this.state.start('MainMenu');
	}
};
