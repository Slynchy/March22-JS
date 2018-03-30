const PIXI = require('pixi.js');
const TextBox = require('../objects/TextBox.js');
const Background = require('../objects/Background.js');
const Character = require('../objects/Character.js');

class SceneHandler {

	constructor(){
		PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
		this._application = new PIXI.Application(Settings.applicationSettings);
        this._application.ticker.minFPS = Settings.applicationSettings.targetFPS;

		this._textBox = new TextBox();
		this.scene.addChild(this._textBox);

		this._backgrounds = [];
		this._characters = [];
		this._transitions = {};

		this._loopInterval = null;

		this._lastSceneCount = 0;

		this._updateSceneZOrder = false;

		if(Settings.debugMode){
			console.log("Debug mode");
		}
	}

	get ticker(){
		return this._application.ticker;
	}

	updateZOrders(){
		this._updateSceneZOrder = true;
	}

	startLoop(){
        this._application.ticker.add(this.mainLoop.bind(this));
	}

	mainLoop(){
		if(this.scene.children.length !== this._lastSceneCount || this._updateSceneZOrder === true){
			this.scene.children.sort(function(a, b){
				if(!a.zOrder) a.zOrder = 0;
				if(!b.zOrder) b.zOrder = 0;
				if(a.zOrder === b.zOrder) return 0;
				else return (a.zOrder<b.zOrder ? -1 : 1);
			});

			this._lastSceneCount = this.scene.children.length;
			this._updateSceneZOrder = false;
		}

		// DO NOTHING
		for(let i = 0; i < this._backgrounds.length; i++){
			this._backgrounds[i].update();
		}

        for(let i = 0; i < this._characters.length; i++){
            this._characters[i].update();
        }
	}

	get scene(){
		return this._application.stage;
	}

	get renderer(){
		return this._application.renderer;
	}

	get textBox(){
		return this._textBox;
	}

	get backgrounds(){
		return this._backgrounds;
	}

	get characters(){
		return this._characters;
	}

	AddTransition(key, texture){
		let transitionSprite = new PIXI.Sprite(texture);
		this._transitions[key] = transitionSprite;
	}

	GetTransition(key){
		for(let k in this._transitions){
			if(k === key) {
				/*
					Explanation: The shader relies on an in-scene sprite, but we can't set renderable=false in the
					same frame it's added, so we only add it to the scene when it's needed (and the shader handles
					making it unrenderable)
				 */
				return this._application.stage.addChild(this._transitions[k]);
			}
		}

		if(Settings.AssetHandlerSettings.safeMode){
			console.error("Failed to find transition \"%s\"; using \"%s\" instead", key, Object.keys(this._transitions)[0]);
			return this._application.stage.addChild(this._transitions[Object.keys(this._transitions)[0]]);
		} else {
			throw new Error("Failed to find transition: ", key);
		}
	}

	RemoveTransitions(){
		for(let k in this._transitions){
			this._application.stage.removeChild(this._transitions[k]);
		}
		this._transitions = {};
	}

	AddCharacter(char, xOffset){
        console.log('Drawing char ' + char);

		let charObj = new Character(M22.ScriptHandler.activeScript.getCharacter(char), {
			xOffset: xOffset
		});
		this._characters.push(charObj);
		this.scene.addChild(charObj);
		return charObj;
	}

	RemoveCharacter(char){
        console.log('Removing char ' + char);
	}

    RemoveCharacters(){
        console.log('Removing all chars');
    }

	ClearOldBackgrounds(){
		if(this._backgrounds.length === 0) return;
		let bg = this._backgrounds[this._backgrounds.length-1];
		this._backgrounds = [];
		this._backgrounds.push(bg);
	}

	AddBackground(bg){
        console.log('Drawing BG ' + bg);
        let bgObj = new Background(M22.ScriptHandler.activeScript.getBackground(bg), {});
        this._backgrounds.push(bgObj);
        this.scene.addChild(bgObj);
        return bgObj;
	}

	RemoveBackground(bg){
        console.log('Remove BG ' + bg);
	}

	get domElement(){
		return this._application.view;
	}
}

module.exports = SceneHandler;