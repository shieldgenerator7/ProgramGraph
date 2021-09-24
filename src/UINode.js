"use strict";

class UINode{
    constructor(node){
        this.node = node;
        this.position = new Vector2(0,0);
        this.topLeft = new Vector2(0,0);
        this.size = new Vector2(0,0);
        this.halfSize = new Vector2(0,0);
        this.mouseOffset = new Vector2(0,0);

        this.setSize(new Vector2(50,50));
    }

    setPosition(v){
        this.position = v;
        this.topLeft.x = v.x - this.halfSize.x;
        this.topLeft.y = v.y + this.halfSize.y;
    }

    setSize(v){
        this.size = v;
        this.halfSize = v.scale(0.5);
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
