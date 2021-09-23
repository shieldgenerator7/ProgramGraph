"use strict";

class Selection{
    constructor(){
        this.selectedNodes = [];
        this.selectedEdges = [];
    }

    selectNodes(...nodes){
        this.clearSelection();
        this.selectNodesToo(nodes);
    }

    selectNodesToo(...nodes){
        if (nodes[0].length > 0){
            this.selectedNodes = this.selectedNodes.concat(nodes[0]);
        }
    }

    selectEdges(...edges){
        this.clearSelection();
        this.selectEdgesToo(edges);
    }

    selectEdgesToo(...edges){
        if (edges[0].length > 0){
            this.selectedEdges = this.selectedEdges.concat(edges[0]);
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
