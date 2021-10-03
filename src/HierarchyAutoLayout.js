"use strict";

class HierarchyAutoLayout{
    constructor(panel){
        this.panel = panel;
        this.graph = this.panel.graph;
        this.headUINode = this.findHeadUINode();
        this.rows = [];
        this.populateRows();
        this.positionNodes();
    }

    findHeadUINode(){
        let node = this.graph.nodeList[0];
        let parentNode = this.graph.getNeighborsTo(node)[0];
        while(parentNode){
            node = parentNode;
            parentNode = this.graph.getNeighborsTo(node)[0];
        }
        return this.panel.nodeList[node.id];
    }

    populateRows(){
        this.rows = [];
        this.rows[0] = [this.headUINode];
        this._populateRows(this.headUINode, 1);
    }
    _populateRows(parentUINode, rowId){
        let childrenUINodes = this.graph.getNeighborsFrom(parentUINode.node)
        .map(
            node => this.panel.nodeList[node.id]
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
        for(let i = 0; i < this.rows.length; i++){
            v.y = this.panel.spaceWorld.size.y - ((i+1) * buffer.y);
            for(let j = 0; j < this.rows[i].length; j++){
                v.x = (j+1) * buffer.x;
                this.rows[i][j].setPosition(v.scale(1));
            }
        }
    }
}
