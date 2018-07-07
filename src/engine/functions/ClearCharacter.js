function ClearCharacter(Engine) {
	Engine.SceneHandler.RemoveCharacter(this.m_parameters[0], ()=>{
		Engine.ScriptHandler.NextLine();
	});
}

module.exports = ClearCharacter;
