"use strict";

class HierarchyAutoLayout{
    constructor(panel){
        this.panel = panel;
        this.graph = this.panel.graph;
        this.headUINodeList = this.findHeadUINodes();
        this.rows = [];
        this.populateRows();
        this.positionNodes();
    }

    findHeadUINodes(){
        return this.panel.nodeList.filter(
            uiNode => this.graph.getNeighborsTo(uiNode.node).length == 0
        );
    }

    populateRows(){
        this.rows = [];
        this.rows[0] = [];
        this.rows[0] = this.rows[0].concat(this.headUINodeList);
        this.headUINodeList.forEach((headUINode, i) => {
            this._populateRows(headUINode, 1);
        });
    }
    _populateRows(parentUINode, rowId){
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

    positionNodes(){
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
}
