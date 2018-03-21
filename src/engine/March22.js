
const ScriptCompiler = require('./ScriptCompiler.js');
const BackgroundHandler = require('./handlers/BackgroundHandler.js');
const CharacterHandler = require('./handlers/CharacterHandler.js');
const InputHandler = require('./handlers/InputHandler.js');
const CustomFunctionHandler = require('./handlers/CustomFunctionHandler.js');
const SceneHandler = require('./handlers/SceneHandler.js');

/**
 * Singleton master class for all M22 functionality
 */
class March22 {
	constructor(){

		this.ScriptCompiler = ScriptCompiler;

		this.BackgroundHandler = new BackgroundHandler();
		this.CharacterHandler = new CharacterHandler();
		this.InputHandler = new InputHandler();
		this.CustomFunctionHandler = new CustomFunctionHandler();
		this.SceneHandler = new SceneHandler();

		this._activeScript = null;
	}

	get domElement(){
		return this.SceneHandler.domElement;
	}

	_loadScriptToActive(scriptName, onSuccess, onFail){
		return this.ScriptCompiler.CompileScript(scriptName, (data)=>{
			this._activeScript = data;

			if(onSuccess)
				onSuccess();
		}, onFail);
	}

	/**
	 *
	 * @param {String} entrypoint Script name (w/o extensions) to start the engine with
	 */
	start(entrypoint){
		if(!entrypoint){
			entrypoint = 'START_SCRIPT';
		}

		this._loadScriptToActive(entrypoint, ()=>{
			this._loadAssetsForScript(this._activeScript, ()=>{
				// assets are loaded, start script
				console.log(this._activeScript);
			});
		}, (err)=>{
			throw new Error(err.reason);
		});

	}

	/**
	 *
	 * @param {M22Script} scriptObj
	 * @param {Function} onSuccess
	 * @param {Function} onFail
	 * @private
	 */
	_loadAssetsForScript(scriptObj, onSuccess, onFail){
		// unload existing assets to clear memory
		// load new assets
		// run callback
		onSuccess();
	};
}

if(!global.hasOwnProperty('M22')){
	global.M22 = new March22();
}

module.exports = global.M22;