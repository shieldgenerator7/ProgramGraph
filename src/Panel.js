"use strict";

class Panel{
    constructor(graph, canvas){
        this.graph = graph;
        this.canvas = canvas;
        this.spaceWorld = new Space(this, graph);
        this.spaceCanvas = new Space(this, canvas);
        this.spaceWorld.otherSpace = this.spaceCanvas;
        this.spaceCanvas.otherSpace = this.spaceWorld;
        this.selection = new Selection();
        this.display = new PanelDisplay(this);
        this.input = new PanelInput(this);
        //For containing processing and input variables
        this.state = {
            mouseOverNode: undefined,
            mouseClick: false,
            mouseRightClick: false,
            tempEdgeList: [],
        };
        //
        //Node and Edges
        //
        this.nodeList = [];
        this.edgeList = [];
        //
        this.syncFromGraph();
        this.autoLayout();
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

    autoLayout(){
        let columns = this.canvas.clientWidth / 100;
        let v = new Vector2(1,1);
        for(let node of this.nodeList){
            if (!node){continue;}
            node.setPosition(v.scale(70));
            v.x++;
            if (v.x > columns){
                v.x = 1;
                v.y++;
            }
        }
    }
}
