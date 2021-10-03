"use strict";

class Node{
    constructor(){
        this.id = getNextId();
        this.title = undefined;
        this.attributes = [];
    }

    getTitle(){
        return this.title ?? this.id;
    }
}
