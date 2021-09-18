"use strict";

class Mecha{
    constructor(){
        this.health = 100;
        this.shields = 100;
        this.power = 100;
        this.powerDiverter = new PowerDiverter();
        this.components = [];
    }

    listComponents(){
        let result = "";
        for (let i = 0; i < this.components.length; i++){
            result += (i+1) + ": " + this.components[i].toString();
            if (i < this.components.length-1){
                result += "<br>";
            }
        }
        return result;
    }

    getWeapons(){
        return this.components.filter(w => w.typeID == COMPONENT_WEAPON);
    }

    getShields(){
        return this.components.filter(s => s.typeID == COMPONENT_SHIELDS);
    }

    removeComponent(index){
        this.components.splice(index, 1);
    }
}

function createMecha(){
    let mecha = new Mecha();
    mecha.components.push(createWeapon(10));
    mecha.components.push(createWeapon(10));
    mecha.components.push(createShields(7));
    return mecha;
}
