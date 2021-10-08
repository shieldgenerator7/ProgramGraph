"use strict";

function HTMLPanelFactory(panel){
    const TAGS_SINGULAR = [
        "link",
        "meta",
        "br",
    ];

    //
    // State
    //
    panel.settings = {
        hierarchy: true,
        allowMultipleHeadNodes: true,
        allowMultipleParents: false,
        allowLoops: false,
        allowEdgeSiblings: false,
        orderedChildren: true,
    }

    //
    // Display
    //

    //
    // Input
    //

    //
    // Control
    //
    panel.control._base_addNode = panel.control.addNode;
    panel.control.addNode = function(){
        let uiNode = panel.control._base_addNode();
        let commonTitle = mode(panel.graph.nodeList.map(node=>node.title));
        uiNode.node.setTitle(commonTitle);
        return uiNode;
    }

    //
    // Verify
    //

    //
    // Autolayout
    //

    //
    // File
    //
    let that = panel.file;
    that.fileName = "index.html";
    that.content = undefined;

    panel.file._readContent = function(){
        let titleList = that.content.split("<");
        titleList = titleList
            .filter(title => title!=undefined && title.length>0)
            .map(title => "<"+title.trim() );
        that._readTitleList(titleList);
    }

    panel.file._readTitleList = function(list){
        let graph = data.newGraph(GRAPH_HTML);
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
                    newNode.addAttributesFromString(attr,/[ \n\t]+/);
                }
                newNode.setTitle(title);
                graph.addNode(newNode);
                if (parentNode){
                    graph.addEdge(parentNode, newNode);
                }
                if (!that.isTagSingular(title)){
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
        that.panel.graph = graph;
    }

    panel.file._writeContent = function(){
        let graph = that.panel.graph;
        that.content = "";
        that.panel.autoLayout.headUINodeList.forEach((headUINode, i) => {
            let node = headUINode.node;
            that.content += that._writeContentNode(graph, node, -1);
        });
        that.content = that.content.trim();
    }

    panel.file._writeContentNode = function(graph, node, level){
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
        if (title.startsWith("<") && !that.isTagSingular(title)){
            if (prevContentLength != content.length){
                content += "\n"+tabs;
            }
            content += title.slice(0,1) + "/" + title.slice(1);
        }
        return content;
    }

    panel.file.isTagSingular = function(title){
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
