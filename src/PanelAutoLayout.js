"use strict";

class PanelAutoLayout{
    constructor(panel){
        this.panel = panel;
    }

    autoLayout(){
        if (this.panel.settings.hierarchy){
            this.autoLayoutHierarchy();
        }
        else{
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
    }

    autoLayoutHierarchy(){
        this.hal = new HierarchyAutoLayout(this.panel);
    }
}
