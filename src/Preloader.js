MyGame.Preloader = function(game) {
	this.background = null;
};

MyGame.Preloader.prototype = {

	preload: function () {

		// - Carrega todos os assets -
        this.load.image('fundoTitulo', 'images/backGroundTitle.png');
        this.load.image('iniciar', 'images/play.png');
        this.load.image('background', 'images/space.png');
        this.load.image('missil', 'images/missil.png', 10, 13);
        this.load.spritesheet('jogador', 'images/player.png', 40, 64);
        this.load.spritesheet('explosao', 'images/explode.png', 26, 26);
	},

	create: function () {
		this.state.start('MainMenu');
	}
};
