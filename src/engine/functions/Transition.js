function Transition(Engine) {
	let bg = Engine.SceneHandler.AddBackground(this.m_parameters[0]);

	bg.setTransition(
		Engine.SceneHandler.GetTransition(this.m_parameters[1]),
		this.m_parameters[2],
		this.m_parameters[3],
		-1,
		() => {
			Engine.SceneHandler.ClearOldBackgrounds();

			Engine.EventHandler.ScheduleEvent(
				() => {
					Engine.ScriptHandler.NextLine();
				},
				Settings.functionSettings.Transition.postDrawDelay,
				false
			);
		}
	);

	this.m_skipToNextLine = this.m_parameters[5] === true;
}

module.exports = Transition;
