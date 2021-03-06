"use strict";

class PanelInput{
    constructor(panel){
        this.panel = panel;
        this.space = panel.spaceWorld;
    }

    onMouseMove(e){
        let cv = cvsTL.reverseSubtract(e);
        let gv = this.space.convertPosition(cv);
        if (this.panel.state.mouseClick){
            //Drag nodes
            if (this.panel.state.mouseOverNode){
                for(let node of this.panel.selection.selectedNodes){
                    node.setPosition(gv.add(node.mouseOffset));
                    node.autoPosition = false;
                }
            }
            //Scroll screen
            else{
                let origGV = this.space.convertPosition(this.panel.state.originalCV);
                let dGV = gv.subtract(origGV);
                this.panel.spaceWorld.offset =
                    this.panel.state.originalGraphOffset.add(dGV);
            }
            //Redraw
            this.panel.display.draw();
        }
        else{
            //Find mouse over node
            let prevMouseOverNode = this.panel.state.mouseOverNode;
            this.panel.state.mouseOverNode = undefined;
            for(let nodeIndex in this.panel.nodeList){
                if (!nodeIndex){continue;}
                let node = this.panel.nodeList[nodeIndex];
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
            //Update temp edges
            for(let tempEdge of this.panel.state.tempEdgeList){
                tempEdge.to.position = gv;
            }
            this.panel.display.draw();
        }
    }

    onMouseDown(e){
        let cv = cvsTL.reverseSubtract(e);
        let gv = this.space.convertPosition(cv);
        if (this.panel.state.mouseOverNode){
            if (e.which == 3){//RMB
                //Start right click drag
                this.panel.state.mouseRightClick = true;
                this.panel.input.setSelectedNode(
                    this.panel.state.mouseOverNode,
                    e.shiftKey,
                    e.ctrlKey
                );
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
                this.panel.input.setSelectedNode(
                    this.panel.state.mouseOverNode,
                    e.shiftKey,
                    e.ctrlKey
                );
                //Calculate offsets in preparation for move
                this.panel.input.calculateNodeOffsets(gv);
            }
        }
        else{
            this.panel.state.mouseClick = true;
            //Deselect all nodes
            this.panel.selection.selectNode();
            //Prepare for scrolling
            this.panel.state.originalCV = cv;
            this.panel.state.originalGraphOffset = this.panel.spaceWorld.offset;
        }
        this.panel.display.draw();
    }

    onMouseUp(e){
        this.panel.state.mouseClick = false;
        if (this.panel.state.mouseOverNode){
            //Add edges
            if (this.panel.state.mouseRightClick){
                this.panel.state.tempEdgeList = [];
                this.panel.control.addEdges();
                this.panel.state.mouseRightClick = false;
            }
            this.panel.display.draw();
        }
        else{
            //Cancel add edges
            if (this.panel.state.mouseRightClick){
                this.panel.state.tempEdgeList = [];
                this.panel.state.mouseRightClick = false;
                this.panel.display.draw();
            }
        }
    }

    onMouseDoubleClick(e){
        let gv = this.space.convertPosition(cvsTL.reverseSubtract(e));
        if (this.panel.state.mouseOverNode){
            //Show/Hide Node Children
            let childrenUINodes = this.panel.graph.getNeighborsFrom(
                this.panel.state.mouseOverNode.node
            )
            .map(
                node => this.panel.nodeList[node.id]
            );
            if (childrenUINodes.length > 0){
                let visible = childrenUINodes[0].visible;
                this.panel.control.expandNodeHierarchy(
                    this.panel.state.mouseOverNode,
                    !visible
                );
                this.panel.autoLayout.autoLayout();
            }
        }
        else{
            //Add Node
            let uiNode = this.panel.control.addNode();            
            uiNode.setPosition(gv);
            this.panel.state.mouseOverNode = uiNode;
            this.setSelectedNode(uiNode, e.shiftKey, e.ctrlKey);
        }
        this.panel.display.draw();
    }

    //TODO: Allow deselecting a single node
    setSelectedNode(uiNode, shift, ctrl){
        if (!this.panel.selection.isNodeSelected(uiNode)){
            if (shift || ctrl){
                this.panel.selection.selectNodeToo(uiNode);
            }
            else{
                this.panel.selection.selectNode(uiNode);
            }
        }
    }

    calculateNodeOffsets(gv){
        for(let node of this.panel.selection.selectedNodes){
            node.calculateMouseOffset(gv);
        }
    }
}
