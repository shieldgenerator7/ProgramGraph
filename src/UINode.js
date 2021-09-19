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
        this.topLeft.y = y - this.size.y / 2;
    }
}
