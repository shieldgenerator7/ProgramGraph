"use strict";

const COMMAND_GO = 0;
const COMMAND_DIVERT = 1;
const COMMAND_INSPECT = 2;
const COMMAND_INSTALL = 3;
const COMMAND_UNINSTALL = 4;

class Interpreter{
    constructor(){

    }

    interpretString(commandString){
        let commands = commandString.toLowerCase().split(" ");
        let command = {};
        switch(commands[0]){
            case "go": command.action = COMMAND_GO; break;
            case "divert":
                command.action = COMMAND_DIVERT;
                switch(commands[1]){
                    case "attack": command.system = SYSTEM_ATTACK; break;
                    case "shields": command.system = SYSTEM_SHIELDS; break;
                }
                command.amount = commands[2] * 1;
                break;
            case "inspect":
                command.action = COMMAND_INSPECT; break;
            case "install":
                command.action = COMMAND_INSTALL;
                switch(commands[1]){
                    case "weapon": command.component = COMPONENT_WEAPON; break;
                    case "shields": command.component = COMPONENT_SHIELDS; break;
                }
                command.power = commands[2] * 1;
                break;
            case "uninstall":
                command.action = COMMAND_UNINSTALL;
                command.index = (commands[1] * 1) - 1;
        }
        return command;
    }
}

let interpreter = new Interpreter();
// console.log("Try it!: Type 'interpreter.interpretString(\"attack-power\");'");
// console.log("Try it!: Type 'interpreter.interpretString(\"shields\");'");
