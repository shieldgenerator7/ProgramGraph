"use strict";

class Panel{
    constructor(graph, canvas){
        this.graph = graph;
        this.canvas = canvas;
        this.spaceWorld = new Space(canvas);//(graph);//TODO: make size differentials work better
        this.spaceCanvas = new Space(canvas);
        this.spaceCanvas.flip.y = -1;
        this.spaceWorld.setOtherSpace(this.spaceCanvas);
        this.spaceCanvas.setOtherSpace(this.spaceWorld);
        this.selection = new Selection();
        this.display = new PanelDisplay(this);
        this.input = new PanelInput(this);
        this.control = new PanelControl(this);
        this.autoLayout = new PanelAutoLayout(this);
        //For containing processing and input variables
        this.state = {
            mouseOverNode: undefined,
            mouseClick: false,
            mouseRightClick: false,
            tempEdgeList: [],
        };
        //Panel Settings, unique per panel type
        this.settings = {
            hierarchy: true,
        }
        //
        //Node and Edges
        //
        this.nodeList = [];
        this.edgeList = [];
        //
        this.syncFromGraph();
        this.autoLayout.autoLayout();
        this.display.draw();
    }

    //Update the list of nodes and edges from the graph
    //Does NOT start clear the ui lists first
    syncFromGraph(){
        //Remove deleted nodes
        for(let uiNode of this.nodeList){
            if (!uiNode){continue;}
            let nodeId = uiNode.node.id;
            if (!this.graph.nodeList.some((node)=>node.id == nodeId)){
                this.nodeList = this.nodeList.filter(
                    (n) => n !== nodeId
                )
            }
        }
        //Remove deleted edges
        for(let uiEdge of this.edgeList){
            if (!uiEdge){continue;}
            let edgeId = uiEdge.edge.id;
            if (!this.graph.edgeList.some((edge)=>edge.id == edgeId)){
                this.edgeList = this.edgeList.filter(
                    (e) => e !== edgeId
                )
            }
        }
        //Populate node and edge lists from graph
        let newNodes = [];
        for(let node of this.graph.nodeList){
            if (!this.nodeList[node.id]){
                let uiNode = new UINode(node);
                this.nodeList[node.id] = uiNode;
                newNodes.push(uiNode);
            }
        }
        for(let edge of this.graph.edgeList){
            if (!this.edgeList[edge.id]){
                let uiEdge = new UIEdge(edge, this.nodeList[edge.fromId], this.nodeList[edge.toId]);
                this.edgeList[edge.id] = uiEdge;
            }
        }
        return newNodes;
    }
}
