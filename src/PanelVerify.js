"use strict";

class PanelVerify{
    constructor(panel){
        this.panel = panel;
        this.graph = panel.graph;
    }

    validify(){
        this.graph = this.panel.graph;
        if (this.panel.settings.orderedChildren){
            this.graph.nodeList.forEach(node => {
                this.graph.getEdgesFrom(node).forEach((edge, i) => {
                    edge.setLabel((i+1) + ":");
                });
            });
        }
    }
}
