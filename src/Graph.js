"use strict";

class Graph{
    constructor(){
        this.id = getNextId();
        this.nodeList = [];
        this.edgeList = [];
    }

    addNode(node){
        this.nodeList.push(node);
    }

    removeNode(node){
        let nodeId = node.id;
        //Remove node from list
        this.nodeList = this.nodeList.filter(
            (n) => n.id !== nodeId
        )
        //Remove edges that connected to the node
        this.edgeList = this.edgeList.filter(
            (edge) => edge.fromId != nodeId && edge.toId != nodeId
        );
    }

    addEdge(from, to){
        _addEdge(new Edge(from, to));
    }

    _addEdge(edge){
        this.edgeList.push(edge);
    }

    removeEdge(edge){
        this.edgeList = this.edgeList.filter(
            (e) => e.id !== edge.id
        );
    }
}
