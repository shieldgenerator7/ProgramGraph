"use strict";

class PanelFile{
    constructor(panel){
        this.panel = panel;
        this.fileName = "";
        this.content = undefined;
    }

    readFile(){
        //read file
        //2021-10-02: copied from SyllableSight
        const input = document.createElement('input');
        input.type = "file";
        input.accept = ".html";
        input.multiple = false;
        let readFunc = (filename, content) => {
            this.fileName = filename;
            this.content = content.trim();
            this._readContent();
            this.panel.nodeList = [];
            this.panel.edgeList = [];
            this.panel.syncFromGraph();
            currentPanel.verify.validify();
            this.panel.autoLayout.autoLayout();
            this.panel.display.draw();
        };
        input.addEventListener(
            'change',
            function (event) {
                const input = event.target;
                if ('files' in input && input.files.length > 0) {
                    let countFinished = 0;
                    for (let i = 0; i < input.files.length; i++) {
                        const file = input.files[i];
                        const reader = new FileReader();
                        (new Promise((resolve, reject) => {
                            reader.onload = event => resolve(event.target.result)
                            reader.onerror = error => reject(error)
                            reader.readAsText(file)
                        })).then(content => {
                            //Turn the content string into a graph
                            readFunc(file.name, content);
                            //Log it
                            console.log("file imported: ", file.name);
                            //Update counter
                            countFinished++;
                            if (countFinished == input.files.length) {
                            }
                        }).catch(error => console.error(error));
                    }
                }
            }
        );
        input.click();
    }

    _readContent(){
        //TODO: read JSON file
    }

    writeFile(){
        this._writeContent();
        //download content
        window.download(
            this.content,
            this.fileName,
            'data:application/txt'
        )
    }

    _writeContent(){
        //TODO: write JSON file
    }
}
