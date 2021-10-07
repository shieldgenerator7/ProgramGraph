"use strict";

class UIEdge{
    constructor(edge, fromUI, toUI){
        this.edge = edge;
        this.from = fromUI;
        this.to = toUI;
        this.textList = [];
    }

    syncWithEdge(){
        this.textList = [];
        let list = [
            [this.edge.lblFrom, 0.1],
            [this.edge.label, 0.5],
            [this.edge.lblTo, 0.9],
        ]
        list.forEach(pair => {
            let label = pair[0];
            let percent = pair[1];
            if (!isEmpty(label)){
                let text = this.getTextObject(label, percent);
                this.textList.push(text);
            }
        });
    }

    getTextObject(str, percent){
        let text = {
            str: str,
            percent: percent,
            // position: new Vector2(0,0),
            // size: new Vector2(0,0),
            // align: "left",
        }
        // text.size = getTextSize(text.str);
        // text.position = this.getPosition(percent);
        return text;
    }

    getPosition(percent){
        return this.from.position.add(
            this.to.position.subtract(this.from.position).scale(percent)
        );
    }
}
