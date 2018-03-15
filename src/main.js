require('./Settings.js');
require('./engine/March22.js');

M22.ScriptCompiler.CompileScript('START_SCRIPT', (data)=>{
	document.body.appendChild(M22.SceneHandler.domElement);
	console.log(data);
});