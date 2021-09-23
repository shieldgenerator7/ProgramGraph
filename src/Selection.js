"use strict";

class Selection{
    constructor(){
        this.selectedNodes = [];
        this.selectedEdges = [];
    }

    selectNode(node){
        this.clearSelection();
        this.selectNodeToo(node);
    }

    selectNodeToo(node){
        if (node){
            this.selectedNodes.push(node);
        }
    }

    selectEdge(edge){
        this.clearSelection();
        this.selectEdgeToo(edge);
    }

    selectEdgeToo(edge){
        if (edge){
            this.selectedEdges.push(edge);
        }
    }

    clearSelection(){
        this.selectedNodes = [];
        this.selectedEdges = [];
    }

    isNodeSelected(node){
        return this.selectedNodes.includes(node);
    }
}
