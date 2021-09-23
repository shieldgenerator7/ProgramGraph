"use strict";

class UINode{
    constructor(node){
        this.node = node;
        this.position = {
            x:0,
            y:0
        };
        this.topLeft = {
            x:0,
            y:0
        };
        this.size = {
            x:50,
            y:50
        };
    }

    setPosition(x, y){
        this.position.x = x;
        this.position.y = y;
        this.topLeft.x = x - this.size.x / 2;
        this.topLeft.y = y + this.size.y / 2;
    }

    //true if the given position is within the bounds of the node
    inBounds(x, y){
        return x >= this.topLeft.x && x <= this.topLeft.x + this.size.x
            && y <= this.topLeft.y && y >= this.topLeft.y - this.size.y;
    }

    //prepares the node for being moved
    calculateMouseOffset(gx, gy){
        this.mouseOffset = {
            x: this.position.x - gx,
            y: this.position.y - gy
        };
    }
}
