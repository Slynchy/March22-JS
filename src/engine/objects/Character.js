let Sprite = require('pixi.js').Sprite;

class Character extends Sprite {
	constructor(props){
		super(null, {});

		if(props)
			Object.assign(this,props);
	}
}

module.exports = Character;