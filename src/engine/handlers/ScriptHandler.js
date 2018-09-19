let LineTypes = require('../LineTypes.js');

class ScriptHandler {
	constructor(engine) {
		this._currentScript = null;

		this._engine = engine;
		this._currentLineIndex = -1;
		this._currentLine = null;
	}

	get activeScript() {
		return this._currentScript;
	}

	GotoLine(lineIndex) {
		this._currentLineIndex = lineIndex - 1;
		this.NextLine();
	}

	Goto(checkpointName) {
		let found = false;
		for (let i = 0; i < this._currentScript.checkpoints.length; i++) {
			let curr = this._currentScript.checkpoints[i];
			if (curr.m_name === checkpointName) {
				found = i;
				break;
			}
		}
		if (!found) throw new Error("goto failed, checkpoint doesn't exist");

		// if (!this._currentScript.checkpoints.hasOwnProperty(checkpointName))
		// 	throw new Error('Goto failed; checkpoint doesnt exist!');

		this.GotoLine(this._currentScript.checkpoints[found].m_position);
	}

	NextLine() {
		if (!this._currentScript) {
			throw new Error('Cannot execute nextline; no active script');
		}

		if (this._currentLineIndex >= this._currentScript.length) {
			console.error(
				'Script ended without loading a new script or exiting; make sure to have an exit point!'
			);
			return;
		}

		this._currentLine = this._currentScript.GetLine(++this._currentLineIndex);

		this.ExecuteFunction(this._currentLine);
	}

	LoadScript(file) {
		this._currentScript = file;
	}

	/**
	 * Gets the current line as a read-only data object (i.e. the .exec() will be unusable)
	 * @returns {Object}
	 */
	get currentLine() {
		return JSON.parse(JSON.stringify(this._currentLine));
	}

	/**
	 *
	 * @param {line_c} line_c
	 * @param {boolean} [isInline]
	 * @constructor
	 */
	ExecuteFunction(line_c, isInline) {
		/*
			Just to make the shitting compiler shut up
		 */
		if (isInline) isInLine = !!isInLine;

		if (line_c.m_lineType === LineTypes.NARRATIVE) {
			this._engine.SceneHandler.textBox.setTextbox(
				this._engine.ScriptHandler.activeScript.getTextbox('narrative').texture
			);
			this._engine.SceneHandler.textBox.setText(line_c.m_lineContents);
			this._engine.SceneHandler.textBox.clearSpeaker();
			return;
		} else if (line_c.m_lineType === LineTypes.DIALOGUE) {
			this._engine.SceneHandler.textBox.setTextbox(
				this._engine.ScriptHandler.activeScript.getTextbox('dialogue').texture
			);
			this._engine.SceneHandler.textBox.setText(line_c.m_lineContents);
			this._engine.SceneHandler.textBox.setSpeaker(line_c.m_speaker);
			return;
		}

		line_c.exec(this._engine);
	}
}

module.exports = ScriptHandler;
