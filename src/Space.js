"use strict";

class Space{
    constructor(panel){
        this.graph = panel.graph;
        this.canvas = panel.canvas;
        this.offset = new Vector2(0,0);
        this.size = new Vector2(100,100);
        this.zoomScale = 1;
        //
        //Node and Edges
        //
        this.nodeList = [];
        this.edgeList = [];
        this.syncFromGraph();
        //Selection
        this.selection = new Selection();
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

    //converts to canvas x
    convertX(gx){
        return gx + this.offset.x;
    }
    //converts to canvas y
    convertY(gy){
        return (this.canvas.clientHeight - (gy + this.offset.y));
    }
    convertPosition(gv){
        return new Vector2(this.convertX(gv.x),this.convertY(gv.y));
    }
    //converts to canvas width
    convertWidth(width){
        return width;
    }
    //converts to canvas height
    convertHeight(height){
        return height;
    }

    //converts from canvas x
    convertFromX(cx){
        return cx - this.offset.x;
    }
    //converts from canvas y
    convertFromY(cy){
        return -(cy - this.canvas.clientHeight) - this.offset.y;
    }
    convertFromPosition(cv){
        return new Vector2(this.convertFromX(cv.x),this.convertFromY(cv.y));
    }
}
