class InputHandler {
	constructor(){

		if(this.gameMode){
			this.setupGameKeys();
		}
	};

	setupGameKeys(){
        window.addEventListener('keydown', (ev)=>{
            switch(ev.which || ev.keyCode){
                case 13:
                    this.handleNewLine();
                    return;
            }
        });
	}

	handleNewLine(){
		if(M22.SceneHandler.textBox.hasFinishedLine())
			M22.ScriptHandler.NextLine();
		else
			M22.SceneHandler.textBox.finishLine();
	}
}

module.exports = InputHandler;