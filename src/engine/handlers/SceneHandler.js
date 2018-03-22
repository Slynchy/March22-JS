const PIXI = require('pixi.js');
const TextBox = require('../objects/TextBox.js');

class SceneHandler {

	constructor(){
		this._application = new PIXI.Application(Settings.applicationSettings);

		this._textBox = new TextBox();
		this.scene.addChild(this._textBox);

		this._backgrounds = [];

		this._characters = [];
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
		throw new Error("Not yet implemented");
	}

	RemoveCharacter(char){
		throw new Error("Not yet implemented");
	}

	AddBackground(bg){
		throw new Error("Not yet implemented");
	}

	RemoveBackground(bg){
		throw new Error("Not yet implemented");
	}

	get domElement(){
		return this._application.view;
	}
}

module.exports = SceneHandler;