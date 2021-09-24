"use strict";

class Panel{
    constructor(graph, canvas){
        this.graph = graph;
        this.canvas = canvas;
        this.space = new Space(this);
        this.selection = new Selection();
        this.display = new PanelDisplay(this);
        this.input = new InputManager(this);
        //For containing processing and input variables
        this.state = {
            mouseOverNode: undefined,
            mouseClick: false,
            mouseRightClick: false,
            tempEdgeList: [],
        };
    }
}
