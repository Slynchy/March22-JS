

class line_c {
	constructor(props) {
		this.m_lineType = M22.ScriptCompiler.LINETYPES.NULL_OPERATOR;
		this.m_lineTypeSecondary = null;

		this.m_parameters = [];

		this.m_lineContents = "";

		this.m_speaker = "";

		this.m_ID = 0;

		this.m_origScriptPos = 0; // used to tell where it is in the original script

		this.m_requiredAssets = [];

		this.exec = ()=>{};

		if (props) {
			Object.assign(this, props);
		}
	}

	setFunction(func){
		this.exec = func.bind(this);
	}
}

module.exports = line_c;