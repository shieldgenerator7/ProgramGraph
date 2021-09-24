"use strict";

//In charge of displaying its assigned graph

class GraphDisplay{
    constructor(panel){
        this.panel = panel;
        this.space = panel.space;
        this.graph = panel.graph;
        this.canvas = panel.canvas;
        this.ctx = panel.canvas.getContext("2d");
    }

    autoLayout(){
        let columns = this.canvas.clientWidth / 100;
        let v = new Vector2(1,1);
        for(let node of this.space.nodeList){
            if (!node){continue;}
            node.setPosition(v.scale(70));
            v.x++;
            if (v.x > columns){
                v.x = 1;
                v.y++;
            }
        }
    }

    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        //draw temp tutorial text
        this.ctx.fillStyle = "#000000";
        this.ctx.lineWidth = 2;
        this.ctx.font = "15px Consolas";
        let instructions = [
            "Double click: Add Node",
            "Right click + Drag: Add Edge",
            "Click: Select Node",
            "Shift click: Multiselect Node",
        ];
        for(let i = 0; i < instructions.length; i++){
            this.ctx.fillText(instructions[i],10,20+i*20);
        }
        //draw temp edge
        if (inputManager.tempEdgeList.length > 0){
            for(let tempEdge of inputManager.tempEdgeList){
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
        for(let edge of this.space.edgeList){
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
        for(let node of this.space.nodeList){
            if (!node){continue;}
            this.ctx.strokeStyle = "#000000";
            this.ctx.fillStyle = "#AAAAAA";
            if (node===inputManager.mouseOverNode || node===inputManager.mouseRightClickNode){
                if (inputManager.mouseRightClickNode){
                    this.ctx.fillStyle = "#33DD33";
                }
                else{
                    this.ctx.fillStyle = "#5555FF";
                }
            }
            if (inputManager.panel.selection.isNodeSelected(node)){
                this.ctx.strokeStyle = "#FF5555";
            }
            let cTopLeft = this.space.convertPosition(node.topLeft);
            let cSize = new Vector2(
                this.space.convertWidth(node.size.x),
                this.space.convertHeight(node.size.y)
            );
            this.ctx.fillRect(
                cTopLeft.x,
                cTopLeft.y,
                cSize.x,
                cSize.y
            );
            this.ctx.strokeRect(
                cTopLeft.x,
                cTopLeft.y,
                cSize.x,
                cSize.y
            );
        }
    }
}
