"use strict";

class InputManager{
    constructor(space){
        this.space = space;
        console.log("space: "+this.space);
        this.mouseOverNode = undefined;
        document.onmousemove = this.onMouseMove;
        this.mouseClick = false;
        this.mouseRightClickNode = undefined;
        this.tempEdge = undefined;
        this.clickOffset = {
            x:0,
            y:0
        };
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        document.ondblclick = this.onMouseDoubleClick;
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
        if (inputManager.mouseRightClickNode){
            inputManager.tempEdge.to.position.x = x;
            inputManager.tempEdge.to.position.y = y;
            display.draw();
        }
    }

    onMouseDown(e){
        let x = inputManager.space.convertFromX(e.x);
        let y = inputManager.space.convertFromY(e.y);
        if (inputManager.mouseOverNode){
            if (e.which == 3){//RMB
                inputManager.mouseRightClickNode = inputManager.mouseOverNode;
                inputManager.tempEdge = new UIEdge(undefined, inputManager.mouseRightClickNode, undefined);
                inputManager.tempEdge.to = {};
                inputManager.tempEdge.to.position = {
                    x: x,
                    y: y
                };
            }
            else{//LMB
                inputManager.clickOffset.x = inputManager.mouseOverNode.position.x - x;
                inputManager.clickOffset.y = inputManager.mouseOverNode.position.y - y;
                inputManager.mouseClick = true;
                if (e.shiftKey){
                    inputManager.space.selection.selectNodesToo(inputManager.mouseOverNode);
                }
                else{
                    inputManager.space.selection.selectNodes(inputManager.mouseOverNode);
                }
            }
        }
        else{
            inputManager.space.selection.selectNodes();
        }
        display.draw();
    }

    onMouseUp(e){
        inputManager.mouseClick = false;
        if (inputManager.mouseOverNode){
            if (inputManager.mouseRightClickNode){
                inputManager.tempEdge = undefined;
                let edge = inputManager.space.graph.addEdge(
                    inputManager.mouseRightClickNode.node,
                    inputManager.mouseOverNode.node
                );
                inputManager.space.syncFromGraph();
                inputManager.mouseRightClickNode = undefined;
            }
            display.draw();
        }
        else{
            if (inputManager.mouseRightClickNode){
                inputManager.tempEdge = undefined;
                inputManager.mouseRightClickNode = undefined;
                display.draw();
            }
        }
    }

    onMouseDoubleClick(e){
        let x = inputManager.space.convertFromX(e.x);
        let y = inputManager.space.convertFromY(e.y);
        let node = new Node();
        display.space.graph.addNode(node);
        let newNodes = inputManager.space.syncFromGraph();
        let uiNode = newNodes[0];
        uiNode.setPosition(x,y);
        inputManager.mouseOverNode = uiNode;
        inputManager.space.selection.selectNodes(uiNode);
        display.draw();
    }
}
