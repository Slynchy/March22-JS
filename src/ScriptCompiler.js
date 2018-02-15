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

	// Dictionary<ulong, script_character> CharacterNames;
	get CHAR_NAMES() {
		if (!this._charNames) {
			this._initializeCharNames();
		}
		return this._charNames;
	}

	get FUNC_HASHES() {
		if (!this._funcHashes) {
			// generate hashes
			this._funcHashes = {
				123123123: "FunctionName"
			};
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
		return {
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

		// string tempStr = UnityWrapper.LoadTextFileAsString("CHARACTER_NAMES");
		// tempStr += "\n\n"; // <- hack to fix last line being cut off
		//
		// string[] lines = tempStr.Split(new string[] { "\n", "\r\n" }, StringSplitOptions.RemoveEmptyEntries);
		//
		// foreach (string line in lines)
		// {
		// 	string[] lineSplit = line.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries);
		// 	string shortName = lineSplit[0];
		// 	string longName = Regex.Match(line, "\"([^\"]*)\"").ToString();
		//
		// 	script_character temp = new script_character();
		// 	temp.name = longName.Substring(1,longName.Length-2);
		// 	temp.color = new UnityWrapper.Color32(
		// 		(byte)Int32.Parse(lineSplit[lineSplit.Length-3]),
		// 	(byte)Int32.Parse(lineSplit[lineSplit.Length - 2]),
		// 	(byte)Int32.Parse(lineSplit[lineSplit.Length - 1]),
		// 	(byte)255
		// );
		//
		// 	CharacterNames.Add(CalculateHash(shortName), temp);
		// }
	}

	static GetLineType(_s) {
		throw new Error("Not yet implemented");
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

		SplitString(_funcStr, CURRENT_LINE_SPLIT, ' ');
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
		this._funcHashes = this.FUNC_HASHES;
		this._charNames = this.CHAR_NAMES;

		// if (FunctionNames.Length != (int)M22.LINETYPE.NUM_OF_LINETYPES)
		// UnityWrapper.LogError("Number of LINETYPE entries do not match number of FunctionNames");
		//
		// for (int i = 0; i < FunctionNames.Length; i++)
		// {
		// 	FunctionHashes.Add(CalculateHash(FunctionNames[i]), (M22.LINETYPE)i);
		// }
	};

}

module.exports = new ScriptCompiler();