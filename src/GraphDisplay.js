"use strict";

//In charge of displaying its assigned graph

class GraphDisplay{
    constructor(space){
        this.space = space;
        this.graph = space.graph;
        this.canvas = space.canvas;
        this.ctx = space.canvas.getContext("2d");
    }

    autoLayout(){
        let columns = this.canvas.clientWidth / 100;
        let x = 1;
        let y = 1;
        for(let node of this.space.nodeList){
            if (!node){continue;}
            node.setPosition(70*x, 70*y);
            x++;
            if (x > columns){
                x = 1;
                y++;
            }
        }
    }

    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
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
        this.ctx.strokeStyle = "#000000";
        for(let node of this.space.nodeList){
            if (!node){continue;}
            this.ctx.fillStyle = "#AAAAAA";
            if (node===inputManager.mouseOverNode){
                this.ctx.fillStyle = "#FF5555";
            }
            this.ctx.fillRect(
                this.space.convertX(node.topLeft.x),
                this.space.convertY(node.topLeft.y),
                this.space.convertWidth(node.size.x),
                this.space.convertHeight(node.size.y)
            );
            this.ctx.strokeRect(
                this.space.convertX(node.topLeft.x),
                this.space.convertY(node.topLeft.y),
                this.space.convertWidth(node.size.x),
                this.space.convertHeight(node.size.y)
            );
        }
    }
}
