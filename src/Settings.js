class Settings {
	constructor() {
		this.applicationSettings = {
			width: 800,
			height: 600,
			sharedTicker: true,
			autoStart: false,
			backgroundColor: 0x000000,
			scaleMode: 0, // 0 == linear, 1 == nearest
			PRECISION_FRAGMENT: 'highp',
			deltaMultiplier: null,
			targetFPS: 60,

			// unneeded
			antialias: true,
			roundPixels: false,
			renderScale: 1
		};
		this.applicationSettings.deltaMultiplier = 1000 / this.applicationSettings.targetFPS;

		this.debugMode = false;

		this.gameMode = true;

		this.AssetHandlerSettings = {
			/**
			 * If true, assetloader will replace unloadable textures/assets with empty ones, so the game still runs
			 */
			safeMode: true,
			concurrency: 10
		};

		this.textbox = {
			yOffset: -15,
			nameFontSize: 22
		};

		this.functionSettings = {
			DrawBackground: {
				transitionSpeed: 0.01,
				preDrawDelay: 500, // Delay between function start and fadein animation
				postDrawDelay: 1 // Delay between finishing fadein animation and starting the next function
			},
			Transition: {
				postDrawDelay: 500
			},
			DrawCharacter: {
				scale: 1.0,
				transitionSpeed: 0.01,
				postDrawDelay: 1
			}
		};

		this.loader = {
			concurrentItems: 10 // Number of items to load in parallel
		};

		this.transitions = {
			tr_eyes: 'tr_eyes.png',
			'tr-checkwipe': 'tr-checkwipe.png',
			'tr-checkwipe2': 'tr-checkwipe2.png',
			'tr-clockwipe': 'tr-clockwipe.png',
			'tr-delayblinds': 'tr-delayblinds.png',
			'tr-dots_col': 'tr-dots_col.png',
			'tr-flashback': 'tr-flashback.png',
			'tr-letter': 'tr-letter.png',
			'tr-openshock': 'tr-openshock.png',
			'tr-pronoise': 'tr-pronoise.png',
			'tr-softwipe': 'tr-softwipe.png',
			'tr-whipeh': 'tr-wipeh.png',
			'tr-normal': 'tr-normal.png',
			'tr-normal_reversed': 'tr-normal_reversed.png'
		};
	}
}

if (!global.hasOwnProperty('Settings')) {
	global.Settings = new Settings();
}

module.exports = global.Settings;
