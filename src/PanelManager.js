"use strict";

class PanelManager{
    constructor(){
        this.panelList = [];
        this.currentPanel = undefined;
        this.canvas = $("cvsGraph");
    }

    openFile(type, content){
        let panel = this.newPanel(type);
        panel.file.content = content;
        panel.file._readContent();
        panel.syncFromGraph();
        panel.verify.validify();
        panel.autoLayout.autoLayout();
        panel.display.draw();
        this.currentPanel = panel;
    }

    openGraph(graph){
        let alreadyOpenPanel = this.panelList.filter(
            panel => panel.graph == graph
        )[0];
        if (alreadyOpenPanel){
            this.currentPanel = alreadyOpenPanel;
        }
        else{
            let panel = this.newPanel(graph.type);
            this.currentPanel = panel;
        }
    }

    newPanel(type){
        let panel = new Panel(undefined, this.canvas);
        switch(type){
            case GRAPH_VANILLA:
                break;
            case GRAPH_CLASS:
                break;
            case GRAPH_OBJECT:
                break;
            case GRAPH_METHOD:
                break;
            case GRAPH_STORY:
                break;
            case GRAPH_UPDATE:
                break;
            case GRAPH_PROJECT:
                break;
            case GRAPH_HTML:
                HierarchyPanelFactory(panel);
                HTMLPanelFactory(panel);
                break;
            default:
                console.error("Type not recognized: "+type);
        }
        this.panelList.push(panel);
        return panel;
    }
}
