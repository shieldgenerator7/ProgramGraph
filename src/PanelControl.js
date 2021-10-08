"use strict";

class PanelControl{
    constructor(panel){
        this.panel = panel;
    }

    addNode(){
        let node = new Node();
        this.panel.graph.addNode(node);
        let newNodes = this.panel.syncFromGraph();
        let uiNode = newNodes[0];
        return uiNode;
    }

    addEdges(){
        for (let node of this.panel.selection.selectedNodes){
            let edge = this.panel.graph.addEdge(
                node.node,
                this.panel.state.mouseOverNode.node
            );
        }
        this.panel.syncFromGraph();
        this.panel.verify.validify();
        if (this.panel.settings.hierarchy){
            this.panel.autoLayout.autoLayout();
        }
    }
}
