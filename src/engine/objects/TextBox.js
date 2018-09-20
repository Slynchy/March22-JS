let Sprite = require('pixi.js').Sprite;
let Container = require('pixi.js').Container;
let TextStyle = require('pixi.js').TextStyle;
let Text = require('./Text.js');

class TextBox extends Container {
  constructor(props) {
    super();

    this.activeTextObject = null;
    this.currentText = '';
    this._speaker = null;
    this._textbox = null;
    this._textboxNovel = null;
    this._text = null;
    this._novelText = null;
    this._activeAnim = null;
    this._textbuffer = '';

    this._narrativeTexture = null;
    this._dialogueTexture = null;

    this._textbox = new Sprite(null, {});
    this.addChild(this._textbox);
    this._textboxNovel = new Sprite(null, {});
    this.addChild(this._textboxNovel);

    this._createTextObjects();

    let xOffset_name = 20;
    let yOffset_name = 9;
    this._name = new Text({
      text: '',
      x: xOffset_name,
      y: yOffset_name,
      style: new TextStyle({
        align: 'left',
        fontFamily: 'Comic Sans MS',
        fill: '0xfefefe',
        fontSize: Settings.textbox.nameFontSize * 2
      })
    });
    this._name.scale.x = 0.5;
    this._name.scale.y = 0.5;
    this._name.renderable = false;
    this.addChild(this._name);

    this.zOrder = 1000;

    if (props) Object.assign(this, props);
  }

  _createTextObjects(){
    let xOffset_text = 35;
    let yOffset_text = 52;
    this._text = new Text({
      text: '',
      x: xOffset_text,
      y: yOffset_text,
      style: new TextStyle({
        align: 'left',
        fontFamily: 'Comic Sans MS',
        fill: '0xFEFEFE',
        fontSize: 36,
        wordWrap: true,
        wordWrapWidth: (Settings.applicationSettings.width - xOffset_text - 20) * 2
      })
    });
    this._text.scale.x = 0.5;
    this._text.scale.y = 0.5;
    this.addChild(this._text);

    this._novelText = new Text({
      text: '',
      x: xOffset_text,
      y: yOffset_text,
      style: new TextStyle({
        align: 'left',
        fontFamily: 'Comic Sans MS',
        fill: '0xFEFEFE',
        fontSize: 36,
        wordWrap: true,
        wordWrapWidth: (Settings.applicationSettings.width - xOffset_text - 20) * 2
      })
    });
    this._novelText.scale.x = 0.5;
    this._novelText.scale.y = 0.5;
    this.addChild(this._novelText);
  }

  finishLine() {
    if (this._activeAnim) clearInterval(this._activeAnim);
    this.activeTextObject.text = this.currentText;
  }

  _updateSpeakerUI() {
    this._name.renderable = !!this._speaker;
    this._name.text = this._speaker ? this._speaker.name : '';
    this._name.style.fill = this._speaker ? this._speaker.color.hexColor : '#fefefe';
  }

  setSpeaker(val) {
    this._speaker = val;
    this._updateSpeakerUI();
  }

  clearSpeaker() {
    this._name.renderable = false;
    this._speaker = null;
  }

  hasFinishedLine() {
    return !(this.activeTextObject.text.length < this.currentText.length);
  }

  setText(txt) {
    clearInterval(this._activeAnim);

    if(!this._novelMode){
      this.currentText = txt;
      this.activeTextObject.text = '';
    } else {
      if(this.currentText === ''){
        this.currentText += `${txt}`;
      } else {
        this.currentText += `\n\n${txt}`;
      }
    }

    this._activeAnim = setInterval(() => {
      if (this.activeTextObject.text.length < this.currentText.length) {
        this.activeTextObject.text = this.currentText.substr(0, this.activeTextObject.text.length + 1);
      } else {
        clearInterval(this._activeAnim);
        return;
      }
    }, 32);
  }

  newPage(){
    if(!this._novelMode) return;

    this.activeTextObject.text = '';
    this.currentText = '';
  }

  setupTextboxTextures(obj){
    this._textboxNovel.texture = (obj.novel);
    this._textboxNovel.width = Settings.applicationSettings.width;
    this._textboxNovel.height = Settings.applicationSettings.height;

    this._narrativeTexture = obj.narrative;
    this._dialogueTexture = obj.dialogue;

    this.setTextbox('narrative');
  }

  setTextbox(name) {
    switch(name){
    case 'novel':
      this._novelMode = true;
      this._textbox.renderable = false;
      this._text.renderable = false;
      this._textboxNovel.renderable = true;
      this._novelText.renderable = true;
      this.y = 0;
      this.activeTextObject = this._novelText;
      break;
    case 'narrative':
      this._novelMode = false;
      this._textbox.renderable = true;
      this._text.renderable = true;
      this._textboxNovel.renderable = false;
      this._novelText.renderable = false;
      this._textbox.texture = (this._narrativeTexture);
      this.activeTextObject = this._text;
      this.y = Settings.applicationSettings.height - this.height + Settings.textbox.yOffset;
      break;
    case 'dialogue':
      this._novelMode = false;
      this._textbox.renderable = true;
      this._text.renderable = true;
      this._textboxNovel.renderable = false;
      this._novelText.renderable = false;
      this._textbox.texture = (this._dialogueTexture);
      this.activeTextObject = this._text;
      this.y = Settings.applicationSettings.height - this.height + Settings.textbox.yOffset;
      break;
    }

    if(!this._novelMode){
      this._textboxNovel.renderable = false;
    }
    // this._textbox.width = this.width = texture.width;
    // this._textbox.height = this.height = texture.height;
    //this.x = 0;
  }

  hide() {
    this.alpha = 0;
    //this._text.hide();
  }

  show() {
    this.alpha = 1;
    //this._text.show();
  }
}

module.exports = TextBox;
