"use strict";

class Node{
    constructor(){
        this.id = getNextId();
        this.title = undefined;
        this.attributes = [];
        this.onChange = undefined;
    }

    getTitle(){
        return this.title ?? this.id;
    }

    setTitle(text){
        this.title = text;
        this.onChange?.();
    }
}
