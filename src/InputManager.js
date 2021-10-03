"use strict";

class InputManager{
    constructor(){
        document.onmousemove = this.onMouseMove;
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        document.ondblclick = this.onMouseDoubleClick;
    }

    onMouseMove(e){
        if (inputManager.isMouseOnPanel(e)){
            currentPanel.input.onMouseMove(e);
        }
    }

    onMouseDown(e){
        if (inputManager.isMouseOnPanel(e)){
            currentPanel.input.onMouseDown(e);
        }
    }

    onMouseUp(e){
        if (inputManager.isMouseOnPanel(e)){
            currentPanel.input.onMouseUp(e);
        }
    }

    onMouseDoubleClick(e){
        if (inputManager.isMouseOnPanel(e)){
            currentPanel.input.onMouseDoubleClick(e);
        }
    }

    isMouseOnPanel(e){
        let canvas = $("cvsGraph");
        let boxCVS = canvas.getBoundingClientRect();
        return e.x >= boxCVS.left && e.x <= boxCVS.right
            && e.y >= boxCVS.top && e.y <= boxCVS.bottom;
    }
}
