
function Goto() {
    this.m_skipToNextLine = false;
    M22.ScriptHandler.Goto(this.m_parameters[0]);
}

module.exports = Goto;