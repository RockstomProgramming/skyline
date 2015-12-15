MyGame.MainMenu = function(game) {
};

MyGame.MainMenu.prototype = {
	create: function() {
    this.background = this.add.image(0, 0, 'fundoTitulo');
    this.add.button(200, 230, 'iniciar', this.startGame, this);
	},

	startGame: function() {
      this.game.state.start('Game');
  }
};
