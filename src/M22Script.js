

class M22Script {

	constructor(){
		this._lines = [];
	};

	AddLine(line){
		this._lines.push(line);
	}

	GetLine(index){
		return this._lines[index];
	}

}

module.exports = global.M22.M22Script = M22Script;