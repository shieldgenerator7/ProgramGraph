"use strict";

const SYSTEM_ATTACK = 0;
const SYSTEM_SHIELDS = 1;

class PowerDiverter{
    constructor(){
        this.divertOrder = [
            SYSTEM_ATTACK,
            SYSTEM_SHIELDS,
        ];
        this.divertList = {};
        this.divertList[SYSTEM_ATTACK] = 50;
        this.divertList[SYSTEM_SHIELDS] = 50;
    }

    divertPower(system, amount){
        this.divertOrder = this.divertOrder.filter(item => item !== system);
        this.divertOrder = [system].concat(this.divertOrder);
        this._setDivert(system, amount);
        let sum = this._sumDiversion();
        while (sum > 100){
            let i = this.divertOrder.length-1;
            while(this.divertList[this.divertOrder[i]] == 0){
                i--;
            }
            let diff = sum - 100;
            this._setDivert(
                this.divertOrder[i],
                this.divertList[this.divertOrder[i]] - diff
            );
            sum = this._sumDiversion();
        }
        while (sum < 100){
            let i = this.divertOrder.length-1;
            while(this.divertList[this.divertOrder[i]] == 100){
                i--;
            }
            let diff = 100 - sum;
            this._setDivert(
                this.divertOrder[i],
                this.divertList[this.divertOrder[i]] + diff
            );
            sum = this._sumDiversion();
        }
    }

    _setDivert(system, amount){
        this.divertList[system] = Math.clamp(
            amount,
            0,
            100
        );
    }

    _sumDiversion(){
        return Object.values(this.divertList).reduce((a, b) => a + b);
    }
}
