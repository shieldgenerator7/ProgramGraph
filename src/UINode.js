"use strict";

let WIDTH_MIN = 50;
let WIDTH_BUFFER = 5;
let HEIGHT_BUFFER = 5;

class UINode{
    constructor(node){
        this.node = node;
        //indepedent variables
        this.position = new Vector2(0,0);
        this.size = new Vector2(0,0);
        this.text = {
            row: 0,
            position: new Vector2(0,0),
        }
        //dependent variables
        this.topLeft = new Vector2(0,0);
        this.halfSize = new Vector2(0,0);
        this.mouseOffset = new Vector2(0,0);

        this.setSize(new Vector2(WIDTH_MIN,WIDTH_MIN));

        this.onChange = undefined;
        this.node.onChange = ()=>this.syncWithNode();
        this.syncWithNode();
    }

    syncWithNode(){
        let textSize = getTextSize(this.node.getTitle());
        let maxWidth = textSize.x + (WIDTH_BUFFER*2);
        this.size.x = Math.max(maxWidth, WIDTH_MIN);
        this.text.position.x = this.position.x - (textSize.x/2);
        this.text.position.y =
            this.position.y - ((this.text.row+1) * (textSize.y+HEIGHT_BUFFER));
        this._recalculateCache();
    }

    setPosition(v){
        this.position.x = v.x;
        this.position.y = v.y;
        this._recalculateCache();
    }

    setSize(v){
        this.size.x = v.x;
        this.size.y = v.y;
        this._recalculateCache();
    }

    _recalculateCache(){
        this.halfSize = this.size.scale(0.5);
        this.topLeft.x = this.position.x - this.halfSize.x;
        this.topLeft.y = this.position.y;
        this.onChange?.();
    }

    //true if the given position is within the bounds of the node
    inBounds(v){
        return v.x >= this.topLeft.x && v.x <= this.topLeft.x + this.size.x
            && v.y <= this.topLeft.y && v.y >= this.topLeft.y - this.size.y;
    }

    //prepares the node for being moved
    calculateMouseOffset(v){
        this.mouseOffset = this.position.subtract(v);
    }
}
