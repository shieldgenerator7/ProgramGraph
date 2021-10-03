"use strict";

const TAGS_SINGULAR = [
    "link",
    "meta",
    "br",
];

class PanelFile{
    constructor(panel){
        this.panel = panel;
        this.fileName = "index.html";
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
            this.content = content.trim();
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
                let split = title.split(">");
                let afterTagEnd = "";
                if (split[1] && split[1].length > 0){
                    afterTagEnd = split[1].trim();
                    title = split[0].trim()+">";
                }
                if (title.includes(" ")){
                    let idx = title.indexOf(" ");
                    let eL = (title.endsWith("/>")) ?"/>" :">";
                    let attr = title.slice(idx+1, title.length-eL.length);
                    title = title.slice(0, idx)+eL;
                    //
                    newNode.addAttributesFromString(attr,/[ \n]+/);
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
            this.content += this._writeContentNode(graph, node, -1);
        });
        this.content = this.content.trim();
    }

    _writeContentNode(graph, node, level){
        let title = node.getTitle().trim();
        let tabs = " ".repeat(Math.max(level,0)*4);
        //start tag
        let content = "\n";
        if (node.attributes.length > 0){
            let eL = (title.endsWith("/>")) ?"/>" :">";
            content += tabs + title.slice(0, title.length-(eL.length))+" ";
            node.attributes.forEach((attr, i) => {
                content += attr+" ";
            });
            content = content.trimEnd();
            content += eL;
        }
        else{
            content += tabs + title;
        }
        let prevContentLength = content.length;
        //inner html
        let childList = graph.getNeighborsFrom(node);
        childList.forEach((childNode, i) => {
            content += this._writeContentNode(graph, childNode, level+1);
        });
        //end tag
        if (title.startsWith("<") && !this.isTagSingular(title)){
            if (prevContentLength != content.length){
                content += "\n"+tabs;
            }
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
