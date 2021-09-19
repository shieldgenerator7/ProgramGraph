"use strict";

class Space{
    constructor(graph, canvas){
        this.graph = graph;
        this.canvas = canvas;
        this.offset = {
            x: 0,
            y: 0
        };
        this.size = {
            x: 100,
            y: 100
        };
        this.zoomScale = 1;
        //
        //Node and Edges
        //
        this.nodeList = [];
        this.edgeList = [];
        //Populate node and edge lists from graph
        for(let node of graph.nodeList){
            let uiNode = new UINode(node);
            this.nodeList[node.id] = uiNode;
        }
        for(let edge of graph.edgeList){
            let uiEdge = new UIEdge(edge, this.nodeList[edge.fromId] ,this.nodeList[edge.toId]);
            this.edgeList[edge.id] = uiEdge;
        }
    }

    //converts to canvas x
    convertX(gx){
        return gx + this.offset.x;
    }
    //converts to canvas y
    convertY(gy){
        return (this.canvas.clientHeight - (gy + this.offset.y));
    }
}
