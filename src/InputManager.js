"use strict";

class InputManager{
    constructor(space){
        this.space = space;
        console.log("space: "+this.space);
        this.mouseOverNode = undefined;
        document.onmousemove = this.onMouseMove;
        this.mouseClick = false;
        this.mouseRightClick = false;
        this.tempEdgeList = [];
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        document.ondblclick = this.onMouseDoubleClick;
    }

    onMouseMove(e){
        let gv = inputManager.space.convertFromPosition(e);
        if (inputManager.mouseClick){
            for(let node of inputManager.space.selection.selectedNodes){
                node.setPosition(gv.add(node.mouseOffset));
            }
            display.draw();
        }
        else{
            let prevMouseOverNode = inputManager.mouseOverNode;
            inputManager.mouseOverNode = undefined;
            for(let nodeIndex in inputManager.space.nodeList){
                if (!nodeIndex){continue;}
                let node = inputManager.space.nodeList[nodeIndex];
                if (node.inBounds(gv)){
                    inputManager.mouseOverNode = node;
                    break;
                }
            }
            if (inputManager.mouseOverNode != prevMouseOverNode){
                display.draw();
            }
        }
        if (inputManager.mouseRightClick){
            for(let tempEdge of inputManager.tempEdgeList){
                tempEdge.to.position = gv;
            }
            display.draw();
        }
    }

    onMouseDown(e){
        let gv = inputManager.space.convertFromPosition(e);
        if (inputManager.mouseOverNode){
            if (e.which == 3){//RMB
                inputManager.mouseRightClick = true;
                inputManager.setSelectedNode(inputManager.mouseOverNode, e.shiftKey);
                for(let node of inputManager.space.selection.selectedNodes){
                    let tempEdge = new UIEdge(undefined, node, undefined);
                    tempEdge.to = {};
                    tempEdge.to.position = gv;
                    inputManager.tempEdgeList.push(tempEdge);
                }
            }
            else{//LMB
                inputManager.mouseClick = true;
                //Select node if not selected
                inputManager.setSelectedNode(inputManager.mouseOverNode, e.shiftKey);
                //Calculate offsets in preparation for move
                inputManager.calculateNodeOffsets(gv);
            }
        }
        else{
            inputManager.space.selection.selectNode();
        }
        display.draw();
    }

    onMouseUp(e){
        inputManager.mouseClick = false;
        if (inputManager.mouseOverNode){
            if (inputManager.mouseRightClick){
                inputManager.tempEdgeList = [];
                for (let node of inputManager.space.selection.selectedNodes){
                    let edge = inputManager.space.graph.addEdge(
                        node.node,
                        inputManager.mouseOverNode.node
                    );
                }
                inputManager.space.syncFromGraph();
                inputManager.mouseRightClick = false;
            }
            display.draw();
        }
        else{
            if (inputManager.mouseRightClick){
                inputManager.tempEdgeList = [];
                inputManager.mouseRightClick = false;
                display.draw();
            }
        }
    }

    onMouseDoubleClick(e){
        let gv = inputManager.space.convertFromPosition(e);
        let node = new Node();
        display.space.graph.addNode(node);
        let newNodes = inputManager.space.syncFromGraph();
        let uiNode = newNodes[0];
        uiNode.setPosition(gv);
        inputManager.mouseOverNode = uiNode;
        inputManager.setSelectedNode(uiNode, e.shiftKey);
        display.draw();
    }

    setSelectedNode(node, shift){
        if (!inputManager.space.selection.isNodeSelected(node)){
            if (shift){
                inputManager.space.selection.selectNodeToo(node);
            }
            else{
                inputManager.space.selection.selectNode(node);
            }
        }
    }

    calculateNodeOffsets(gv){
        for(let node of inputManager.space.selection.selectedNodes){
            node.calculateMouseOffset(gv);
        }
    }
}
