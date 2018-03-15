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

class MiscFunction{

	static LoadTextFileAsString(filename, callback){
		if(!callback) throw new Error("no callback");

		let client = new XMLHttpRequest();
		client.open('GET', filename);
		client.onload = function() {
			callback(client.responseText);
		};
		client.send();
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

}

module.exports = MiscFunction;