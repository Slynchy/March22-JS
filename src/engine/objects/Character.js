let Sprite = require('pixi.js').Sprite;
let TransitionFilter = require('./TransitionFilter.js');

class Character extends Sprite {
	constructor(texture, props) {
		super(texture, {});

		this.name = '';
		this.fullName = '';
		this.emotion = '';

		if (!this.filters) this.filters = [];

		this._xOffset = 0;
		this._yOffset = 0;

		this.shader = null;
		this.filters = [];
		this.progress = -1;

		this.anchor.x = 0.5;
		this.anchor.y = 1.0;
		this.y = Settings.applicationSettings.height;

		this.scale.x = Settings.functionSettings.DrawCharacter.scale;
		this.scale.y = Settings.functionSettings.DrawCharacter.scale;
		this.zOrder = 500;

		if (props) Object.assign(this, props);
	}

	update() {}

	setTransition(sprite, fadeIn, speed, startProgress, callback) {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}

		this.speed = speed;
		this.shader = new TransitionFilter(sprite, true);

		this.filters = [this.shader];

		this.progress = startProgress;
		this.shader.uniforms._Progress = this.progress;

		this.interval = EventHandler.ScheduleEvent(
			() => {
				if (fadeIn) this.progress += this.speed;
				else this.progress -= this.speed;

				this.shader.uniforms._Progress = this.progress;

				if ((fadeIn && this.progress >= 0) || (!fadeIn && this.progress <= -1)) {
					this.interval.stop();
					if (!fadeIn) {
						this.renderable = false;
					}
					this.filters = [];
					this.shader = null;
					if (callback) {
						callback();
					}
				}
			},
			Settings.applicationSettings.deltaMultiplier,
			true
		);
	}

	get xOffset() {
		return this._xOffset;
	}

	set xOffset(val) {
		this._xOffset = val;

		this.x = Settings.applicationSettings.width / 2 + this._xOffset;
	}

	get yOffset() {
		return this._yOffset;
	}

	set yOffset(val) {
		this._yOffset = val;

		this.y = Settings.applicationSettings.height + this._yOffset;
	}
}

module.exports = Character;
