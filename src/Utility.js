"use strict";

let $ = function(elementName){
    return document.getElementById(elementName);
}

Math.clamp = function(amount, min, max){
    return Math.max(min, Math.min(amount, max));
}

let round2 = function(amount){
    return Math.round(amount * 100) / 100;
}

//TODO: move into top-level data class
let nextId = 0;
let getNextId = function(){
    let thisId = nextId;
    nextId++;
    return thisId;
}
