function Wait(Engine) {
  if(typeof this.m_parameters[0] !== 'number'){
    this.m_parameters[0] = parseFloat(this.m_parameters[0]);
  }

  // TODO: change this to be more robust than a timeout
  setTimeout(()=>{
    Engine.ScriptHandler.NextLine();
  }, this.m_parameters[0]);

  this.m_skipToNextLine = false;
}

module.exports = Wait;
