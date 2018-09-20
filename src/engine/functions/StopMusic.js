function StopMusic() {
  console.log('StopMusic @ speed of ' + this.m_parameters[0]);

  this.m_skipToNextLine = true;
}

module.exports = StopMusic;
