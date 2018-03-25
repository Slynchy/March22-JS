let LineTypes = require('../LineTypes.js');

class ScriptHandler {
	constructor(){

		this._currentScript = null;

		this._currentLineIndex = -1;
		this._currentLine = null;
	};

	get activeScript(){
		return this._currentScript;
	}

	GotoLine(lineIndex){
		this._currentLineIndex = lineIndex-1;
		this.NextLine();
	}

	Goto(checkpointName){
		this.GotoLine(this._currentScript.checkpoints[checkpointName]);
	}

	NextLine(){
		if(!this._currentScript) {
			console.error("Cannot execute nextline; no active script");
			return;
		}

		if(this._currentScript.length < this._currentLineIndex){
			console.error('Script ended without loading a new script or exiting; make sure to have an exit point!');
			return;
		}

		this._currentLine = this._currentScript.GetLine(++this._currentLineIndex);

		this.ExecuteFunction(this._currentLine);
	}

	LoadScript(file){
		this._currentScript = file;
	}

    /**
	 *
     * @param {line_c} line_c
     * @param {boolean} [isInline]
     * @constructor
     */
	ExecuteFunction(line_c, isInline){
		if(line_c.m_lineType === LineTypes.NARRATIVE){
			M22.SceneHandler.textBox.setText(line_c.m_lineContents);
			return;
		} else if(line_c.m_lineType === LineTypes.DIALOGUE){
            // TODO: handle DIALOGUE
            M22.SceneHandler.textBox.setText(line_c.m_lineContents);
			return;
		}
		line_c.exec();
	}
}

module.exports = ScriptHandler;