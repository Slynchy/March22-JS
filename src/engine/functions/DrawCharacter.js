function DrawCharacter(Engine) {
  // check if char exists
  // if yes, remove
  let chrExists = Engine.SceneHandler.isCharacterInScene(this.m_parameters[0]);

  if (chrExists) {
    Engine.SceneHandler.RemoveCharacter(this.m_parameters[0]);
  }

  let chr = Engine.SceneHandler.AddCharacter(
    this.m_parameters[0] + '/' + this.m_parameters[1],
    this.m_parameters[2]
  );

  this.m_skipToNextLine = this.m_parameters[3];

  chr.setTransition(
    Engine.SceneHandler.GetTransition('tr-normal'),
    true,
    Settings.functionSettings.DrawCharacter.transitionSpeed,
    -1,
    () => {
      if (!this.m_parameters[3]) {
        Engine.EventHandler.ScheduleEvent(
          () => {
            Engine.ScriptHandler.NextLine();
          },
          Settings.functionSettings.DrawBackground.postDrawDelay,
          false
        );
      }
    }
  );
}

module.exports = DrawCharacter;
