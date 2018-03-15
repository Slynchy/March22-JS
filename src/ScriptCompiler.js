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
	client.onload = function() {
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

		this.m_lineContents = "";

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

	static CHAR_NAMES() {
		if (!this._charNames) {
			return {};
		}
		return this._charNames;
	}

	static get FUNC_HASHES() {
		if (!this._funcHashes) {
			this._funcHashes = {};
			for(let k in this.LINETYPES){
				let obj = this.LINETYPES[k];
				this._funcHashes[obj.hashCode()] = obj;
			}

		}
		return this._funcHashes;
	}

	static get VARIABLES() {
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
		return (_s === "\r\n" || _s === "\n" || _s === '');
	}

	static IsComment(_s) {
		if (_s.length === 0) return true;
		if (_s.length === 1) return false;
		_s = _s.trim();

		return (_s[0] === '/' && _s[1] === '/');
	}

	static _processCharNamesFile(_charNames) {
		this._charNames = {};

		_charNames += "\n\n"; // hack

		let lines = _charNames.split('\n');

		for(let i = 0; i < lines.length; i++){
			let line = lines[i].trim();

			if(line.length < 2) continue;

			let split = line.split(' ');

			for(let k in split){
				split[k] = split[k].trim();
			}


			if(split.length < 5) continue;

			this._charNames[split[0].hashCode()] = {
				name: split[1],
				color: {
					r: parseInt(split[2]),
					g: parseInt(split[3]),
					b: parseInt(split[4])
				}
			};
		}

		return this._charNames;

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
					return this.FUNC_HASHES[this.LINETYPES.CHECKPOINT.hashCode()];
				} else if(_s[0] === '/' && _s[1] === '/'){
					return this.FUNC_HASHES[this.LINETYPES.COMMENT.hashCode()];
				} else {
					if(this.CHAR_NAMES.hasOwnProperty(hash)){
						return this.CHAR_NAMES[hash];
					} else {
						return this.FUNC_HASHES[this.LINETYPES.NARRATIVE.hashCode()];
					}
				}
			} else {
				return this.FUNC_HASHES[this.LINETYPES.NARRATIVE.hashCode()];
			}
		}
	}

	static _replaceVariablesInLine(line, variables){
		for (let k in variables)
		{
			let tempStr = "[[" + k + "]]";
			line = line.replace(tempStr, variables[k]);
		}
		return line;
	}

	static _processVariablesFile(variables){
		let output = {};

		let lines = variables.split('\n');

		for(let i = 0; i < lines.length; i++){
			let line = lines[i];

			line = line.trim();

			if(line.length < 2) continue;

			let split = line.split('===');

			for(let k in split){
				split[k] = split[k].trim();
			}

			if(split.length < 2) continue;

			output[split[0]] = split[1];
		}

		// split file by newline
		// for each line:
			// trim
			// Check if empty
			// split each line by ===
			// trim that
			// Add key + data to array
		// return array

		return output;
	}

	static CompileScript(filename, callback){
		let start = Date.now();

		let result = new M22Script();

		LoadTextFileAsString('./scripts/CHARACTER_NAMES.txt', (charNames)=> {

			charNames = this._processCharNamesFile(charNames);

			LoadTextFileAsString('./scripts/VARIABLES.txt', (variables) => {

				variables = this._processVariablesFile(variables);

				LoadTextFileAsString('./scripts/' + filename + '.txt', (scriptFile) => {

					if (scriptFile.length === 0) {
						callback(result);
						return;
					}

					scriptFile = SplitString(scriptFile, '\n');

					let checkpoints = [];

					let lineCounter = 0;
					for (let i = 0; i < scriptFile.length; i++) {
						let currentLine = scriptFile[i];

						currentLine = currentLine.trim();

						currentLine = this._replaceVariablesInLine(currentLine, variables);

						currentLine = this.CompileLine(currentLine, i, checkpoints);

						if (currentLine.m_lineType !== this.LINETYPES.NULL_OPERATOR) {
							currentLine.m_ID = ++lineCounter;
							result.AddLine(currentLine);
						}
					}

					result.checkpoints = checkpoints;
					result.variables = variables;
					result.charNames = charNames;

					console.log("Script compile took %ims", Date.now() - start);

					callback(result);
				});
			});
		});
	}

	static CompileLine(_funcStr, _scriptPos, _chkpnt) {
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
			this.CompileFunction(tempLine_c, CURRENT_LINE_SPLIT, _chkpnt, _scriptPos);

		}
		return tempLine_c;
	}

	static CompileFunction(_lineC, _splitStr, _chkpnt, _scriptPos){
		switch (_lineC.m_lineType)
		{
			case this.LINETYPES.CHECKPOINT:
				_splitStr[0] = _splitStr[0].substring(2);
				_splitStr[0] = _splitStr[0].trim();
				_chkpnt.push(new script_checkpoint(_scriptPos, _splitStr[0]));
				break;
			case this.LINETYPES.ANIMATION_TYPE:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_splitStr[1] = _splitStr[1].toLowerCase();
					if (_splitStr[1] === ("lerp"))
					{
						_lineC.m_parameters.push(_splitStr[1]);
					}
					else if (_splitStr[1] === ("smooth"))
					{
						_lineC.m_parameters.push(_splitStr[1]);
					}
					else
					{
						console.error("Invalid animation type at line {0}!", _lineC.m_origScriptPos);
						_lineC.m_parameters.push('lerp');
					}
				}
				break;
			case this.LINETYPES.TEXT_SPEED:
			case this.LINETYPES.MOVEMENT_SPEED:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_lineC.m_parameters.push(_splitStr[1]);
				}
				break;
			case this.LINETYPES.SET_ACTIVE_TRANSITION:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_splitStr[1] = _splitStr[1].trim();
					_lineC.m_parameters.push(_splitStr[1]);
				}
				break;
			case this.LINETYPES.GOTO:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_splitStr[1] = _splitStr[1].trim();
					_lineC.m_parameters.push(_splitStr[1]);
				}
				break;
			case this.LINETYPES.NEW_PAGE:
				break;
			case this.LINETYPES.DRAW_CHARACTER:
				if (_splitStr.length > 1)
				{
					if (_splitStr.length < 4) console.error("Not enough parameters for DrawCharacter @ Line %s", _lineC.m_origScriptPos.toString());
					_lineC.m_parameters = [];
					_lineC.m_parameters.push(_splitStr[1]);
					_lineC.m_parameters.push(_splitStr[2]);
					_lineC.m_parameters.push(parseInt(_splitStr[3]));
					if(_splitStr.length >= 5)
					{
						if(_splitStr[4] === ("true"))
							_lineC.m_parameters.push(true);
						else
							_lineC.m_parameters.push(false);
					}
					else
						_lineC.m_parameters.push(false);

					// TODO: implement character loading?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if (!M22.VNHandler.LoadCharacter(_lineC.m_parameters_txt[0], _lineC.m_parameters_txt[1]))
						// {
						// 	UnityWrapper.LogErrorFormat("Failed to load character \"{0}\" at line {1}!", (_lineC.m_parameters_txt[0] + " - " + _lineC.m_parameters_txt[1]), _lineC.m_origScriptPos);
						// };
				}
				break;
			case this.LINETYPES.WAIT:
				_lineC.m_parameters = [];
				if (_splitStr.length > 1)
					_lineC.m_parameters.push(parseInt(_splitStr[1]));
				else
					_lineC.m_parameters.push(1000);
				break;
			case this.LINETYPES.CLEAR_CHARACTERS:
				_lineC.m_parameters = [];
				if (_splitStr.length > 1 && _splitStr[1] === ("true"))
				{
					_lineC.m_parameters.push(true);
				}
				else
					_lineC.m_parameters.push(false);
				break;
			case this.LINETYPES.PLAY_STING:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_splitStr[1] = _splitStr[1].trim();
					_lineC.m_parameters.push(_splitStr[1]);

					// TODO: implement audio loading?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if (!M22.AudioMaster.LoadSting(_lineC.m_parameters_txt[0]))
						// {
						// 	UnityWrapper.LogError("Failed to load sting! - " + _lineC.m_parameters_txt[0]);
						// };
				}
				break;
			case this.LINETYPES.PLAY_MUSIC:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_splitStr[1] = _splitStr[1].trim();
					_lineC.m_parameters.push(_splitStr[1]);

					// TODO: implement music loading?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if (!M22.AudioMaster.LoadMusic(_lineC.m_parameters_txt[0]))
						// {
						// 	UnityWrapper.LogErrorFormat("Failed to load music file \"{0}\" at line {1}!", _lineC.m_parameters_txt[0], _lineC.m_origScriptPos);
						// };
				}
				break;
			case this.LINETYPES.EXECUTE_FUNCTION:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					for (let i = 1; i < _splitStr.length-1; i++)
					{
						_lineC.m_parameters.push(_splitStr[i]);
					}
					_splitStr[_splitStr.length - 1] = _splitStr[_splitStr.length - 1].trim();
					_lineC.m_parameters.push(_splitStr[_splitStr.length - 1]);

					// should be 4
					while(_lineC.m_parameters.length < 4)
						_lineC.m_parameters.push(null);

					// TODO: implement custom funcs?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if(CustomFunctionHandler.CheckFunctionExists(_lineC.m_parameters_txt[0]) == false)
						// {
						// 	UnityWrapper.LogErrorFormat("Custom function \"{0}\" does not exist at line {1}!", _lineC.m_parameters_txt[0], _lineC.m_origScriptPos);
						// }
				}
				break;
			case this.LINETYPES.STOP_MUSIC:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_lineC.m_parameters.push(_splitStr[1]);
				}
				// we store the float value as a string for later use, if provided.
				// otherwise, just continue
				break;
			case this.LINETYPES.TRANSITION:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					for (let i = 1; i < _splitStr.length; i++)
					{
						_lineC.m_parameters.push(_splitStr[i]);
					}

					// TODO: Implement background loading?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if (!M22.BackgroundMaster.LoadBackground(_lineC.m_parameters_txt[0]))
						// {
						// 	UnityWrapper.LogErrorFormat("Failed to load background - \"{0}\"", _lineC.m_parameters_txt[0]);
						// 	// failed to load bg!
						// };
				}
				break;
			case this.LINETYPES.DRAW_BACKGROUND:
				if (_splitStr.length >= 2)
				{
					_lineC.m_parameters = [];
					_lineC.m_parameters.push(_splitStr[1]);
					if (_splitStr.length >= 3)
					{
						_lineC.m_parameters.push(parseInt(_splitStr[2]));
						if (_splitStr.length >= 4)
							_lineC.m_parameters.push(parseInt(_splitStr[3]));
						if (_splitStr.length >= 5)
							_lineC.m_parameters.push(_splitStr[4]);
						if (_splitStr.length >= 6)
							_lineC.m_parameters.push(_splitStr[5]);
					}
					else
					{
						_lineC.m_parameters.push(0);
						_lineC.m_parameters.push(0);
						_lineC.m_parameters.push("1.0");
						_lineC.m_parameters.push("1.0");
					}

					if (_splitStr[_splitStr.length-1] === ("true"))
						_lineC.m_parameters.push(true);
					else
						_lineC.m_parameters.push(false);

					// TODO: Implement background loading?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if (!M22.BackgroundMaster.LoadBackground(_lineC.m_parameters_txt[0]))
						// {
						// 	UnityWrapper.LogErrorFormat("Failed to load background \"{0}\" at line {1}", _lineC.m_parameters_txt[0], _lineC.m_origScriptPos);
						// };
				}
				else
					console.error("Not enough parameters on DrawBackground at line %i", _lineC.m_origScriptPos);
				break;
			case this.LINETYPES.ENABLE_NOVEL_MODE:
				break;
			case this.LINETYPES.DISABLE_NOVEL_MODE:
				break;
			case this.LINETYPES.PLAY_VIDEO:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters = [];
					_lineC.m_parameters.push(_splitStr[1]);

					// TODO: Implement video file loading?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if(M22.ScriptMaster.LoadVideoFile(_splitStr[1]) == false)
						// {
						// 	UnityWrapper.LogError("Failed to load video file: " + _splitStr[1]);
						// }
				}
				break;
			case this.LINETYPES.CLEAR_CHARACTER:
				if (_splitStr.length >= 2)
				{
					_lineC.m_parameters = [];
					_lineC.m_parameters.push(_splitStr[1]);
					if (_splitStr.length >= 3)
					{
						if (_splitStr[2] === ("true"))
							_lineC.m_parameters.push(true);
						else
							_lineC.m_parameters.push(false);
					}
					else
						_lineC.m_parameters.push(false);
				}
				break;
			case this.LINETYPES.LOAD_SCRIPT:
			case this.LINETYPES.HIDE_WINDOW:
			case this.LINETYPES.SHOW_WINDOW:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters.push(_splitStr[1]);
				}
				break;
			case this.LINETYPES.SET_FLAG:
				if (_splitStr.length > 1)
				{
					_splitStr[1] = _splitStr[1].trim();
					_lineC.m_parameters.push(_splitStr[1]);
				}
				break;
			case this.LINETYPES.IF_STATEMENT:
				// m22IF _flag_to_check_if_true Command [params]
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters.push(_splitStr[1]);

					let tempCompiledLine = new line_c();
					let functionSplit = [];
					for (let i = 2; i < _splitStr.length; i++)
					{
						functionSplit.push(_splitStr[i]);
					}
					tempCompiledLine.m_lineType = this.GetLineType(_splitStr[2]);

					tempCompiledLine = this.CompileFunction(tempCompiledLine, functionSplit, _chkpnt, _scriptPos);

					if(tempCompiledLine.m_lineContents == null)
					{
						tempCompiledLine.m_lineContents = "";
						for (let i = 2; i < _splitStr.length; i++)
						{
							tempCompiledLine.m_lineContents += _splitStr[i] + " ";
						}
					}
					tempCompiledLine.m_lineContents = tempCompiledLine.m_lineContents.replace("\\n", "\n");
					_lineC.m_lineContents = tempCompiledLine.m_lineContents;
					_lineC.m_lineTypeSecondary = tempCompiledLine.m_lineType;

					if(tempCompiledLine.m_parameters.length !== 0)
					{
						for (let i = 0; i < tempCompiledLine.m_parameters.length; i++)
						{
							_lineC.m_parameters.push(tempCompiledLine.m_parameters[i]);
						}
					}
				}
				break;
			case this.LINETYPES.PLAY_SFX_LOOPED:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters.push(_splitStr[1]);

					if(_splitStr.length > 3)
					{
						_lineC.m_parameters.push(_splitStr[2]);
						_lineC.m_parameters.push(_splitStr[3]);
					}
					else
					{
						_lineC.m_parameters.push("1.0");
						_lineC.m_parameters.push("1.0");
					}

					// TODO: Implement audio file loading?
					console.warn("" + _lineC.m_lineType + " not fully implemented");
						// if (!M22.AudioMaster.LoadSting(_lineC.m_parameters_txt[0]))
						// {
						// 	UnityWrapper.LogError("Failed to load sting! - " + _lineC.m_parameters_txt[0]);
						// };
				}
				break;
			case this.LINETYPES.STOP_SFX_LOOPED:
				if (_splitStr.length > 1)
				{
					_lineC.m_parameters.push(_splitStr[1]);

					// if(AudioMaster.IsAudioLoaded(_splitStr[1]) == false)
					// {
					// 	UnityWrapper.LogWarningFormat("Stopping a looped SFX that isn't played/loaded yet at line {0}; this shouldn't happen!", _lineC.m_origScriptPos);
					// }

					if(_splitStr.length > 2)
					{
						_lineC.m_parameters.push(_splitStr[2]);
					}
					else
					{
						_lineC.m_parameters.push("1.0");
					}
				}
				break;
			case this.LINETYPES.MAKE_DECISION:
				if (_splitStr.length > 1)
				{
					let reconstructed = "";
					for (let i = 0; i < _splitStr.length; i++)
					{
						reconstructed += _splitStr[i] + " ";
					}
					let splitByQuote = reconstructed.split('\"');

					// Should be 5 or 7
					if(splitByQuote.length !== 5 && splitByQuote.length !== 7)
					{
						console.error("MakeDecision error; mismatched number of quotemarks!");
					}

					for (let i = 1; i < splitByQuote.length; i++)
					{
						splitByQuote[i] = splitByQuote[i].trim();
						_lineC.m_parameters.push(splitByQuote[i]);
					}

					// up to 6 parameters
					// flags do not use "" but the text string does
					// i.e. MakeDecision "Choice 1" choice_1 "Choice 2" choice_2 "Choice 3" choice_3
					// if(num of quotemarks != 6) mismatch error
					//
					// This means splitStr is useless cus of spaces, and will need to be re-split in terms of " marks
					// i.e. splitStr[0] == "MakeDecision ";
					// splitStr[1] == "Choice 1";
					// splitStr[2] == " choice_1 ";
				}
				break;
		}

		return _lineC;
	}

	constructor() {
		// Init these constants; not needed but good to do here
		this._funcHashes = this.FUNC_HASHES;
		this._charNames = this.CHAR_NAMES;
		this._variables = this.VARIABLES;
	};

}

module.exports = global.M22.ScriptCompiler = ScriptCompiler;