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

    getAttributeString(){
        return this.attributes.join("\n");
    }

    addAttributesFromString(strAttrs, separator){
        let attrs = strAttrs.split(separator);
        attrs.map(str => str.trim());
        this.attributes = this.attributes.concat(attrs);
    }

    clearAttributes(){
        this.attributes = [];
    }
}
