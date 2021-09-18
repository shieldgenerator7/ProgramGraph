"use strict";

class Edge{
    constructor(from, to){
        this.id = getNextId();
        this.fromId = from.id;
        this.toId = to.id;
    }
}
