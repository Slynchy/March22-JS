class InputHandler {
	constructor(engine) {
		this._engine = engine;
		this._inputInitialized = false;

		if (Settings.gameMode) {
			this.setupGameKeys();
		}
	}

	isInitialized() {
		return this._inputInitialized;
	}

	setupGameKeys() {
		if (this._inputInitialized) {
			console.warn('InputHandler.setupGameKeys() - Input is already initialized!');
			return;
		}

		this._inputInitialized = true;

		window.addEventListener('keydown', ev => {
			switch (ev.which || ev.keyCode) {
			case 13:
				this.handleNewLine();
				return;
			}
		});
	}

	handleNewLine() {
		if (this._engine.SceneHandler.textBox.hasFinishedLine()) {
			if (
				this._engine.ScriptHandler.currentLine.m_lineType ===
					this._engine.ScriptCompiler.LINETYPES.NARRATIVE ||
				this._engine.ScriptHandler.currentLine.m_lineType ===
					this._engine.ScriptCompiler.LINETYPES.DIALOGUE ||
				Settings.debugMode === true
			) {
				this._engine.ScriptHandler.NextLine();
			}
		} else this._engine.SceneHandler.textBox.finishLine();
	}
}

module.exports = InputHandler;
