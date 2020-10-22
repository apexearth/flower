/// <reference path="World.js" />
//Created by Christopher Jacobs - http://apexearth.info
function General() { }
General.prototype.angle = function (a, x, y) {
    a = a / 180 * Math.PI;
    return new Array((x * Math.cos(a)) - (y * Math.sin(a)), (x * Math.sin(a)) + (y * Math.cos(a)));
}
General.prototype.getWindowWidth = function () {
    if (window.innerWidth)
        return window.innerWidth;
    else
        return document.documentElement.width;
}
General.prototype.getWindowHeight = function () {
    if (window.innerHeight)
        return window.innerHeight;
    else
        return document.documentElement.height;
}

General.prototype.drawPolygon = function (context, coordsx, coordsy) {
    if (!coordsx || coordsx.length == 0) return;
    var i = 0;
    context.beginPath();
    context.moveTo(coordsx[i], coordsy[i]);
    for (i = 1; i < coordsx.length; i++) {
        coordx = coordsx[i];
        coordy = coordsy[i];
        context.lineTo(coordsx[i], coordsy[i]);
    }
    context.lineTo(coordsx[0], coordsy[0]);
    context.closePath();
    context.fill();
    context.stroke();
}

var General = new General();
