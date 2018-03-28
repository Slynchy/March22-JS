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
		// TODO: use Settings.debugMode to allow devs to skip anything

		if(M22.SceneHandler.textBox.hasFinishedLine())
			M22.ScriptHandler.NextLine();
		else
			M22.SceneHandler.textBox.finishLine();
	}
}

module.exports = InputHandler;