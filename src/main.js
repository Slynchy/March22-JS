global.M22 = {};
require('./ScriptCompiler.js');

M22.ScriptCompiler.CompileScript('START_SCRIPT', (data)=>{
	document.write(JSON.stringify(data));
	console.log(data);
});