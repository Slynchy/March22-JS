let PIXI = require('pixi.js');

/**
 * Hook into _onAssetLoaded and do this.progress to get current load progress
 */
class AssetHandler {

	constructor(){

		// init props
		this.concurrency = 10;
		this._loader = null;

		// use settings
		Object.assign(this, Settings.AssetHandlerSettings);

		// init stuff dependent on settings
		this._loader = new PIXI.loaders.Loader('', this.concurrency);

		this._loader.onComplete.add(this._onSuccess);
		this._loader.onError.add(this._onFail);

		this._progress = 0;

		this._transitions = Settings.transitions;
	}

	get progress(){
		return (this._progress = (this._loader ? this._loader.progress : 0));
	}

	_onFail(){

	}

	_onSuccess(){

	}

	_onAssetLoaded(){};

	_loadedBg(res){
		if(res.error){
			//console.error(res.error);
		}
		//console.log(M22.AssetHandler._loader.progress);
		_onAssetLoaded();
	}

	_loadedChar(res){
		if(res.error){
			//console.error(res.error);
		}
		//console.log(M22.AssetHandler._loader.progress);
		_onAssetLoaded();
	}

	_loadedTransition(res){
		// we have to add them to the scene for the shader to work properly
		M22.SceneHandler.AddTransition(res.name, res.texture);
		_onAssetLoaded();
	}

	_loadedTextbox(res){
		if(res.error){
			//console.error(res.error);
		}
		_onAssetLoaded();
	}

	loadAssetsFromScript(scriptObj, onSuccess, onFail){
		"use strict";
		// ASSETS ARE ALREADY SORTED BY PRIORITY :D
		let result = {
			characters: {},
			backgrounds: {},
			transitions: {},
			videos: {},
			sfx: {},
			textbox: {
                textbox_comment: null,
                textbox_dialogue: null,
                textbox_narrative: null,
                textbox_novel: null
			}
		};

		this._loader.reset();

		// load BGs
		for(let i = 0; i < scriptObj.requiredAssets.backgrounds.length; i++){
			this._loader.add(
				scriptObj.requiredAssets.backgrounds[i],
				"assets/backgrounds/" + scriptObj.requiredAssets.backgrounds[i] + ".jpg",
				this._loadedBg
			);
		}

		// load chars
		for(let i = 0; i < scriptObj.requiredAssets.characters.length; i++){
			this._loader.add(
				scriptObj.requiredAssets.characters[i],
				"assets/characters/" + scriptObj.requiredAssets.characters[i] + ".png",
				this._loadedChar
			);
		}

		// load sfx

		// load video

		// load textboxes
		this._loader.add(
			'textbox_comment',
            'assets/textbox/comment.png',
			this._loadedTextbox
		);
        this._loader.add(
            'textbox_dialogue',
            'assets/textbox/dialogue.png',
            this._loadedTextbox
        );
        this._loader.add(
            'textbox_narrative',
            'assets/textbox/narrative.png',
            this._loadedTextbox
        );
        this._loader.add(
            'textbox_novel',
            'assets/textbox/novel.png',
            this._loadedTextbox
        );

        // Load transitions
		for(let k in this._transitions) {
			this._loader.add(
				k,
				'assets/backgrounds/transitions/' + this._transitions[k],
				this._loadedTransition
			);
		}

		try {
			this._loader.load((loader,resources)=>{
				for(let k in resources){
					let split = resources[k].url.split('/');
					switch(split[1]){
						case 'backgrounds':
							if(split[2] === 'transitions')
								result.transitions[resources[k].name] = resources[k];
							else
								result.backgrounds[resources[k].name] = resources[k];
							break;
						case 'characters':
							result.characters[resources[k].name] = resources[k];
							break;
                        case 'textbox':
                            result.textbox[resources[k].name] = resources[k];
                            break;
					}
				}
				onSuccess(result);
			});
		}
		catch(err) {
			onFail(err);
		}
	}
}

module.exports = AssetHandler;