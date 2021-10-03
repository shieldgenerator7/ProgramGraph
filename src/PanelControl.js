"use strict";

class PanelControl{
    constructor(panel){
        this.panel = panel;
    }

    addEdges(){
        for (let node of this.panel.selection.selectedNodes){
            let edge = this.panel.graph.addEdge(
                node.node,
                this.panel.state.mouseOverNode.node
            );
        }
        this.panel.syncFromGraph();
        if (this.panel.settings.hierarchy){
            this.panel.autoLayout.autoLayout();
        }
    }
}
