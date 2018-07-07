let PIXI = require('pixi.js');

class TransitionFilter extends PIXI.Filter {
	/**
	 * @param {PIXI.Sprite} sprite
	 * @param {boolean} fadeIn
	 */
	constructor(sprite, fadeIn) {
		const maskMatrix = new PIXI.Matrix();

		sprite.renderable = false;

		super(
			// vertex shader
			document.getElementById('vertexShader').innerHTML,
			// fragment shader
			fadeIn
				? document.getElementById('transitionShaderIn').innerHTML
				: document.getElementById('transitionShaderOut').innerHTML
		);

		this.maskSprite = sprite;
		this.maskMatrix = maskMatrix;
		this.glShaderKey = 'alpha';

		this.uniforms.mapSampler = sprite._texture;
		this.uniforms.filterMatrix = maskMatrix;
		this.uniforms.scale = { x: 1, y: 1 };

		this.fadeIn = fadeIn == true;
		this.uniforms._Progress = -1;

		this.scale = new PIXI.Point(20, 20);
	}

	/**
	 * Applies the filter.
	 *
	 * @param {PIXI.FilterManager} filterManager - The manager.
	 * @param {PIXI.RenderTarget} input - The input target.
	 * @param {PIXI.RenderTarget} output - The output target.
	 */
	apply(filterManager, input, output) {
		this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(
			this.maskMatrix,
			this.maskSprite
		);
		this.uniforms.scale.x = this.scale.x;
		this.uniforms.scale.y = this.scale.y;

		// draw the filter...
		filterManager.applyFilter(this, input, output);
	}

	/**
	 * The texture used for the displacement map. Must be power of 2 sized texture.
	 *
	 * @member {PIXI.Texture}
	 */
	get map() {
		return this.uniforms._SecondaryTex;
	}

	set map(
		value // eslint-disable-line require-jsdoc
	) {
		this.uniforms._SecondaryTex = value;
	}
}

module.exports = TransitionFilter;
