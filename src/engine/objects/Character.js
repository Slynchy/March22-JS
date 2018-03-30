let Sprite = require('pixi.js').Sprite;
let TransitionFilter = require('./TransitionFilter.js');

class Character extends Sprite {
	constructor(texture, props){
		super(texture, {});

		// this._xOffset = 0;
		// this._yOffset = 0;

		this.anchor.x = 0.5;
		this.anchor.y = 1.0;
		this.y = (Settings.applicationSettings.height);

		this.scale.x = Settings.functionSettings.DrawCharacter.scale;
		this.scale.y = Settings.functionSettings.DrawCharacter.scale;
		this.zOrder = 500;

		if(props)
			Object.assign(this,props);
	}

    update(){

    }

	setTransition(sprite, fadeIn, speed, startProgress, callback){
		if(this.interval){
			clearInterval(this.interval);
			this.interval = null;
		}

		this.speed = speed;
		this.shader = new TransitionFilter(sprite, fadeIn);
		this.filters = [this.shader];
		if(Settings.applicationSettings.antialias){
			this.filters.push(new PIXI.filters.FXAAFilter());
		}

		this.progress = startProgress;

		this.interval = M22.EventHandler.ScheduleEvent(()=>{
			this.shader.uniforms._Progress = this.progress += this.speed;

			if(this.shader.uniforms._Progress > 1){
				this.shader.uniforms._Progress = 1;
				this.interval.stop();
				if(callback){
					callback();
				}
			}
		}, Settings.applicationSettings.deltaMultiplier, true);
	}

	get xOffset(){
		return this._xOffset;
	}

	set xOffset(val){
		this._xOffset = val;

		this.x = (Settings.applicationSettings.width / 2) + this._xOffset;
	}

	get yOffset(){
		return this._yOffset;
	}

	set yOffset(val){
		this._yOffset = val;

		this.y = (Settings.applicationSettings.height) + this._yOffset;
	}
}

module.exports = Character;