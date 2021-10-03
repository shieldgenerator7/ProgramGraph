"use strict";

class InputManager{
    constructor(){
        document.onmousemove = this.onMouseMove;
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        document.ondblclick = this.onMouseDoubleClick;
    }

    onMouseMove(e){
        currentPanel.input.onMouseMove(cvsTL.reverseSubtract(e));
    }

    onMouseDown(e){
        currentPanel.input.onMouseDown(cvsTL.reverseSubtract(e));
    }

    onMouseUp(e){
        currentPanel.input.onMouseUp(cvsTL.reverseSubtract(e));
    }

    onMouseDoubleClick(e){
        currentPanel.input.onMouseDoubleClick(cvsTL.reverseSubtract(e));
    }
}
