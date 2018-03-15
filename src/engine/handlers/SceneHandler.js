const PIXI = require('pixi.js');

class SceneHandler {

	constructor(){
		this._application = new PIXI.Application(Settings.applicationSettings);



		this._scene = new PIXI.Container();
	}

	get scene(){
		return this._scene;
	}

	get domElement(){
		return this._application.view;
	}
}

module.exports = SceneHandler;