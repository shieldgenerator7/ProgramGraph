"use strict";

class InputManager{
    constructor(space){
        this.space = space;
        console.log("space: "+this.space);
        this.mouseOverNode = undefined;
        document.onmousemove = this.onMouseMove;
    }

    onMouseMove(e){
        let prevMouseOverNode = inputManager.mouseOverNode;
        inputManager.mouseOverNode = undefined;
        let x = inputManager.space.convertFromX(e.x);
        let y = inputManager.space.convertFromY(e.y);
        for(let nodeIndex in inputManager.space.nodeList){
            if (!nodeIndex){continue;}
            let node = inputManager.space.nodeList[nodeIndex];
            if (node.inBounds(x, y)){
                inputManager.mouseOverNode = node;
                break;
            }
        }
        if (inputManager.mouseOverNode != prevMouseOverNode){
            display.draw();
        }
    }
}
