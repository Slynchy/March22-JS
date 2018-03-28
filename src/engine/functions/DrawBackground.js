
function DrawBackground() {
    let bg = M22.SceneHandler.AddBackground(this.m_parameters[0]);
	// bg.setTransition(M22.SceneHandler.GetTransition('tr-clockwipe'), true, ()=>{
	// 	bg.setTransition(M22.SceneHandler.GetTransition('tr_eyes'), true, ()=>{
	// 		console.log('done');
	// 	});
	// });
	if(this.m_parameters[5] === true){
		this.m_skipToNextLine = true;
	}
}

module.exports = DrawBackground;