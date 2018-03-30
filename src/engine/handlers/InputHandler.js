class InputHandler {
	constructor(){

		this._inputInitialized = false;

		if(Settings.gameMode){
			this.setupGameKeys();
		}
	};

	isInitialized(){
		return this._inputInitialized;
	}

	setupGameKeys(){
		if(this._inputInitialized){
			console.warn("InputHandler.setupGameKeys() - Input is already initialized!");
			return;
		}

		this._inputInitialized = true;

        window.addEventListener('keydown', (ev)=>{
            switch(ev.which || ev.keyCode){
                case 13:
                    this.handleNewLine();
                    return;
            }
        });
	}

	handleNewLine(){
		if(M22.SceneHandler.textBox.hasFinishedLine()){
			if(
				M22.ScriptHandler.currentLine.m_lineType === M22.ScriptCompiler.LINETYPES.NARRATIVE ||
				M22.ScriptHandler.currentLine.m_lineType === M22.ScriptCompiler.LINETYPES.DIALOGUE  ||
				Settings.debugMode === true
			){
				M22.ScriptHandler.NextLine();
			}
		}
		else
			M22.SceneHandler.textBox.finishLine();
	}
}

module.exports = InputHandler;