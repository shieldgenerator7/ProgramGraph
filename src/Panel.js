"use strict";

class Panel{
    constructor(graph, canvas){
        this.graph = graph;
        this.canvas = canvas;
        this.spaceWorld = new Space(canvas);//(graph);//TODO: make size differentials work better
        this.spaceCanvas = new Space(canvas);
        this.spaceCanvas.flip.y = -1;
        this.spaceWorld.setOtherSpace(this.spaceCanvas);
        this.spaceCanvas.setOtherSpace(this.spaceWorld);
        //For containing processing and input variables
        this.state = {
            mouseOverNode: undefined,
            mouseClick: false,
            mouseRightClick: false,
            tempEdgeList: [],
            originalCV: new Vector2(0,0),
            originalGraphOffset: new Vector2(0,0),
        };
        //Panel Settings, unique per panel type
        this.settings = {
            hierarchy: false,
            allowMultipleHeadNodes: true,
            allowMultipleParents: true,
            allowLoops: true,
            allowEdgeSiblings: true,
            orderedChildren: false,
        }
        //Components
        this.selection = new Selection(this);
        this.display = new PanelDisplay(this);
        this.input = new PanelInput(this);
        this.control = new PanelControl(this);
        this.verify = new PanelVerify(this);
        this.autoLayout = new PanelAutoLayout(this);
        this.file = new PanelFile(this);
        //
        //Node and Edges
        //
        this.nodeList = [];
        this.edgeList = [];
        //Register text on change events
        registerTextOnChange(
            $("txtTitle"),
            this.onTitleTextChanged
        );
        registerTextOnChange(
            $("txtAttributes"),
            this.onAttributeTextChanged
        );
        //
        if (this.graph){
            this.syncFromGraph();
        }
    }

    //Update the list of nodes and edges from the graph
    //Does NOT start clear the ui lists first
    syncFromGraph(){
        //Remove deleted nodes
        for(let uiNode of this.nodeList){
            if (!uiNode){continue;}
            let nodeId = uiNode.node.id;
            if (!this.graph.nodeList.some((node)=>node.id == nodeId)){
                this.nodeList = this.nodeList.filter(
                    (n) => n !== nodeId
                )
            }
        }
        //Remove deleted edges
        for(let uiEdge of this.edgeList){
            if (!uiEdge){continue;}
            let edgeId = uiEdge.edge.id;
            if (!this.graph.edgeList.some((edge)=>edge.id == edgeId)){
                this.edgeList = this.edgeList.filter(
                    (e) => e !== edgeId
                )
            }
        }
        //Populate node and edge lists from graph
        let newNodes = [];
        for(let node of this.graph.nodeList){
            if (!this.nodeList[node.id]){
                let uiNode = new UINode(node);
                this.nodeList[node.id] = uiNode;
                newNodes.push(uiNode);
            }
        }
        for(let edge of this.graph.edgeList){
            if (!this.edgeList[edge.id]){
                let uiEdge = new UIEdge(edge, this.nodeList[edge.fromId], this.nodeList[edge.toId]);
                this.edgeList[edge.id] = uiEdge;
            }
        }
        return newNodes;
    }

    onSelectionChanged(){
        if (this.selection.selectedNodes.length > 0){
            //Title
            let collectiveTitle = this.selection.selectedNodes[0].node.getTitle();
            this.selection.selectedNodes.forEach((uiNode, i) => {
                if (uiNode.node.getTitle() != collectiveTitle){
                    collectiveTitle = "---";
                }
            });
            $("txtTitle").value = collectiveTitle;
            //Attributes
            let collectiveAttrStr = this.selection.selectedNodes[0].node.getAttributeString();
            this.selection.selectedNodes.forEach((uiNode, i) => {
                if (uiNode.node.getAttributeString() != collectiveAttrStr){
                    collectiveAttrStr = "---";
                }
            });
            $("txtAttributes").value = collectiveAttrStr;
        }
    }

    onTitleTextChanged(){
        let panel = panelManager.currentPanel;
        if (panel.selection.selectedNodes.length){
            let newTitle = $("txtTitle").value;
            panel.selection.selectedNodes.map(uiNode=>uiNode.node)
            .forEach(node => {
                node.setTitle(newTitle);
            });
            panel.display.draw();
        }
    }

    onAttributeTextChanged(){
        let panel = panelManager.currentPanel;
        if (panel.selection.selectedNodes.length){
            let newAttrs = $("txtAttributes").value;
            panel.selection.selectedNodes.map(uiNode=>uiNode.node)
            .forEach(node => {
                node.clearAttributes();
                node.addAttributesFromString(newAttrs,"\n");
            });
            panel.display.draw();
        }
    }
}
