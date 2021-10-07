"use strict";

class Edge{
    constructor(from, to){
        this.id = getNextId();
        this.fromId = from.id;
        this.toId = to.id;
        this.label = "";
        this.lblFrom = "";
        this.lblTo = "";

        this.onChange = undefined;
    }

    setLabel(label){
        this.label = label;
        this.onChange?.();
    }
}
