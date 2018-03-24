let Sprite = require('pixi.js').Sprite;

class Background extends Sprite{
	constructor(texture, props){
		super(texture, {});

        this.x = 0;
        this.y = 0;
		this.width = M22.SceneHandler.renderer.width;
        this.height = M22.SceneHandler.renderer.height;

		if(props)
			Object.assign(this,props);
	}

	update(){

	}
}

module.exports = Background;