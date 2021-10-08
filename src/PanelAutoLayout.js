"use strict";

class PanelAutoLayout{
    constructor(panel){
        this.panel = panel;
    }

    autoLayout(){
        this.prepare();
        this.positionNodes();
    }

    prepare(){
        this.columns = this.panel.canvas.clientWidth / 100;
    }

    positionNodes(){
        let v = new Vector2(1,1);
        for(let node of this.panel.nodeList){
            if (!node){continue;}
            if (!node.autoPosition){continue;}
            node.setPosition(v.scale(70));
            v.x++;
            if (v.x > this.columns){
                v.x = 1;
                v.y++;
            }
        }
    }
}
