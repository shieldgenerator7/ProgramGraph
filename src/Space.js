"use strict";

class Space{
    constructor(panel){
        this.canvas = panel.canvas;
        this.offset = new Vector2(0,0);
        this.size = new Vector2(100,100);
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
    convertPosition(gv){
        return new Vector2(this.convertX(gv.x),this.convertY(gv.y));
    }
    //converts to canvas width
    convertWidth(width){
        return width;
    }
    //converts to canvas height
    convertHeight(height){
        return height;
    }

    //converts from canvas x
    convertFromX(cx){
        return cx - this.offset.x;
    }
    //converts from canvas y
    convertFromY(cy){
        return -(cy - this.canvas.clientHeight) - this.offset.y;
    }
    convertFromPosition(cv){
        return new Vector2(this.convertFromX(cv.x),this.convertFromY(cv.y));
    }
}
