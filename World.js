/// <reference path="Filters.js" />
/// <reference path="General.js" />
/// <reference path="Plant.js" />
/// <reference path="Stem.js" />
/// <reference path="Leaf.js" />
//Created by Christopher Jacobs - http://apexearth.info
function World(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.plant = new Array(1);
    this.plant[0] = this.createPlant();
    this.windEnabled = true;
    this.wind = 0;
    this.windGoal = Math.random() * Math.random() * Math.random() * 2 - 1;
}

World.prototype.createPlant = function (){
    var plant = new Plant(Math.random() * 15 + 65,                                                    //Angle Randomization
        Math.random() * Math.random() * Math.random() * 140 + 60,                   //Maximum Stems
        4                                                                         //Growth Speed
        );
    plant.StemColor = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",.6)";
    plant.LeafColor = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",.6)";
    plant.HasLeaves = true;
    plant.NodeSpawnChance = .02 + .06 * Math.random();
    return plant;
}
World.prototype.update = function () {
    if (this.windEnabled) {
        if (Math.random() > .98) this.windGoal = Math.random() * Math.random() * 2 - 1;
        this.wind += (this.windGoal - this.wind) * .05;
    } else {
        this.wind = 0;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (var i = 0; i < this.plant.length; i++) {
        if(this.plant[i].Growing) this.plant[i].Grow();
        this.ctx.drawImage(this.plant[i].canvas, 0, 0, window.innerWidth, window.innerHeight);
        if (this.plant[i].Age == 200) {
            this.plant[i].FadeInBackground = false;
            this.plant[i].FadeOutBackground = true;
            this.plant.push(this.createPlant());
        }
        if (this.plant[i].FadeOutPercentage >= 1) {
            this.plant.splice(i, 1);
            i--;
        }
    }
    
    cfps++;
}
World.prototype.setCanvasSize = function () {
    this.canvas.width = General.getWindowWidth();
    this.canvas.height = General.getWindowHeight();

    for (var i = 0; i < this.plant.length; i++) {
        this.plant[i].setCanvasSize();
        this.plant[i].draw();
    }
}
