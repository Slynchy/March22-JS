
// TODO: Implement speed param (param[3])

function Transition() {
	let bg = M22.SceneHandler.AddBackground(this.m_parameters[0]);

	bg.setTransition(M22.SceneHandler.GetTransition(this.m_parameters[1]), this.m_parameters[2], ()=>{
		M22.SceneHandler.ClearOldBackgrounds();
		M22.ScriptHandler.NextLine();
	});

	this.m_skipToNextLine = (this.m_parameters[5] === true);
}

module.exports = Transition;