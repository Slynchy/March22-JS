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

		// if(Settings.applicationSettings.antialias){
		// 	if(!this.filters){
		// 		this.filters = [];
		// 	}
		// 	this.filters.push(new PIXI.filters.FXAAFilter());
		// }

        this.speed = 0.01;

		if(props)
			Object.assign(this,props);
	}

	/**
	 *
	 * @param {PIXI.Sprite} sprite
	 * @param {bool} fadeIn
	 * @param {float} speed
	 * @param {float} startProgress The progress to start at (normally -1)
	 * @param {Function} callback
	 */
	setTransition(sprite, fadeIn, speed, startProgress, callback){
		if(this.interval){
			clearInterval(this.interval);
			this.interval = null;
		}

		this.speed = speed;
		this.shader = new TransitionFilter(sprite, fadeIn);
		this.filters = [this.shader];

		this.progress = startProgress;

		this.interval = M22.EventHandler.ScheduleEvent(()=>{
			this.shader.uniforms._Progress = this.progress += this.speed;

			if(this.shader.uniforms._Progress > 1){
				this.shader = null;
				this.filters = [];
				this.interval.stop();
				if(callback){
					callback();
				}
			}
		}, Settings.applicationSettings.deltaMultiplier, true);
	}

	/**
	 * @deprecated ?
	 */
	update(){};
}

module.exports = Background;