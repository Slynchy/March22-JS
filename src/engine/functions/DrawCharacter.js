
function DrawCharacter() {
	let self = this;

    let chr = M22.SceneHandler.AddCharacter(this.m_parameters[0] + '/' + this.m_parameters[1], this.m_parameters[2]);

    this.m_skipToNextLine = this.m_parameters[3];

	chr.setTransition(
		M22.SceneHandler.GetTransition('tr-normal'),
		false,
		0.01,
		0,
		()=>{
			if(!this.m_parameters[3]){
				M22.EventHandler.ScheduleEvent(()=>{
					M22.ScriptHandler.NextLine();
				}, Settings.functionSettings.DrawBackground.postDrawDelay, false);
			}
		}
	);
}

module.exports = DrawCharacter;