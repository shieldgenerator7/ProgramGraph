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
        //2021-10-02: copied from SyllableSight
        const input = document.createElement('input');
        input.type = "file";
        input.accept = ".html";
        input.multiple = false;
        let readFunc = (content) => {
            this.content = content;
            this._readContent();
            this.panel.nodeList = [];
            this.panel.edgeList = [];
            this.panel.syncFromGraph();
            this.panel.autoLayout.autoLayout();
            this.panel.display.draw();
        };
        input.addEventListener(
            'change',
            function (event) {
                const input = event.target;
                if ('files' in input && input.files.length > 0) {
                    let countFinished = 0;
                    for (let i = 0; i < input.files.length; i++) {
                        const file = input.files[i];
                        const reader = new FileReader();
                        (new Promise((resolve, reject) => {
                            reader.onload = event => resolve(event.target.result)
                            reader.onerror = error => reject(error)
                            reader.readAsText(file)
                        })).then(content => {
                            //Turn the content string into a graph
                            readFunc(content);
                            //Log it
                            console.log("file imported: ", file.name);
                            //Update counter
                            countFinished++;
                            if (countFinished == input.files.length) {
                            }
                        }).catch(error => console.error(error));
                    }
                }
            }
        );
        input.click();
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

    writeFile(){
        this._writeContent();
        //download content
        window.download(
            this.content,
            "index" + '.html',
            'data:application/txt'
        )
    }

    _writeContent(){
        let graph = this.panel.graph;
        this.content = "";
        let node = this.panel.autoLayout.hal.headUINode.node;
        this.content = this._writeContentNode(graph, node);
    }

    _writeContentNode(graph, node){
        let title = node.getTitle();
        //start tag
        let content = title;
        //inner html
        let childList = graph.getNeighborsFrom(node);
        childList.forEach((childNode, i) => {
            content += this._writeContentNode(graph, childNode);
        });
        //end tag
        if (title.startsWith("<")){
            content += title.slice(0,1) + "/" + title.slice(1);
        }
        return content;
    }
}
