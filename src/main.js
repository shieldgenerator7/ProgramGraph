"use strict";

let data = new Data();
let currentPanel;
let inputManager;
let cvsTL;
function initialize(){
    //Update canvas size
    let canvas = $("cvsGraph");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let rectCVS = canvas.getBoundingClientRect();
    cvsTL = new Vector2(rectCVS.left, rectCVS.top);
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
    //currentPanel.file.readFile();
    currentPanel.syncFromGraph();
    currentPanel.autoLayout.autoLayout();
    currentPanel.display.draw();
}
initialize();
