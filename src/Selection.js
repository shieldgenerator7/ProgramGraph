"use strict";

class Selection{
    constructor(panel){
        this.panel = panel;
        this.selectedNodes = [];
        this.selectedEdges = [];
    }

    selectNode(node){
        this.clearSelection();
        this.selectNodeToo(node);
    }

    selectNodeToo(node){
        if (node && !this.isNodeSelected(node)){
            this.selectedNodes.push(node);
            this.panel.onSelectionChanged();
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
        this.panel.onSelectionChanged();
    }

    isNodeSelected(node){
        return this.selectedNodes.includes(node);
    }
}
