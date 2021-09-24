"use strict";

class PanelInput{
    constructor(panel){
        this.panel = panel;
    }

    onMouseMove(e){
        let gv = this.panel.space.convertFromPosition(e);
        if (this.panel.state.mouseClick){
            for(let node of this.panel.selection.selectedNodes){
                node.setPosition(gv.add(node.mouseOffset));
            }
            this.panel.display.draw();
        }
        else{
            let prevMouseOverNode = this.panel.state.mouseOverNode;
            this.panel.state.mouseOverNode = undefined;
            for(let nodeIndex in this.panel.space.nodeList){
                if (!nodeIndex){continue;}
                let node = this.panel.space.nodeList[nodeIndex];
                if (node.inBounds(gv)){
                    this.panel.state.mouseOverNode = node;
                    break;
                }
            }
            if (this.panel.state.mouseOverNode != prevMouseOverNode){
                this.panel.display.draw();
            }
        }
        if (this.panel.state.mouseRightClick){
            for(let tempEdge of this.panel.state.tempEdgeList){
                tempEdge.to.position = gv;
            }
            this.panel.display.draw();
        }
    }

    onMouseDown(e){
        let gv = this.panel.space.convertFromPosition(e);
        if (this.panel.state.mouseOverNode){
            if (e.which == 3){//RMB
                this.panel.state.mouseRightClick = true;
                this.panel.input.setSelectedNode(this.panel.state.mouseOverNode, e.shiftKey);
                for(let node of this.panel.selection.selectedNodes){
                    let tempEdge = new UIEdge(undefined, node, undefined);
                    tempEdge.to = {};
                    tempEdge.to.position = gv;
                    this.panel.state.tempEdgeList.push(tempEdge);
                }
            }
            else{//LMB
                this.panel.state.mouseClick = true;
                //Select node if not selected
                this.panel.input.setSelectedNode(this.panel.state.mouseOverNode, e.shiftKey);
                //Calculate offsets in preparation for move
                this.panel.input.calculateNodeOffsets(gv);
            }
        }
        else{
            this.panel.selection.selectNode();
        }
        this.panel.display.draw();
    }

    onMouseUp(e){
        this.panel.state.mouseClick = false;
        if (this.panel.state.mouseOverNode){
            if (this.panel.state.mouseRightClick){
                this.panel.state.tempEdgeList = [];
                for (let node of this.panel.selection.selectedNodes){
                    let edge = this.panel.space.graph.addEdge(
                        node.node,
                        this.panel.state.mouseOverNode.node
                    );
                }
                this.panel.space.syncFromGraph();
                this.panel.state.mouseRightClick = false;
            }
            this.panel.display.draw();
        }
        else{
            if (this.panel.state.mouseRightClick){
                this.panel.state.tempEdgeList = [];
                this.panel.state.mouseRightClick = false;
                this.panel.display.draw();
            }
        }
    }

    onMouseDoubleClick(e){
        let gv = this.panel.space.convertFromPosition(e);
        let node = new Node();
        this.panel.display.space.graph.addNode(node);
        let newNodes = this.panel.space.syncFromGraph();
        let uiNode = newNodes[0];
        uiNode.setPosition(gv);
        this.panel.state.mouseOverNode = uiNode;
        this.panel.input.setSelectedNode(uiNode, e.shiftKey);
        this.panel.display.draw();
    }

    setSelectedNode(node, shift){
        if (!this.panel.selection.isNodeSelected(node)){
            if (shift){
                this.panel.selection.selectNodeToo(node);
            }
            else{
                this.panel.selection.selectNode(node);
            }
        }
    }

    calculateNodeOffsets(gv){
        for(let node of this.panel.selection.selectedNodes){
            node.calculateMouseOffset(gv);
        }
    }
}
