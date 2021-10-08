"use strict";

function HierarchyPanelFactory(panel){
    //
    // State
    //
    panel.settings = {
        hierarchy: true,
        allowMultipleHeadNodes: false,//TODO: implement this option
        allowMultipleParents: false,//TODO: implement this option
        allowLoops: false,//TODO: implement this option
        allowEdgeSiblings: false,//TODO: implement this option
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
    this = panel.autoLayout;
    this.panel = panel;
    this.graph = this.panel.graph;
    this.headUINodeList = [];
    this.rows = [];

    panel.autoLayout.findHeadUINodes = function(){
        return this.panel.nodeList.filter(
            uiNode => this.graph.getNeighborsTo(uiNode.node).length == 0
        );
    }

    panel.autoLayout.prepare = function(){
        this.headUINodeList = this.findHeadUINodes();
        this.rows = [];
        this.rows[0] = [];
        this.rows[0] = this.rows[0].concat(this.headUINodeList);
        this.headUINodeList.forEach((headUINode, i) => {
            this._populateRows(headUINode, 1);
        });
    }
    panel.autoLayout._populateRows = function(parentUINode, rowId){
        let childrenUINodes = this.graph.getNeighborsFrom(parentUINode.node)
        .map(
            node => this.panel.nodeList[node.id]
        )
        .filter(
            uiNode => uiNode.visible
        );
        if (childrenUINodes.length > 0){
            if (!this.rows[rowId]){
                this.rows[rowId] = [];
            }
            this.rows[rowId] = this.rows[rowId].concat(childrenUINodes);
            childrenUINodes.forEach((uiNode, i) => {
                this._populateRows(uiNode, rowId+1);
            });
        }
    }

    panel.autoLayout.positionNodes = function(){
        let buffer = new Vector2(70, 70);
        let v = new Vector2(1,1);
        this.panel.nodeList.forEach((uiNode, i) => {
            uiNode.childPosition = new Vector2(
                uiNode.topLeft.x,
                uiNode.position.y-uiNode.size.y-HEIGHT_BUFFER
            )
        });
        for(let i = 0; i < this.rows.length; i++){
            v.y = this.panel.spaceWorld.size.y - ((i+1) * buffer.y);
            for(let j = 0; j < this.rows[i].length; j++){
                v.x = (j+1) * buffer.x;
                let uiNode = this.rows[i][j];
                if (uiNode.autoPosition){
                    if (i > 0){
                        let parentUINode = this.panel.nodeList[
                            this.graph.getNeighborsTo(uiNode.node)[0].id
                        ];
                        parentUINode.childPosition.x += uiNode.halfSize.x;
                        uiNode.setPosition(parentUINode.childPosition);
                        parentUINode.childPosition.x += uiNode.halfSize.x + WIDTH_BUFFER;
                    }
                    else{
                        uiNode.setPosition(v);
                    }
                }
            }
        }
    }

    //
    //File
    //
}
