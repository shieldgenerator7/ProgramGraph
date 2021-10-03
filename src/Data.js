"use strict";

class Data{
    constructor(){
        this.graphList = [];
        this.nextId = 0;
    }

    newGraph(){
        let graph = new Graph();
        this.graphList.push(graph);
        return graph;
    }
}

let getNextId = function(){
    let thisId = data.nextId;
    data.nextId++;
    return thisId;
}
