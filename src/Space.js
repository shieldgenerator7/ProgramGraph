"use strict";

class Space{
    constructor(canvas){
        this.canvas = canvas;
        this.offset = {
            x: 0,
            y: 0
        };
        this.size = {
            x: 100,
            y: 100
        };
        this.zoomScale = 1;
    }

    //converts to canvas x
    convertX(gx){
        return gx + this.offset.x;
    }
    //converts to canvas y
    convertY(gy){
        return (this.canvas.clientHeight - (gy + this.offset.y));
    }
}
