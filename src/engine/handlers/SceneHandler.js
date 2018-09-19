const PIXI = require('pixi.js');
const TextBox = require('../objects/TextBox.js');
const Background = require('../objects/Background.js');
const Character = require('../objects/Character.js');
const FBEngine = require('fbengine');

class SceneHandler {
	constructor(engine) {
		PIXI.settings.PRECISION_FRAGMENT = Settings.applicationSettings.PRECISION_FRAGMENT;
		this._application = new PIXI.Application(Settings.applicationSettings);
		this._application.ticker.minFPS = Settings.applicationSettings.targetFPS;

		this._scene = new FBEngine.ContainerObject();
		this._application.stage.addChild(this._scene);

		this._engine = engine;

		this._textBox = new TextBox();
		this.scene.addChild(this._textBox);

		this._backgrounds = [];
		this._characters = [];
		this._transitions = {};

		this._loopInterval = null;

		if (Settings.debugMode) {
			console.log('Debug mode');
		}
	}

	get ticker() {
		return this._application.ticker;
	}

	resize() {
		if (this.renderer) {
			this.renderer.resize(
				Settings.applicationSettings.width,
				Settings.applicationSettings.height
			);
		}
	}

	startLoop() {
		this._application.ticker.add(this.mainLoop.bind(this));
	}

	mainLoop() {
		for (let i = 0; i < this._backgrounds.length; i++) {
			this._backgrounds[i].update();
		}

		for (let i = 0; i < this._characters.length; i++) {
			this._characters[i].update();
		}
	}

	get scene() {
		return this._scene;
	}

	get renderer() {
		return this._application.renderer;
	}

	get textBox() {
		return this._textBox;
	}

	get backgrounds() {
		return this._backgrounds;
	}

	get characters() {
		return this._characters;
	}

	AddTransition(key, texture) {
		this._transitions[key] = new PIXI.Sprite(texture);
	}

	GetTransition(key) {
		for (let k in this._transitions) {
			if (!this._transitions.hasOwnProperty(k)) continue;
			if (k === key) {
				/*
					Explanation: The shader relies on an in-scene sprite, but we can't set renderable=false in the
					same frame it's added, so we only add it to the scene when it's needed (and the shader handles
					making it unrenderable)

					But why do we need to make it unrenderable? 03/07/18
				 */
				return this._application.stage.addChild(this._transitions[k]);
			}
		}

		if (Settings.AssetHandlerSettings.safeMode) {
			console.error(
				'Failed to find transition "%s"; using "%s" instead',
				key,
				Object.keys(this._transitions)[0]
			);
			return this._application.stage.addChild(
				this._transitions[Object.keys(this._transitions)[0]]
			);
		} else {
			throw new Error('Failed to find transition: ' + key);
		}
	}

	RemoveTransitions() {
		for (let k in this._transitions) {
			this.scene.removeChild(this._transitions[k]);
		}
		this._transitions = {};
	}

	isCharacterInScene(firstName) {
		return !!this.GetCharacterInScene(firstName);
	}

	GetCharacterInScene(firstName) {
		for (let i = 0; i < this._characters.length; i++) {
			if (this._characters[i].name === firstName) {
				return this._characters[i];
			}
		}
		return null;
	}

	AddCharacter(char, xOffset) {
		console.log('Drawing char ' + char);

		let charObj = new Character(this._engine.ScriptHandler.activeScript.getCharacter(char), {
			xOffset: xOffset,
			name: char.split('/')[0],
			fullName: char,
			emotion: char.split('/')[1]
		});
		this._characters.push(charObj);
		this.scene.addChild(charObj);
		return charObj;
	}

	_removeCharEntries(chr) {
		for (let i = this._characters.length - 1; i >= 0; i--) {
			if (this._characters[i].fullName === chr.fullName) {
				this._characters.splice(i, 1);
			}
		}
	}

	RemoveCharacter(char, callback) {
		// find char
		let chr = this.GetCharacterInScene(char);

		if (!chr)
			console.warn('Failed to remove character %s because they are not in the scene!', char);

		chr.setTransition(this.GetTransition('tr-normal'), false, 0.005, 0, () => {
			this.scene.removeChild(chr);
			this._removeCharEntries(chr);
			if (callback) callback();
		});
	}

	RemoveCharacters() {
		console.log('Removing all chars');
	}

	ClearOldBackgrounds() {
		if (this._backgrounds.length === 0) return;
		let bg = this._backgrounds[this._backgrounds.length - 1];
		this._backgrounds = [];
		this._backgrounds.push(bg);
	}

	AddBackground(bg) {
		console.log('Drawing BG ' + bg);
		let bgObj = new Background(this._engine.ScriptHandler.activeScript.getBackground(bg), {});
		this._backgrounds.push(bgObj);
		this.scene.addChild(bgObj);
		return bgObj;
	}

	RemoveBackground(bg) {
		console.log('Remove BG ' + bg);
	}

	get domElement() {
		return this._application.view;
	}
}

module.exports = SceneHandler;
