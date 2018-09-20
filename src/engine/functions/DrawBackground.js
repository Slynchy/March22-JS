// TODO: Evaluate the deprecation of Transition.js if DrawBackground is functionally similar

// param 1: bg name
// param 2
function DrawBackground(Engine) {
	let bg = Engine.SceneHandler.AddBackground(this.m_parameters[0]);

	if (this.m_parameters[1]) {
		if (typeof this.m_parameters[1] === 'string') {
			this.m_parameters[1] = +this.m_parameters[1];
		}
		bg.x += this.m_parameters[1];
	}

	if (this.m_parameters[2]) {
		if (typeof this.m_parameters[2] === 'string') {
			this.m_parameters[2] = +this.m_parameters[2];
		}
		bg.y += this.m_parameters[2];
	}

	if (this.m_parameters[3]) {
		if (typeof this.m_parameters[3] === 'string') {
			this.m_parameters[3] = +this.m_parameters[3];
		}
		bg.width *= this.m_parameters[3];
	}

	if (this.m_parameters[4]) {
		if (typeof this.m_parameters[4] === 'string') {
			this.m_parameters[4] = +this.m_parameters[4];
		}
		bg.height *= this.m_parameters[4];
	}

	this.m_transition = this.m_parameters[5] || 'tr-normal';

	this.m_skipToNextLine = this.m_parameters[6] === true;

	bg.setTransition(
		Engine.SceneHandler.GetTransition(this.m_transition),
		true,
		Settings.functionSettings.DrawBackground.transitionSpeed,
		-1
	);

	Engine.EventHandler.ScheduleEvent(
		() => {
			bg.startTransition(() => {
				Engine.SceneHandler.ClearOldBackgrounds();

				Engine.EventHandler.ScheduleEvent(
					() => {
						Engine.ScriptHandler.NextLine();
					},
					Settings.functionSettings.DrawBackground.postDrawDelay,
					false
				);
			});
		},
		Settings.functionSettings.DrawBackground.preDrawDelay || 1,
		false
	);
}

module.exports = DrawBackground;
