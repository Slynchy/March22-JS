function Goto(Engine) {
  this.m_skipToNextLine = false;
  Engine.ScriptHandler.Goto(this.m_parameters[0]);
}

module.exports = Goto;
