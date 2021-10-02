"use strict";

class HierarchyAutoLayout{
    constructor(panel){
        this.panel = panel;
        this.headNode = this.findHeadNode();
    }

    findHeadNode(){
        let graph = this.panel.graph;
        let node = graph.nodeList[0];
        let parentNode = graph.getNeighborsTo(node)[0];
        while(parentNode){
            node = parentNode;
            parentNode = graph.getNeighborsTo(node)[0];
        }
        return this.panel.nodeList[node.id];
    }
}
