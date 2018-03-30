
// TODO: Evaluate the deprecation of Transition.js if DrawBackground is functionally similar
function DrawBackground() {
    let bg = M22.SceneHandler.AddBackground(this.m_parameters[0]);

	bg.setTransition(
		M22.SceneHandler.GetTransition('tr-normal'),
		false,
		0.01,
		0,
		()=>{
			M22.SceneHandler.ClearOldBackgrounds();

			M22.EventHandler.ScheduleEvent(()=>{
				M22.ScriptHandler.NextLine();
			}, Settings.functionSettings.DrawBackground.postDrawDelay, false);
		}
	);

	this.m_skipToNextLine = (this.m_parameters[5] === true);
}

module.exports = DrawBackground;