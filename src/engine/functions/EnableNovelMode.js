function EnableNovelMode(Engine) {
  Engine.ScriptHandler.enableNovelMode();
  this.m_skipToNextLine = true;
}

module.exports = EnableNovelMode;
