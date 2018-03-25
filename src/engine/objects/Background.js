let Sprite = require('pixi.js').Sprite;

class Background extends Sprite{
	constructor(texture, props){
		super(texture, {});

        this.x = 0;
        this.y = 0;

        let oldHeight = this.height;
        this.height = M22.SceneHandler.renderer.height;
        this.width = texture.width * (this.height / oldHeight);

		if(props)
			Object.assign(this,props);
	}

	update(){

	}
}

module.exports = Background;