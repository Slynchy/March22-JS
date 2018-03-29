let PIXI = require('pixi.js');
let TransitionFilter = require('./TransitionFilter.js');

class Background extends PIXI.Sprite{
	constructor(texture, props){
		super(texture, {});

        this.x = 0;
        this.y = 0;

        let oldHeight = this.height;
        this.height = M22.SceneHandler.renderer.height;
        this.width = texture.width * (this.height / oldHeight);

        this.shader = null;
        this.filters = [];
        this.progress = -1;

        this.speed = 0.01;

		if(props)
			Object.assign(this,props);
	}

	setTransition(sprite, fadeIn, callback){
		if(this.interval){
			clearInterval(this.interval);
			this.interval = null;
		}

		this.shader = new TransitionFilter(sprite, fadeIn);
		this.filters = [this.shader];
		if(Settings.applicationSettings.antialias){
			this.filters.push(new PIXI.filters.FXAAFilter());
		}
		this.progress = -1;

		this.interval = setInterval(()=>{
			this.shader.uniforms._Progress = this.progress += this.speed;

			if(this.shader.uniforms._Progress > 1){
				this.shader.uniforms._Progress = 1;
				clearInterval(this.interval);
				if(callback){
					callback();
				}
			}
		}, Settings.transitionUpdateRate);
	}

	update(){

	}
}

module.exports = Background;