"use strict";

class InputManager{
    constructor(space){
        this.space = space;
        console.log("space: "+this.space);
        this.mouseOverNode = undefined;
        document.onmousemove = this.onMouseMove;
        this.mouseClick = false;
        this.clickOffset = {
            x:0,
            y:0
        };
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
    }

    onMouseMove(e){
        let x = inputManager.space.convertFromX(e.x);
        let y = inputManager.space.convertFromY(e.y);
        if (inputManager.mouseClick){
            inputManager.mouseOverNode.setPosition(
                x + inputManager.clickOffset.x,
                y + inputManager.clickOffset.y
            );
            display.draw();
        }
        else{
            let prevMouseOverNode = inputManager.mouseOverNode;
            inputManager.mouseOverNode = undefined;
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

    onMouseDown(e){
        let x = inputManager.space.convertFromX(e.x);
        let y = inputManager.space.convertFromY(e.y);
        if (inputManager.mouseOverNode){
            inputManager.clickOffset.x = inputManager.mouseOverNode.position.x - x;
            inputManager.clickOffset.y = inputManager.mouseOverNode.position.y - y;
            inputManager.mouseClick = true;
            display.draw();
        }
    }

    onMouseUp(e){
        inputManager.mouseClick = false;
        if (inputManager.mouseOverNode){
            display.draw();
        }
    }
}
