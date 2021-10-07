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
            n => n.id !== nodeId
        )
        //Remove edges that connected to the node
        this.edgeList = this.edgeList.filter(
            edge => edge.fromId != nodeId && edge.toId != nodeId
        );
    }

    getNode(nodeId){
        return this.nodeList.find(n => n.id == nodeId);
    }

    addEdge(from, to){
        let edge = new Edge(from, to);
        this._addEdge(edge);
        return edge;
    }

    _addEdge(edge){
        this.edgeList.push(edge);
    }

    removeEdge(edge){
        this.edgeList = this.edgeList.filter(
            e => e.id !== edge.id
        );
    }

    getEdge(edgeId){
        return this.edgeList.find(e => e.id == edgeId);
    }

    getNeighbors(node){
        let result = [];
        result.concat(this.getNeighborsFrom(node));
        result.concat(this.getNeighborsTo(node));
        return result;
    }
    getNeighborsFrom(node){
        return this.edgeList.filter(
            e => e.fromId == node.id
        )
        .map(
            e => this.getNode(e.toId)
        );
    }
    getNeighborsTo(node){
        return this.edgeList.filter(
            e => e.toId == node.id
        )
        .map(
            e => this.getNode(e.fromId)
        );
    }
    getEdgesFrom(from){
        return this.edgeList.filter(
            e => e.fromId == from.id
        );
    }
}
