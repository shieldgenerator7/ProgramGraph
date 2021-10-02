"use strict";

class PanelAutoLayout{
    constructor(panel){
        this.panel = panel;
    }

    autoLayout(){
        if (this.panel.settings.hierarchy){
            this.autoLayoutHierarchy();
        }
        let columns = this.panel.canvas.clientWidth / 100;
        let v = new Vector2(1,1);
        for(let node of this.panel.nodeList){
            if (!node){continue;}
            if (node.position.x != 0){continue;}
            node.setPosition(v.scale(70));
            v.x++;
            if (v.x > columns){
                v.x = 1;
                v.y++;
            }
        }
    }

    autoLayoutHierarchy(){
        let hal = new HierarchyAutoLayout(this.panel);
        console.log("hal head node: "+hal.headNode.node.id);
    }
}
