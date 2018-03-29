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

if(!String.prototype.replaceAll){
	String.prototype.replaceAll = function(search, replacement) {
		let target = this;
		return target.replace(new RegExp(search, 'g'), replacement);
	};
}

class MiscFunction{

	static LoadTextFileAsString(filename, callback, onFail){
		if(!callback) throw new Error("no callback");
		if(!onFail) onFail = ()=>{};

		let client = new XMLHttpRequest();
		client.open('GET', filename);
		client.onload = function() {
			callback(client.responseText);
		};
		client.onerror = function(err){
			console.error(err);
			onFail({reason: 'Failed to get file: ' + filename})
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