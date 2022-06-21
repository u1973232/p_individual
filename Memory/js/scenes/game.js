class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.name = prompt("Username") || "[ ]";
		this.options_data = JSON.parse(localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}');
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		let arraycards = ['co', 'sb', 'to', 'tb', 'cb', 'so'];
		let array_rnd = Phaser.Utils.Array.Shuffle(arraycards);
		console.log(array_rnd);
		this.cameras.main.setBackgroundColor(0xBFFCFF);

		let playername = "Now playing: " + this.name;
		let playerpoints =  "Score: " + this.score;
		this.add.text(25, 50, playername, {fontSize: '32px', fill: '#000'});
		var scoreText = this.add.text(575, 50, playerpoints, {fontSize: '32px', fill: '#000'});
		
		
		let x = 0, loop_i = 0;
		if (this.options_data.cards == 2) x = 250;
		else if (this.options_data.cards == 3) x = 150;
		else x = 50;
		let alt_x = x;

		let pos_1 = 0;
		let usable_array = [];
		while (loop_i < this.options_data.cards) {
			usable_array.push(array_rnd[pos_1]);
			usable_array.push(array_rnd[pos_1]);
			pos_1++;
			loop_i++;
		}
		console.log(usable_array);
		usable_array = Phaser.Utils.Array.Shuffle(usable_array);
		console.log(usable_array);
		loop_i = 0;
		while (loop_i < this.options_data.cards*2) {
			this.add.image(x, 300, usable_array[loop_i]);
			loop_i++;
			x+=100;
		}
		
		this.cards = this.physics.add.staticGroup();
		
		loop_i = 0;
		while (loop_i < this.options_data.cards*2) {
			this.cards.create(alt_x, 300, 'back');
			loop_i++;
			alt_x+=100;
		}

		this.saveButton = this.add.text(150, 500, 'Save', {fontSize: '32px', fill:'#000'})
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => this.saveButton.setStyle({ fill: 'grey'}))
			.on('pointerout', () => {
				this.saveButton.setStyle({ fill: '#000'})
				this.saveButton.setStyle({ fontSize: '32px'})
				this.saveButton.setPosition(150, 500)
			})
			.on('pointerdown', () => {
				this.saveButton.setStyle({ fontSize: '28px'})
				this.saveButton.setPosition(150, 500)
			})
			.on('pointerup', () => {
				this.saveButton.setStyle({ fontSize: '32px'})
				this.saveButton.setPosition(150, 500)
				save();
				loadpage("../");
			});	

		this.exitButton = this.add.text(450, 500, 'Go to menu', {fontSize: '32px', fill:'#000'})
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => this.exitButton.setStyle({ fill: 'grey'}))
			.on('pointerout', () => {
				this.exitButton.setStyle({ fill: '#000'})
				this.exitButton.setStyle({ fontSize: '32px'})
				this.exitButton.setPosition(450, 500)
			})
			.on('pointerdown', () => {
				this.exitButton.setStyle({ fontSize: '28px'})
				this.exitButton.setPosition(450, 500)
			})
			.on('pointerup', () => {
				this.exitButton.setStyle({ fontSize: '32px'})
				this.exitButton.setPosition(450, 500)
				loadpage("../")
			});
			
		let resta = 0, game_over = false;
		if (this.options_data.dificulty == "easy") resta = 10;
		else if (this.options_data.dificulty == "normal") resta = 20;
		else resta = 30;
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = usable_array[i];
			i++;
			card.setInteractive({ useHandCursor: true });
			card.on('pointerup', () => {
				if (!game_over) {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						this.score -= resta;
						scoreText.setText('Score: ' + this.score);
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.enableBody(false, 0, 0, true, true);
						if (this.score <= 0){
							alert("Game Over");
							scoreText.setText('Score: 0');
							game_over = true;
							this.disable_cards();
						}
					}
					else{
						this.correct++;
						if (this.correct >= this.options_data.cards){
							alert("You Win with " + this.score + " points.");
						}
					}
					this.firstClick = null;
				}
				else{
					this.firstClick = card;
				}
				}
			}, card);
		});
	}

	disable_cards = function(){
		this.cards.children.destroy();
		console.log("Si");
	}
	
	update (){	}
}
