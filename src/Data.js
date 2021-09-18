"use strict";

class Data{
    constructor(){
        this.graphList = [];
        this.nextId = 0;
    }

    newGraph(){
        let graph = new Graph();
        graphList.push(graph);
    }
}

let data = new Data();

let getNextId = function(){
    let thisId = data.nextId;
    data.nextId++;
    return thisId;
}
