"use strict";

class InputManager{
    constructor(panel){
        this.panel = panel;
        document.onmousemove = this.onMouseMove;
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        document.ondblclick = this.onMouseDoubleClick;
    }

    onMouseMove(e){
        let gv = panel.space.convertFromPosition(e);
        if (panel.state.mouseClick){
            for(let node of panel.selection.selectedNodes){
                node.setPosition(gv.add(node.mouseOffset));
            }
            panel.display.draw();
        }
        else{
            let prevMouseOverNode = panel.state.mouseOverNode;
            panel.state.mouseOverNode = undefined;
            for(let nodeIndex in panel.space.nodeList){
                if (!nodeIndex){continue;}
                let node = panel.space.nodeList[nodeIndex];
                if (node.inBounds(gv)){
                    panel.state.mouseOverNode = node;
                    break;
                }
            }
            if (panel.state.mouseOverNode != prevMouseOverNode){
                panel.display.draw();
            }
        }
        if (panel.state.mouseRightClick){
            for(let tempEdge of panel.state.tempEdgeList){
                tempEdge.to.position = gv;
            }
            panel.display.draw();
        }
    }

    onMouseDown(e){
        let gv = panel.space.convertFromPosition(e);
        if (panel.state.mouseOverNode){
            if (e.which == 3){//RMB
                panel.state.mouseRightClick = true;
                panel.input.setSelectedNode(panel.state.mouseOverNode, e.shiftKey);
                for(let node of panel.selection.selectedNodes){
                    let tempEdge = new UIEdge(undefined, node, undefined);
                    tempEdge.to = {};
                    tempEdge.to.position = gv;
                    panel.state.tempEdgeList.push(tempEdge);
                }
            }
            else{//LMB
                panel.state.mouseClick = true;
                //Select node if not selected
                panel.input.setSelectedNode(panel.state.mouseOverNode, e.shiftKey);
                //Calculate offsets in preparation for move
                panel.input.calculateNodeOffsets(gv);
            }
        }
        else{
            panel.selection.selectNode();
        }
        panel.display.draw();
    }

    onMouseUp(e){
        panel.state.mouseClick = false;
        if (panel.state.mouseOverNode){
            if (panel.state.mouseRightClick){
                panel.state.tempEdgeList = [];
                for (let node of panel.selection.selectedNodes){
                    let edge = panel.space.graph.addEdge(
                        node.node,
                        panel.state.mouseOverNode.node
                    );
                }
                panel.space.syncFromGraph();
                panel.state.mouseRightClick = false;
            }
            panel.display.draw();
        }
        else{
            if (panel.state.mouseRightClick){
                panel.state.tempEdgeList = [];
                panel.state.mouseRightClick = false;
                panel.display.draw();
            }
        }
    }

    onMouseDoubleClick(e){
        let gv = panel.space.convertFromPosition(e);
        let node = new Node();
        panel.display.space.graph.addNode(node);
        let newNodes = panel.space.syncFromGraph();
        let uiNode = newNodes[0];
        uiNode.setPosition(gv);
        panel.state.mouseOverNode = uiNode;
        panel.input.setSelectedNode(uiNode, e.shiftKey);
        panel.display.draw();
    }

    setSelectedNode(node, shift){
        if (!panel.selection.isNodeSelected(node)){
            if (shift){
                panel.selection.selectNodeToo(node);
            }
            else{
                panel.selection.selectNode(node);
            }
        }
    }

    calculateNodeOffsets(gv){
        for(let node of panel.selection.selectedNodes){
            node.calculateMouseOffset(gv);
        }
    }
}
