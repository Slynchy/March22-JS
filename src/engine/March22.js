const ScriptCompiler = require('./ScriptCompiler.js');
const BackgroundHandler = require('./handlers/BackgroundHandler.js');
const CharacterHandler = require('./handlers/CharacterHandler.js');
const InputHandler = require('./handlers/InputHandler.js');
const CustomFunctionHandler = require('./handlers/CustomFunctionHandler.js');
const SceneHandler = require('./handlers/SceneHandler.js');
const AssetHandler = require('./handlers/AssetHandler.js');
const ScriptHandler = require('./handlers/ScriptHandler.js');
const EventHandler = require('./handlers/EventHandler.js');

/**
 * Singleton master class for all M22 functionality
 *
 * From all handlers, we assume global.M22 === the singleton instance, because
 * the handler shouldn't exist without the primary engine being created.
 *
 * ^^^ All of this is incorrect, TODO: update!
 */
class March22 {
  constructor() {
    this.ScriptCompiler = ScriptCompiler;

    this.BackgroundHandler = new BackgroundHandler(this);
    this.CharacterHandler = new CharacterHandler(this);
    this.InputHandler = new InputHandler(this);
    this.CustomFunctionHandler = new CustomFunctionHandler(this);
    this.SceneHandler = new SceneHandler(this);
    this.AssetHandler = new AssetHandler(this);
    this.ScriptHandler = new ScriptHandler(this);
    global.EventHandler = this.EventHandler = new EventHandler(this.SceneHandler.ticker);

    this._domElement = null;
  }

  get domElement() {
    if (!this._domElement) return this.SceneHandler.domElement;
    else {
      return this._domElement;
    }
  }

  addViewToDocument() {
    this._domElement = document.body.appendChild(this.domElement);

    window.addEventListener('resize', this.SceneHandler.resize);

    this.SceneHandler.resize();
  }

  _loadScriptToActive(scriptName, onSuccess, onFail) {
    return this.ScriptCompiler.CompileScript(
      scriptName,
      data => {
        this.ScriptHandler.LoadScript(data);

        if (onSuccess) onSuccess();
      },
      onFail
    );
  }

  /**
   *
   * @param {String} entrypoint Script name (w/o extensions) to start the engine with
   */
  start(entrypoint) {
    if (!entrypoint) {
      entrypoint = 'START_SCRIPT';
    }

    this._loadScriptToActive(
      entrypoint,
      () => {
        this._loadAssetsForScript(
          this.ScriptHandler.activeScript,
          assets => {
            // assets are loaded, start script
            this.ScriptHandler.activeScript.addAssets(assets);
            console.log(this.ScriptHandler.activeScript);
            this.ScriptHandler.NextLine();
            this.SceneHandler.textBox.setupTextboxTextures(
              {
                narrative: this.ScriptHandler.activeScript.getTextbox('narrative').texture,
                dialogue: this.ScriptHandler.activeScript.getTextbox('dialogue').texture,
                novel: this.ScriptHandler.activeScript.getTextbox('novel').texture
              }
            );
            this.SceneHandler.startLoop();
          },
          err => {
            throw new Error(err.reason);
          }
        );
      },
      err => {
        throw new Error(err.reason);
      }
    );
  }

  /**
   *
   * @param {M22Script} scriptObj
   * @param {Function} onSuccess
   * @param {Function} onFail
   * @private
   */
  _loadAssetsForScript(scriptObj, onSuccess, onFail) {
    // unload existing assets to clear memory
    // load new assets
    // run callback
    this.AssetHandler.loadAssetsFromScript(scriptObj, onSuccess, onFail);
  }
}

// if (!global.hasOwnProperty('M22')) {
// 	global.M22 = new March22();
// }

module.exports = March22;
