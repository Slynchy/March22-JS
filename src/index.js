import './styles/style.css';

require('./Settings.js');

(function(){
	let M22 = new (require('./engine/March22.js'))();

	M22.addViewToDocument();
	M22.start();
})();
