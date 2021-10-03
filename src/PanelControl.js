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

    expandNodeHierarchy(uiNode, expand){
        let childrenUINodes = this.panel.graph.getNeighborsFrom(uiNode.node)
        .map(
            node => this.panel.nodeList[node.id]
        );
        childrenUINodes.forEach((childUINode, i) => {
            childUINode.visible = expand;
            childUINode.autoPosition = true;
            this.expandNodeHierarchy(childUINode, expand);
        });
    }
}
