
function DrawBackground() {
    M22.SceneHandler.AddBackground(this.m_parameters[0]);
    this.m_skipToNextLine = true;
}

module.exports = DrawBackground;