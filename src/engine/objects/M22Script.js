

class M22Script {

	constructor(){
		this._lines = [];
		this._checkpoints = [];
		this._variables = [];
		this._charNames = [];
	};

	AddLine(line){
		this._lines.push(line);
	}

	get checkpoints(){
		return this._checkpoints;
	}

	set checkpoints(val){
		this._checkpoints = val;
	}

	get variables(){
		return this._variables;
	}

	set variables(val){
		this._variables = val;
	}

	get charNames(){
		return this._charNames;
	}

	set charNames(val){
		this._charNames = val;
	}

	GetLine(index){
		return this._lines[index];
	}

}

module.exports = M22Script;