"use strict";

class InputManager{
    constructor(panel){
        this.panel = panel;
        this.space = panel.space;
        console.log("space: "+this.space);
        document.onmousemove = this.onMouseMove;
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        document.ondblclick = this.onMouseDoubleClick;
    }

    onMouseMove(e){
        let gv = inputManager.space.convertFromPosition(e);
        if (panel.state.mouseClick){
            for(let node of inputManager.panel.selection.selectedNodes){
                node.setPosition(gv.add(node.mouseOffset));
            }
            display.draw();
        }
        else{
            let prevMouseOverNode = panel.state.mouseOverNode;
            panel.state.mouseOverNode = undefined;
            for(let nodeIndex in inputManager.space.nodeList){
                if (!nodeIndex){continue;}
                let node = inputManager.space.nodeList[nodeIndex];
                if (node.inBounds(gv)){
                    panel.state.mouseOverNode = node;
                    break;
                }
            }
            if (panel.state.mouseOverNode != prevMouseOverNode){
                display.draw();
            }
        }
        if (panel.state.mouseRightClick){
            for(let tempEdge of panel.state.tempEdgeList){
                tempEdge.to.position = gv;
            }
            display.draw();
        }
    }

    onMouseDown(e){
        let gv = inputManager.space.convertFromPosition(e);
        if (panel.state.mouseOverNode){
            if (e.which == 3){//RMB
                panel.state.mouseRightClick = true;
                inputManager.setSelectedNode(panel.state.mouseOverNode, e.shiftKey);
                for(let node of inputManager.panel.selection.selectedNodes){
                    let tempEdge = new UIEdge(undefined, node, undefined);
                    tempEdge.to = {};
                    tempEdge.to.position = gv;
                    panel.state.tempEdgeList.push(tempEdge);
                }
            }
            else{//LMB
                panel.state.mouseClick = true;
                //Select node if not selected
                inputManager.setSelectedNode(panel.state.mouseOverNode, e.shiftKey);
                //Calculate offsets in preparation for move
                inputManager.calculateNodeOffsets(gv);
            }
        }
        else{
            inputManager.panel.selection.selectNode();
        }
        display.draw();
    }

    onMouseUp(e){
        panel.state.mouseClick = false;
        if (panel.state.mouseOverNode){
            if (panel.state.mouseRightClick){
                panel.state.tempEdgeList = [];
                for (let node of inputManager.panel.selection.selectedNodes){
                    let edge = inputManager.space.graph.addEdge(
                        node.node,
                        panel.state.mouseOverNode.node
                    );
                }
                inputManager.space.syncFromGraph();
                panel.state.mouseRightClick = false;
            }
            display.draw();
        }
        else{
            if (panel.state.mouseRightClick){
                panel.state.tempEdgeList = [];
                panel.state.mouseRightClick = false;
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
        panel.state.mouseOverNode = uiNode;
        inputManager.setSelectedNode(uiNode, e.shiftKey);
        display.draw();
    }

    setSelectedNode(node, shift){
        if (!inputManager.panel.selection.isNodeSelected(node)){
            if (shift){
                inputManager.panel.selection.selectNodeToo(node);
            }
            else{
                inputManager.panel.selection.selectNode(node);
            }
        }
    }

    calculateNodeOffsets(gv){
        for(let node of inputManager.panel.selection.selectedNodes){
            node.calculateMouseOffset(gv);
        }
    }
}
