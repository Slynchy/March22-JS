class Settings {
	constructor(){

		this.applicationSettings = {
			width: 800,
			height: 600,
			sharedTicker: true,
			autoStart: false,
			backgroundColor: 0x000000,
			scaleMode: 0, // 0 == linear, 1 == nearest

			// unneeded
			antialias: true,
			roundPixels: false,
			renderScale: 1
		};

		this.debugMode = true;

		this.gameMode = true;

		this.AssetHandlerSettings = {

			/**
			 * If true, assetloader will replace unloadable textures/assets with empty ones, so the game still runs
			 */
			safeMode: true,
			concurrency: 10,
		};

		this.textbox = {
			yOffset: -15,
			nameFontSize: 22,
		};

		this.transitionUpdateRate = 16.6667;

		this.transitions = {
			'tr_eyes' : 'tr_eyes.png',
			'tr-checkwipe' : 'tr-checkwipe.png',
			'tr-checkwipe2' : 'tr-checkwipe2.png',
			'tr-clockwipe' : 'tr-clockwipe.png',
			'tr-delayblinds' : 'tr-delayblinds.png',
			'tr-dots_col' : 'tr-dots_col.png',
			'tr-flashback' : 'tr-flashback.png',
			'tr-letter' : 'tr-letter.png',
			'tr-openshock' : 'tr-openshock.png',
			'tr-pronoise' : 'tr-pronoise.png',
			'tr-softwipe' : 'tr-softwipe.png',
			'tr-whipeh' : 'tr-wipeh.png'
		};
	}
}

if(!global.hasOwnProperty('Settings')){
	global.Settings = new Settings();
}

module.exports = global.Settings;