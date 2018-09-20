function PlayMusic() {
  console.log(`PlayMusic ${this.m_parameters}`);
  this.m_skipToNextLine = true;
}

module.exports = PlayMusic;
