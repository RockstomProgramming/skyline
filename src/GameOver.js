
MyGame.GameOver = function (game) {
    this.textScore = null;
    // Sons.
    this.game_over_sound = null;
};

MyGame.GameOver.prototype = {

    create: function () {

        //
        this.game_over_sound = this.add.audio('game_over_sound');
        this.game_over_sound.play('', 0, 0.5, true);

        this.stage.backgroundColor = "#FF6600" ;

        // cria botao para reiniciar o jogo
        this.add.button(this.game.width*0.5-180, this.game.height*0.5+70, 'ImagemBotao', this.startGame, this);

        // texto que mostra o placar final
        this.textScore = this.add.text(this.game.width*0.5, this.game.height*0.5-70, '0');
        this.textScore.anchor.setTo(0.5);

    },

    // na atualização mostramos o valor do placar final
    update: function () {

        if(MyGame.scorePlayerOne == 0){
            this.textScore.text = "Vencedor: Jogador Dois";
        } else {
            this.textScore.text = "Vencedor: Jogador Um";
        }

    },

    startGame: function (pointer) {

        this.game_over_sound.stop();
        this.state.start('Game');

    }

};
