let Sprite = require('pixi.js').Sprite;

class TextBox extends Sprite{
	constructor(props){
		super(null, {});

		if(props)
			Object.assign(this,props);
	}

	hide(){
		console.log('Hide');
	}

    show(){
        console.log('Show');
    }

	disableNovelMode(){
		console.log('disableNovelMode');
	}

    enableNovelMode(){
        console.log('enableNovelMode');
    }
}

module.exports = TextBox;