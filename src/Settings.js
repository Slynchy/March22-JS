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

		this.AssetHandlerSettings = {

			/**
			 * If true, assetloader will replace unloadable textures/assets with empty ones, so the game still runs
			 */
			safeMode: false,
			concurrency: 10,
		}
	}
}

if(!global.hasOwnProperty('Settings')){
	global.Settings = new Settings();
}

module.exports = global.Settings;