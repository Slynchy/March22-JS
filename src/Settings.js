class Settings {
	constructor(){

		this.applicationSettings = {
			width: 1280,
			height: 720,
			sharedTicker: true,
			autoStart: false,
			backgroundColor: 0x000000,
			scaleMode: 0, // 0 == linear, 1 == nearest

			// unneeded
			antialias: true,
			roundPixels: false,
			renderScale: 1
		};
	}
}

module.exports = global.Settings = Settings;