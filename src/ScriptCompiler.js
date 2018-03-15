let M22Script = require("./M22Script.js");

if (!String.prototype.hashCode) {
	String.prototype.hashCode = function () {
		let hash = 0, i, chr;
		if (this.length === 0) return hash;
		for (i = 0; i < this.length; i++) {
			chr = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};
}

function LoadTextFileAsString(filename, callback){
	let client = new XMLHttpRequest();
	client.open('GET', filename);
	client.onreadystatechange = function() {
		callback(client.responseText);
	};
	client.send();
}
global.LoadTextFileAsString = LoadTextFileAsString;

function SplitString(string, charToSplit){
	return string.split(charToSplit);
}
global.SplitString = SplitString;

class line_c {
	constructor(props) {
		this.m_lineType = ScriptCompiler.LINETYPES.NULL_OPERATOR;
		this.m_lineTypeSecondary = ScriptCompiler.LINETYPES.NULL_OPERATOR;

		this.m_parameters = [];
		//m_parameters_txt = [];

		this.m_lineContents = {};

		this.m_speaker = "";

		this.m_ID = 0;

		this.m_origScriptPos = 0; // used to tell where it is in the original script

		if (props) {
			Object.assign(this, props);
		}
	}
}

class script_checkpoint {
	constructor(_a, _b) {
		this.m_position = _a;
		this.m_name = _b;
	};
}

class script_character {
	constructor(_a, _b) {
		this.name = _a;
		this.color = _b;
	};
}

class ScriptCompiler {

	get CHAR_NAMES() {
		if (!this._charNames) {
			this._initializeCharNames();
		}
		return this._charNames;
	}

	get FUNC_HASHES() {
		if (!this._funcHashes) {
			this._funcHashes = {};
			for(let k in this.LINETYPES){
				let obj = this.LINETYPES[k];
				this._funcHashes[obj.hashCode()] = obj;
			}

		}
		return this._funcHashes;
	}

	get VARIABLES() {
		if (!this._variables) {
			this._variables = {
				"varName": "varData"
			};
		}
		return this._variables;
	}

	static get LINETYPES() {
		if(!this._lineTypes){
			this._lineTypes = {
				NULL_OPERATOR: "nopnopnop",
				NEW_PAGE: "NewPage",
				NARRATIVE: "thIsIssNarraTIVE",
				DRAW_BACKGROUND: "DrawBackground",
				PLAY_MUSIC: "PlayMusic",
				STOP_MUSIC: "StopMusic",
				PLAY_STING: "PlaySting",
				CHECKPOINT: "--",
				COMMENT: "//",
				SET_ACTIVE_TRANSITION: "SetActiveTransition",
				HIDE_WINDOW: "HideWindow",
				SHOW_WINDOW: "ShowWindow",
				DIALOGUE: "DiAlOGUeHeRe",
				DRAW_CHARACTER: "DrawCharacter",
				TRANSITION: "Transition",
				CLEAR_CHARACTERS: "ClearCharacters",
				CLEAR_CHARACTER: "ClearCharacter",
				EXECUTE_FUNCTION: "ExecuteFunction",
				GOTO: "Goto",
				WAIT: "Wait",
				ENABLE_NOVEL_MODE: "EnableNovelMode",
				DISABLE_NOVEL_MODE: "DisableNovelMode",
				MAKE_DECISION: "MakeDecision",
				IF_STATEMENT: "m22IF",
				SET_FLAG: "SetFlag",
				LOAD_SCRIPT: "LoadScript",
				PLAY_VIDEO: "PlayVideo",
				MOVEMENT_SPEED: "SetMovementSpeed",
				TEXT_SPEED: "SetTextSpeed",
				ANIMATION_TYPE: "SetAnimationType",
				PLAY_SFX_LOOPED: "PlayLoopedSting",
				STOP_SFX_LOOPED: "StopLoopedSting",
				NUM_OF_LINETYPES: ""
			};
		}

		return this._lineTypes;
	};

	static get ANIMATION_TYPES() {
		return {
			SMOOTH: 0,
			LERP: 1,
			NUM_OF_ANIMATION_TYPES
		};
	}

	static IsNewLine(_s) {
		return (_s === "\r\n" || _s === "\n");
	}

	static IsComment(_s) {
		if (_s.length === 0) return true;
		if (_s.length === 1) return false;
		_s = _s.trim();

		return (_s[0] === '/' && _s[1] === '/');
	}

	_initializeCharNames() {
		this._charNames = {};

		// TODO: _initializeCharNames
		// Load CHARACTER_NAMES.txt
		// Add /n/n to end of file
		// Sort into array of lines
		// For each line
			// add a character name + hash to array
			// also add character name color to somewhere
	}

	static GetLineType(_s) {
		_s = _s.trim();
		let hash = _s.hashCode();

		if(this.FUNC_HASHES.hasOwnProperty(hash)){
			return this.FUNC_HASHES[hash];
		} else {
			if(_s.length > 1){
				if(_s[0] === '-' && _s[1] === '-'){
					return this.FUNC_HASHES.CHECKPOINT;
				} else if(_s[0] === '/' && _s[1] === '/'){
					return this.FUNC_HASHES.COMMENT;
				} else {
					if(this.CHAR_NAMES.hasOwnProperty(hash)){
						return this.CHAR_NAMES[hash];
					} else {
						return this.FUNC_HASHES.NARRATIVE;
					}
				}
			} else {
				return this.FUNC_HASHES.NARRATIVE;
			}
		}
	}

	static _replaceVariablesInLine(line, variables){
		// TODO: _replaceVariablesInLine
	}

	static _processVariablesFile(variables){
		// TODO: _processVariablesFile
		return variables;
	}

	static CompileScript(filename, callback){
		// TODO: CompileScript

		let result = new M22Script();

		LoadTextFileAsString('./scripts/VARIABLES.txt', (variables)=>{

			variables = this._processVariablesFile(variables);

			LoadTextFileAsString('./scripts/' + filename + '.txt', (scriptFile)=>{

				if(scriptFile.length === 0){
					callback(result);
					return;
				}

				scriptFile = SplitString(scriptFile, '\n');

				for(let i = 0; i < scriptFile.length; i++){
					let currentLine = scriptFile[i];

					for (let k in variables)
					{
						let tempStr = "[[" + k + "]]";
						currentLine = currentLine.replace(tempStr, variables[k]);
					}

					result.AddLine(currentLine);
				}

				callback(result);
			});
		});

		// Load variables/flags file (?)
		// Load script file as string
			// if length === 0 throw error
		// Split script file by lines
		// Iterate over lines
			// replace variables
			// compile line
			// Add compiled line to the M22Script object
		// Return script
	}

	static CompileLine(_funcStr, _scriptPos) {
		let CURRENT_LINE_SPLIT = [];
		let tempLine_c = new line_c();
		_funcStr = _funcStr.trim();

		if (ScriptCompiler.IsNewLine(_funcStr)) {
			return tempLine_c;
		}
		else if (_funcStr.Length === 0 || (ScriptCompiler.IsComment(_funcStr))) {
			return tempLine_c;
		}

		CURRENT_LINE_SPLIT = SplitString(_funcStr, ' ');
		if (CURRENT_LINE_SPLIT.Count === 0) return tempLine_c;
		tempLine_c.m_origScriptPos = _scriptPos + 1;
		tempLine_c.m_lineType = ScriptCompiler.GetLineType(CURRENT_LINE_SPLIT[0]);

		if (tempLine_c.m_lineType === ScriptCompiler.LINETYPES.NARRATIVE) {
			_funcStr = _funcStr.replace("\\n", "\n");
			tempLine_c.m_lineContents = _funcStr;
		}
		else if (tempLine_c.m_lineType === ScriptCompiler.LINETYPES.DIALOGUE) {
			tempLine_c.m_lineContents = _funcStr;
			tempLine_c.m_lineContents = tempLine_c.m_lineContents.substr(CURRENT_LINE_SPLIT[0].Length + 1);

			if (M22 && M22.ScriptCompiler) {
				let hash = CURRENT_LINE_SPLIT[0].hashCode();
				for (let k in M22.ScriptCompiler.CHAR_NAMES) {
					if (k === hash) {
						tempLine_c.m_speaker = M22.ScriptCompiler.CHAR_NAMES[k];
						break;
					}
				}
			} else {
				throw new Error("No global-space M22 or M22.ScriptCompiler");
			}
		}
		else {
			//CompileLine(tempLine_c, CURRENT_LINE_SPLIT, currentScript_checkpoints, _scriptPos);
		}
		return tempLine_c;
	}

	constructor() {
		// Init these constants; not needed but good to do here
		this._funcHashes = this.FUNC_HASHES;
		this._charNames = this.CHAR_NAMES;
		this._variables = this.VARIABLES;
	};

}

module.exports = global.M22.ScriptCompiler = new ScriptCompiler();