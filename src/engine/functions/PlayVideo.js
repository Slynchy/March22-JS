function PlayVideo() {
	console.log('PlayVideo ' + this.m_parameters[0]);

	this.m_skipToNextLine = true;
}

module.exports = PlayVideo;
