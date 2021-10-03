"use strict";

const TAGS_SINGULAR = [
    "link",
    "meta",
    "br",
];

class PanelFile{
    constructor(panel){
        this.panel = panel;
        this.fileName = "panelgraph.txt"
        this.content = undefined;
    }

    readFile(){
        //read file
        //2021-10-02: copied from SyllableSight
        const input = document.createElement('input');
        input.type = "file";
        input.accept = ".html";
        input.multiple = false;
        let readFunc = (filename, content) => {
            this.fileName = filename;
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
                            readFunc(file.name, content);
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
                let afterTagEnd = title.split(">")[1].trim();
                if (afterTagEnd.length > 0){
                    title = title.split(">")[0].trim()+">";
                }
                newNode.setTitle(title);
                graph.addNode(newNode);
                if (parentNode){
                    graph.addEdge(parentNode, newNode);
                }
                if (!this.isTagSingular(title)){
                    //go into subnodes with the new node
                    parentNode = newNode;
                }
                if (afterTagEnd.length > 0){
                    newNode = new Node();
                    newNode.setTitle(afterTagEnd);
                    graph.addNode(newNode);
                    if (parentNode){
                        graph.addEdge(parentNode, newNode);
                    }
                }
            }
        }
        this.panel.graph = graph;
    }

    writeFile(){
        this._writeContent();
        //download content
        window.download(
            this.content,
            this.fileName,
            'data:application/txt'
        )
    }

    _writeContent(){
        let graph = this.panel.graph;
        this.content = "";
        this.panel.autoLayout.hal.headUINodeList.forEach((headUINode, i) => {
            let node = headUINode.node;
            this.content += this._writeContentNode(graph, node);
        });
    }

    _writeContentNode(graph, node){
        let title = node.getTitle().trim();
        //start tag
        let content = title;
        //inner html
        let childList = graph.getNeighborsFrom(node);
        childList.forEach((childNode, i) => {
            content += this._writeContentNode(graph, childNode);
        });
        //end tag
        if (title.startsWith("<") && !this.isTagSingular(title)){
            content += title.slice(0,1) + "/" + title.slice(1);
        }
        return content;
    }

    isTagSingular(title){
        if (title.startsWith("<!")
            || title.endsWith("/>")
        ){
            return true;
        }
        //Turn "<link rel='stylesheet'>" into "link"
        let tag = title.replace("<","").replace(">","").split(/[ \n\t]+/)[0].trim();
        if (TAGS_SINGULAR.includes(tag)){
            return true;
        }
        return false;
    }
}
