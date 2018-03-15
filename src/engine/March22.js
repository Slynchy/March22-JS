
const ScriptCompiler = require('./ScriptCompiler.js');
const BackgroundHandler = require('./handlers/BackgroundHandler.js');
const CharacterHandler = require('./handlers/CharacterHandler.js');
const InputHandler = require('./handlers/InputHandler.js');
const CustomFunctionHandler = require('./handlers/CustomFunctionHandler.js');
const SceneHandler = require('./handlers/SceneHandler.js');

class March22 {
	constructor(){

		this.ScriptCompiler = ScriptCompiler;

		this.BackgroundHandler = new BackgroundHandler();
		this.CharacterHandler = new CharacterHandler();
		this.InputHandler = new InputHandler();
		this.CustomFunctionHandler = new CustomFunctionHandler();
		this.SceneHandler = new SceneHandler();
	}

	get domElement(){
		return this.SceneHandler.domElement;
	}
}

module.exports = global.M22 = new March22();