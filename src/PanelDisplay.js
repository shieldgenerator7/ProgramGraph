"use strict";

//In charge of displaying its assigned graph

class PanelDisplay{
    constructor(panel){
        this.panel = panel;
        this.space = panel.spaceCanvas;
        this.graph = panel.graph;
        this.canvas = panel.canvas;
        this.ctx = panel.canvas.getContext("2d");
    }

    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        //draw temp tutorial text
        this.ctx.fillStyle = "#000000";
        this.ctx.lineWidth = 2;
        this.ctx.font = "15px Consolas";
        //draw temp edge
        if (this.panel.state.tempEdgeList.length > 0){
            for(let tempEdge of this.panel.state.tempEdgeList){
                this.ctx.strokeStyle = "#33DD33";
                this.ctx.beginPath();
                this.ctx.moveTo(
                    this.space.convertX(tempEdge.from.position.x),
                    this.space.convertY(tempEdge.from.position.y)
                );
                this.ctx.lineTo(
                    this.space.convertX(tempEdge.to.position.x),
                    this.space.convertY(tempEdge.to.position.y)
                );
                this.ctx.stroke();
            }
        }
        //draw edges
        this.ctx.strokeStyle = "#000000";
        for(let edge of this.panel.edgeList){
            if (!edge){continue;}
            this.ctx.beginPath();
            this.ctx.moveTo(
                this.space.convertX(edge.from.position.x),
                this.space.convertY(edge.from.position.y)
            );
            this.ctx.lineTo(
                this.space.convertX(edge.to.position.x),
                this.space.convertY(edge.to.position.y)
            );
            this.ctx.stroke();
        }
        //draw nodes
        for(let node of this.panel.nodeList){
            if (!node){continue;}
            //Special styling based on panel state
            this.ctx.strokeStyle = "#000000";
            this.ctx.fillStyle = "#AAAAAA";
            if (node===this.panel.state.mouseOverNode || node===this.panel.state.mouseRightClickNode){
                if (this.panel.state.mouseRightClickNode){
                    this.ctx.fillStyle = "#33DD33";
                }
                else{
                    this.ctx.fillStyle = "#5555FF";
                }
            }
            if (this.panel.selection.isNodeSelected(node)){
                this.ctx.strokeStyle = "#FF5555";
            }
            //Get Size
            let cPos = this.space.convertPosition(node.position);
            let cTopLeft = this.space.convertPosition(node.topLeft);
            let cSize = new Vector2(
                this.space.convertWidth(node.size.x),
                this.space.convertHeight(node.size.y)
            );
            //Node Background
            this.ctx.fillRect(
                cTopLeft.x,
                cTopLeft.y,
                cSize.x,
                cSize.y
            );
            //Node Border
            this.ctx.strokeRect(
                cTopLeft.x,
                cTopLeft.y,
                cSize.x,
                cSize.y
            );
            //Text
            this.ctx.fillStyle = "#000000";
            this.ctx.fillText(
                node.node.getTitle(),
                cPos.x,
                cPos.y
            );
        }
    }
}
