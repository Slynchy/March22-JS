let Sprite = require('pixi.js').Sprite;
let Container = require('pixi.js').Container;
let TextStyle = require('pixi.js').TextStyle;
let Text = require('./Text.js');

class TextBox extends Container{
	constructor(props){
		super();

		this._textbox = new Sprite(null, {});
        this.addChild(this._textbox);

        this.currentText = '';

		this._speaker = null;

        let xOffset_text = 35;
        let yOffset_text = 52;
		this._text = new Text({
			text: '',
			x: xOffset_text,
			y: yOffset_text,
            style: (
                new TextStyle({
                    align: 'left',
					fontFamily: 'Comic Sans MS',
                    fill: '0xFEFEFE',
                    fontSize: 36,
					wordWrap: true,
					wordWrapWidth: (Settings.applicationSettings.width - xOffset_text - 20) * 2,
                })
            )
		});
		this._text.scale.x = 0.5;
        this._text.scale.y = 0.5;
		this.addChild(this._text);

		let xOffset_name = 20;
		let yOffset_name = 9;
		this._name = new Text({
			text: '',
			x: xOffset_name,
			y: yOffset_name,
			style: (
				new TextStyle({
					align: 'left',
					fontFamily: 'Comic Sans MS',
					fill: '0xfefefe',
					fontSize: Settings.textbox.nameFontSize * 2
				})
			)
		});
		this._name.scale.x = 0.5;
		this._name.scale.y = 0.5;
		this._name.renderable = false;
		this.addChild(this._name);

		this.zOrder = 1000;

		this._activeAnim = null;

		if(props)
			Object.assign(this,props);
	}

    finishLine(){
		if(this._activeAnim)
			clearInterval(this._activeAnim);

        this._text.text = this.currentText;
    }

    _updateSpeakerUI(){
		this._name.renderable = !!this._speaker;
		this._name.text = this._speaker ? this._speaker.name : "";
		this._name.style.fill = this._speaker ? this._speaker.color.hexColor : '#fefefe';
    }

	setSpeaker(val){
		this._speaker = val;

		this._updateSpeakerUI();
	}

	clearSpeaker(){
		this._name.renderable = false;
		this._speaker = null;
	}

    hasFinishedLine(){
		return !(this._text.text.length < this.currentText.length);
	}

	setText(txt){
        clearInterval(this._activeAnim);

        this.currentText = txt;
        this._text.text = "";

        this._activeAnim = setInterval(()=>{
        	if(this._text.text.length < this.currentText.length){
                this._text.text = this.currentText.substr(0,this._text.text.length+1);
			} else {
        		clearInterval(this._activeAnim);
        		return;
			}
		}, 32);
	}

	setTextbox(texture){
		this._textbox.texture = texture;
		this._textbox.width = this.width = texture.width;
		this._textbox.height = this.height = texture.height;

		this.x = 0;
		this.y = (Settings.applicationSettings.height - this.height) + Settings.textbox.yOffset;
	}

	hide(){
		console.log('Hide');

		this.alpha = 0;
		//this._text.hide();
	}

    show(){
        console.log('Show');

        this.alpha = 1;
        //this._text.show();
    }

	disableNovelMode(){
		console.log('disableNovelMode');
	}

    enableNovelMode(){
        console.log('enableNovelMode');
    }
}

module.exports = TextBox;