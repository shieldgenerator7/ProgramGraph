"use strict";

class GameManager{
    constructor(){
        this.logMessage("You are entering into battle against another mech.");
        this.logMessage("What do you do?");
        this.logMessage("- divert attack 50");
        this.logMessage("- divert shields 50");
        this.logMessage("- inspect");
        this.logMessage("- install weapon 10");
        this.logMessage("- install shields 7");
        this.logMessage("- uninstall 1");
        this.logMessage("- go");
    }

    takeAction(commandString){
        this.logMessage(">> " + commandString);
        let command = interpreter.interpretString(commandString);
        switch(command.action){
            case COMMAND_GO: this.processGameStep(); break;
            case COMMAND_DIVERT:
                battle.mecha1.powerDiverter.divertPower(command.system, command.amount);
                break;
            case COMMAND_INSPECT: this.logMessage(battle.mecha1.listComponents()); break;
            case COMMAND_INSTALL:
                battle.mecha1.components.push(createComponent(command.component, command.power));
                break;
            case COMMAND_UNINSTALL:
                battle.mecha1.removeComponent(command.index);
                break;
        }
        //2021-06-26: copied from https://stackoverflow.com/a/33193668/2336212
        let element = $("lblLog");
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    processGameStep(){
        battle.mecha1.getWeapons().forEach(w =>
            mechaController.attack(battle.mecha1, w, battle.mecha2)
        );
        battle.mecha2.getWeapons().forEach(w =>
            mechaController.attack(battle.mecha2, w, battle.mecha1)
        );
        battle.mecha1.getShields().forEach(s =>
            mechaController.regenShields(battle.mecha1, s)
        );
        battle.mecha2.getShields().forEach(s =>
            mechaController.regenShields(battle.mecha2, s)
        );
        this.logMessage("Your health: ("+battle.mecha1.health+", "+battle.mecha1.shields+")");
        this.logMessage("Enemy health: ("+battle.mecha2.health+", "+battle.mecha2.shields+")");
        if (battle.mecha1.health == 0){
            this.logMessage("Enemy wins!");
        }
        if (battle.mecha2.health == 0){
            this.logMessage("You win!");
        }
    }

    logMessage(message){
        $("lblLog").innerHTML += message+"<br>";
    }
}

let gameManager = new GameManager();

let lastCommand = "";
$("txtCommand").onkeyup = function(e){
    //ENTER key
    if (e.keyCode == 13){
        lastCommand = $("txtCommand").value;
        gameManager.takeAction($("txtCommand").value);
        $("txtCommand").value = "";
    }
    //up arrow
    if (e.keyCode == 38){
        let switchVar = $("txtCommand").value;
        $("txtCommand").value = lastCommand;
        lastCommand = switchVar;
    }
}
