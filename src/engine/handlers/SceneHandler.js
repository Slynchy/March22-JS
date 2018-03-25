const PIXI = require('pixi.js');
const TextBox = require('../objects/TextBox.js');
const Background = require('../objects/Background.js');

class SceneHandler {

	constructor(){
		this._application = new PIXI.Application(Settings.applicationSettings);
        this._application.ticker.minFPS = 60;

		this._textBox = new TextBox();
		this.scene.addChild(this._textBox);

		this._backgrounds = [];

		this._characters = [];

		this._loopInterval = null;

		if(Settings.debugMode){
			console.log("Debug mode");
		}
	}

	startLoop(){
        this._application.ticker.add(this.mainLoop.bind(this));
	}

	mainLoop(){
        this.scene.children.sort(function(a, b){
            if(!a.zOrder) a.zOrder = 0;
            if(!b.zOrder) b.zOrder = 0;
            if(a.zOrder === b.zOrder) return 0;
            else return (a.zOrder<b.zOrder ? -1 : 1);
        });

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

	AddCharacter(char){
        console.log('Drawing char ' + char);
	}

	RemoveCharacter(char){
        console.log('Removing char ' + char);
	}

    RemoveCharacters(){
        console.log('Removing all chars');
    }

	AddBackground(bg){
        console.log('Drawing BG ' + bg);
        let bgObj = new Background(M22.ScriptHandler.activeScript.getBackground(bg), {});
        this._backgrounds.push(bgObj);
        this.scene.addChild(bgObj);
	}

	RemoveBackground(bg){
        console.log('Remove BG ' + bg);
	}

	get domElement(){
		return this._application.view;
	}
}

module.exports = SceneHandler;