let PIXI = require("pixi.js");

class Text extends PIXI.Text {
    constructor(props){
        "use strict";
        super(props['text'] ? props['text'] : "", props);

        this.tag = "Text";

        this.parentScene = null;

        if(props)
            Object.assign(this, props);
    }

    hide(){
        this.alpha = 0;
    }

    show(){
        this.alpha = 1;
    }

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    set x(val) {
        this.position.x = val;
    }

    set y(val) {
        this.position.y = val;
    }
}

module.exports = Text;