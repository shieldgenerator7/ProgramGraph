"use strict";

let WIDTH_MIN = 50;
let WIDTH_BUFFER = 5;
let HEIGHT_MIN = 35;
let HEIGHT_BUFFER = 5;

class UINode{
    constructor(node){
        this.node = node;
        //indepedent variables
        this.position = new Vector2(0,0);
        this.size = new Vector2(0,0);
        this.textList = [];
        this.visible = true;
        this.autoPosition = true;
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
        this.syncTextListWithNode();
        let maxWidth = Math.max(
                ...this.textList.map(text=>text.size.x)
            )
            + (WIDTH_BUFFER*2);
        this.size.x = Math.max(maxWidth, WIDTH_MIN);
        this.size.y = (this.position.y - this.textList.at(-1).position.y) + HEIGHT_BUFFER;
        this.size.y = Math.max(this.size.y, HEIGHT_MIN);
        this._recalculateCache();
        //Left align
        let leftPosition = this.topLeft.x + WIDTH_BUFFER;
        this.textList
        .filter(text => text.align == "left")
        .forEach((text, i) => text.position.x = leftPosition);

    }

    syncTextListWithNode(){
        this.textList = [];
        this.textList.push(this.getTextObject(this.node.getTitle(),0));
        this.node.attributes.forEach((attr, i) => {
            let text = this.getTextObject(attr,i+1);
            text.align = "left";
            this.textList.push(text);
        });
    }

    getTextObject(str, row){
        let text = {
            str: str,
            row: row,
            position: new Vector2(0,0),
            size: new Vector2(0,0),
            align: "center",
        }
        text.size = getTextSize(text.str);
        text.position.x = this.position.x - (text.size.x/2);
        text.position.y =
            this.position.y - ((text.row+1) * (text.size.y+HEIGHT_BUFFER));
        return text;
    }

    setPosition(v){
        this.position.x = v.x;
        this.position.y = v.y;
        this.syncWithNode();
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
