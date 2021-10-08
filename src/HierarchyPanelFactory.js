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
    let that = panel.autoLayout;
    that.headUINodeList = [];
    that.rows = [];

    panel.autoLayout.findHeadUINodes = function(){
        return that.panel.nodeList.filter(
            uiNode => that.graph.getNeighborsTo(uiNode.node).length == 0
        );
    }

    panel.autoLayout.prepare = function(){
        that.headUINodeList = that.findHeadUINodes();
        that.rows = [];
        that.rows[0] = [];
        that.rows[0] = that.rows[0].concat(that.headUINodeList);
        that.headUINodeList.forEach((headUINode, i) => {
            that._populateRows(headUINode, 1);
        });
    }
    panel.autoLayout._populateRows = function(parentUINode, rowId){
        let childrenUINodes = that.graph.getNeighborsFrom(parentUINode.node)
        .map(
            node => that.panel.nodeList[node.id]
        )
        .filter(
            uiNode => uiNode.visible
        );
        if (childrenUINodes.length > 0){
            if (!that.rows[rowId]){
                that.rows[rowId] = [];
            }
            that.rows[rowId] = that.rows[rowId].concat(childrenUINodes);
            childrenUINodes.forEach((uiNode, i) => {
                that._populateRows(uiNode, rowId+1);
            });
        }
    }

    panel.autoLayout.positionNodes = function(){
        let buffer = new Vector2(70, 70);
        let v = new Vector2(1,1);
        that.panel.nodeList.forEach((uiNode, i) => {
            uiNode.childPosition = new Vector2(
                uiNode.topLeft.x,
                uiNode.position.y-uiNode.size.y-HEIGHT_BUFFER
            )
        });
        for(let i = 0; i < that.rows.length; i++){
            v.y = that.panel.spaceWorld.size.y - ((i+1) * buffer.y);
            for(let j = 0; j < that.rows[i].length; j++){
                v.x = (j+1) * buffer.x;
                let uiNode = that.rows[i][j];
                if (uiNode.autoPosition){
                    if (i > 0){
                        let parentUINode = that.panel.nodeList[
                            that.graph.getNeighborsTo(uiNode.node)[0].id
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
