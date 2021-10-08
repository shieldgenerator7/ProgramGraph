"use strict";

function HierarchyPanelFactory(panel){
    //
    // State
    //
    panel.settings = {
        hierarchy: true,
        allowMultipleHeadNodes: false,
        allowMultipleParents: false,
        allowLoops: false,
        allowEdgeSiblings: false,
        orderedChildren: false,
    }

    //
    // Display
    //

    //
    // Input
    //
    panel.input.setSelectedNode = function(uiNode, shift, ctrl){
        if (!this.panel.selection.isNodeSelected(uiNode)){
            if (shift){
                this.panel.selection.selectNodeToo(uiNode);
            }
            else{
                this.panel.selection.selectNode(uiNode);
            }
        }
        if (ctrl){
            if (!shift){
                this.panel.selection.selectNode(uiNode);
            }
            this.selectChildrenNodes(uiNode);
        }
    }

    //TODO: make this method work even when there's loops
    panel.input.selectChildrenNodes = function(uiNode){
        this.panel.selection.selectNodeToo(uiNode);
        let childrenUINodes = this.panel.graph.getNeighborsFrom(uiNode.node)
        .map(
            node => this.panel.nodeList[node.id]
        );
        // .filter(
        //     childUINode => !this.panel.selection.isNodeSelected(childUINode)
        // );
        childrenUINodes.forEach((childUINode, i) => {
            this.selectChildrenNodes(childUINode);
        });
    }

    //
    //Control
    //
    panel.control.expandNodeHierarchy = function(uiNode, expand){
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

    //
    //Verify
    //
    panel.verify.validify = function(){
        this.graph = this.panel.graph;
        if (this.panel.settings.orderedChildren){
            this.graph.nodeList.forEach(node => {
                this.graph.getEdgesFrom(node).forEach((edge, i) => {
                    edge.setLabel((i+1) + ":");
                });
            });
        }
    }

    //
    //Autolayout
    //

    //
    //File
    //
}
