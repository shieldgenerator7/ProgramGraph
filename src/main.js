"use strict";

let data = new Data();
let cvsTL;
let inputManager;
let panelManager;
function initialize(){
    //Update canvas size
    let canvas = $("cvsGraph");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let rectCVS = canvas.getBoundingClientRect();
    cvsTL = new Vector2(rectCVS.left, rectCVS.top);
    //Init InputManager
    inputManager = new InputManager();
    //Init PanelManager
    panelManager = new PanelManager();
    panelManager.openFile(
        GRAPH_HTML,
        "<html><body><p style='width:100px;'>Lorem ipsum</p><div id='divImg'>dorem olem reum<img src='icon.png'/></div></body></html>"
    );
}
initialize();
