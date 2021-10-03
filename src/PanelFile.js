"use strict";

class PanelFile{
    constructor(panel){
        this.panel = panel;
        this.fileName = "panelgraph.txt"
        this.content = undefined;
    }

    readFile(filename){
        this.fileName = filename ?? this.fileName;
        //read file
        this.content = "<html><body><p></p><p></p></body></html>";
        this._readContent();
    }

    writeFile(){
        this._writeContent();
        //download content
    }

    _readContent(){
        let titleList = this.content.split("<");
        titleList = titleList
            .filter(title => title!=undefined && title.length>0)
            .map(title => "<"+title.trim() );
        this._readTitleList(titleList);
    }

    _readTitleList(list){
        let graph = new Graph();
        let parentNode = undefined;
        for (let i = 0; i < list.length; i++){
            let title = list[i];
            if (title.startsWith("</")){
                //end current node
                parentNode = graph.getNeighborsTo(parentNode)[0];
            }
            else{
                let newNode = new Node();
                newNode.setTitle(title);
                graph.addNode(newNode);
                if (parentNode){
                    graph.addEdge(parentNode, newNode);
                }
                parentNode = newNode;
            }
        }
        this.panel.graph = graph;
    }

    _writeContent(){

    }
}
