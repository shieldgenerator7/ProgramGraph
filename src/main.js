"use strict";

let data = new Data();
let currentPanel;
let inputManager;
function initialize(){
    //Update canvas size
    let canvas = $("cvsGraph");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    //Init InputManager
    inputManager = new InputManager();
    //Init data
    data.newGraph();
    let graph = data.graphList[0];
    let node1 = new Node();
    let node2 = new Node();
    graph.addNode(node1);
    graph.addNode(node2);
    graph.addEdge(node1,node2);
    //Init panel
    currentPanel = new Panel(graph, canvas);
    currentPanel.display.autoLayout();
    currentPanel.display.draw();
}
initialize();
