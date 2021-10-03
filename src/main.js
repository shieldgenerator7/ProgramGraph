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
    let graph = data.newGraph();
    //Init panel
    currentPanel = new Panel(graph, canvas);
    currentPanel.file.content="<html><body><p style='width:100px;'>Lorem ipsum</p><div id='divImg'><img src='icon.png'/></div></body></html>";
    currentPanel.file._readContent();
    currentPanel.syncFromGraph();
    currentPanel.autoLayout.autoLayout();
    currentPanel.display.draw();
}
initialize();
