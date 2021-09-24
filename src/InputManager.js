"use strict";

class InputManager{
    constructor(){
        document.onmousemove = this.onMouseMove;
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        document.ondblclick = this.onMouseDoubleClick;
    }

    onMouseMove(e){
        currentPanel.input.onMouseMove(e);
    }

    onMouseDown(e){
        currentPanel.input.onMouseDown(e);
    }

    onMouseUp(e){
        currentPanel.input.onMouseUp(e);
    }

    onMouseDoubleClick(e){
        currentPanel.input.onMouseDoubleClick(e);
    }
}
