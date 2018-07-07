// TODO: Evaluate the deprecation of Transition.js if DrawBackground is functionally similar
function DrawBackground(Engine) {
	let bg = Engine.SceneHandler.AddBackground(this.m_parameters[0]);

	this.m_skipToNextLine = (this.m_parameters[5] === true);

	bg.setTransition(
		Engine.SceneHandler.GetTransition('tr-normal'),
		true,
		Settings.functionSettings.DrawBackground.transitionSpeed,
		-1
	);

	Engine.EventHandler.ScheduleEvent(
		()=>{

			bg.startTransition(
				() => {
					Engine.SceneHandler.ClearOldBackgrounds();

					Engine.EventHandler.ScheduleEvent(
						()=>{
							Engine.ScriptHandler.NextLine();
						},
						Settings.functionSettings.DrawBackground.postDrawDelay,
						false
					);
				}
			);
		},
		Settings.functionSettings.DrawBackground.preDrawDelay || 1,
		false
	);
}

module.exports = DrawBackground;
