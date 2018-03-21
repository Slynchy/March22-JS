

class M22Script {

	constructor(){
		this._lines = [];
		this._checkpoints = [];
		this._variables = [];
		this._charNames = [];

		this._requiredAssets = {
			characters: [],
			backgrounds: [],
			videos: [],
			sfx: []
		};
		this._assetsSorted = false;
	};

	AddLine(line){
		this._lines.push(line);
	}

	_sortRequiredAssets(){
		for(let i = 0; i < this._lines.length; i++){
			if(this._lines[i].m_requiredAssets.length === 0) continue;

			let currLine = this._lines[i];

			for(let a = 0; a < currLine.m_requiredAssets.length; a++){
				switch(currLine.m_lineType){
					case M22.ScriptCompiler.LINETYPES.DRAW_BACKGROUND:
					case M22.ScriptCompiler.LINETYPES.TRANSITION:
						this._requiredAssets.backgrounds.push(currLine.m_requiredAssets[a]);
						break;
					case M22.ScriptCompiler.LINETYPES.PLAY_STING:
					case M22.ScriptCompiler.LINETYPES.PLAY_SFX_LOOPED:
					case M22.ScriptCompiler.LINETYPES.PLAY_MUSIC:
						this._requiredAssets.sfx.push(currLine.m_requiredAssets[a]);
						break;
					case M22.ScriptCompiler.LINETYPES.PLAY_VIDEO:
						this._requiredAssets.videos.push(currLine.m_requiredAssets[a]);
						break;
					case M22.ScriptCompiler.LINETYPES.DRAW_CHARACTER:
						this._requiredAssets.characters.push(currLine.m_requiredAssets[a]);
						break;
				}
			}
		}

		// remove duplicates
		this._requiredAssets.backgrounds = this._requiredAssets.backgrounds.filter((item, pos)=>{
			return this._requiredAssets.backgrounds.indexOf(item) === pos;
		});
		this._requiredAssets.characters = this._requiredAssets.characters.filter((item, pos)=>{
			return this._requiredAssets.characters.indexOf(item) === pos;
		});
		this._requiredAssets.sfx = this._requiredAssets.sfx.filter((item, pos)=>{
			return this._requiredAssets.sfx.indexOf(item) === pos;
		});
		this._requiredAssets.videos = this._requiredAssets.videos.filter((item, pos)=>{
			return this._requiredAssets.videos.indexOf(item) === pos;
		});
	}

	get requiredAssets(){
		if(!this._assetsSorted){
			this._sortRequiredAssets();
		}
		return this._requiredAssets;
	}

	get checkpoints(){
		return this._checkpoints;
	}

	set checkpoints(val){
		this._checkpoints = val;
	}

	get variables(){
		return this._variables;
	}

	set variables(val){
		this._variables = val;
	}

	get charNames(){
		return this._charNames;
	}

	set charNames(val){
		this._charNames = val;
	}

	GetLine(index){
		return this._lines[index];
	}

}

module.exports = M22Script;