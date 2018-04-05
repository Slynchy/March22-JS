
function DrawCharacter() {
	let self = this;

	// check if char exists
	// if yes, remove
	let chrExists = M22.SceneHandler.isCharacterInScene(this.m_parameters[0]);

	if(chrExists){
		M22.SceneHandler.RemoveCharacter(this.m_parameters[0]);
	}

    let chr = M22.SceneHandler.AddCharacter(this.m_parameters[0] + '/' + this.m_parameters[1], this.m_parameters[2]);

    this.m_skipToNextLine = this.m_parameters[3];

	chr.setTransition(
		M22.SceneHandler.GetTransition('tr-normal'),
		true,
		0.02,
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