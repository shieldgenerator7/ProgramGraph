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

//2021-10-02: copied from https://stackoverflow.com/a/21015393/2336212
/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  *
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  *
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */
function getTextSize(text, font) {
  // re-use canvas object for better performance
  font = font ?? "15px Consolas";
  const canvas = $("cvsGraph");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return new Vector2(metrics.width, metrics.actualBoundingBoxAscent);
}

function registerTextOnChange(txt, changeFunc){
    txt.onchange = changeFunc;
    txt.onkeypress = changeFunc;
    txt.onpaste = changeFunc;
    txt.oninput = changeFunc;
}

//2021-10-05: copied from https://stackoverflow.com/a/3261380/2336212
function isEmpty(str) {
    return (!str || str.length === 0 );
}
