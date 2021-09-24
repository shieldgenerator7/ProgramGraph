"use strict";

class Space{
    constructor(source){
        this.source = source;
        this.offset = new Vector2(0,0);
        this.size = new Vector2(100,100);
        this.zoomScale = 1;
        this.flip = new Vector2(1,1);//(-1,-1) to flip entirely
        //
        this.otherSpace = undefined;
        this.convertRatio = 1;//used to convert from otherSpace to this space
        //
        this.syncFromSource();
    }

    syncFromSource(){
        //Sync from graph
        if (this.source.nodeList){
            //TODO: determine min and max based on node positions (and sizes), use that to determine space size
            this.offset = new Vector2(0,0);
            this.size = new Vector2(100,100);
            this.zoomScale = 1;
        }
        //Sync from canvas
        if (this.source.clientWidth){
            this.offset = new Vector2(0,0);
            this.size = new Vector2(this.source.clientWidth,this.source.clientHeight);
            this.zoomScale = 1;
        }
    }

    setOtherSpace(otherSpace){
        this.otherSpace = otherSpace;
        //TODO: make convertRatio calculation more robust:
        //TODO: account for different proportioned spaces
        this.convertRatio = this.size.y / otherSpace.size.y;
    }

    //Conversion Order:
    // 1. Translate from-space to origin
    // 2. Flip it (if flip is different than to-space)
    // === Achieved Neutral Space ===
    // 2. Convert to to-space scale
    // 1. Translate origin to to-space
    // // 0. Scale with zoomScale?

    //converts from canvas x
    convertX(fx){
        let tx = (fx+this.otherSpace.offset.x);
        if (this.otherSpace.flip.x != this.flip.x){
            tx = this.otherSpace.size.x - tx;
        }
        //NEUTRAL
        tx = tx * this.convertRatio;
        tx = tx - this.offset.x;
        return tx;
    }
    //converts from canvas y
    convertY(fy){
        let ty = (fy+this.otherSpace.offset.y);
        if (this.otherSpace.flip.y != this.flip.y){
            ty = this.otherSpace.size.y - ty;
        }
        //NEUTRAL
        ty = ty * this.convertRatio;
        ty = ty - this.offset.y;
        return ty;
    }
    convertPosition(fv){
        return new Vector2(this.convertX(fv.x),this.convertY(fv.y));
    }

    //converts to canvas width
    convertWidth(width){
        return width;
    }
    //converts to canvas height
    convertHeight(height){
        return height;
    }
}
