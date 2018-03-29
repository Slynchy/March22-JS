
// TODO: Evaluate the deprecation of Transition.js if DrawBackground is functionally similar
function DrawBackground() {
    let bg = M22.SceneHandler.AddBackground(this.m_parameters[0]);

	bg.setTransition(M22.SceneHandler.GetTransition('tr-normal'), false, ()=>{
		M22.SceneHandler.ClearOldBackgrounds();
		M22.ScriptHandler.NextLine();
	});

	this.m_skipToNextLine = (this.m_parameters[5] === true);
}

module.exports = DrawBackground;