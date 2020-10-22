/// <reference path="World.js" />
function Plant(AngleRand, MaxNodes, Speed) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setCanvasSize();
    this.setRoot(this.canvas.width * Math.random() * .8 + this.canvas.width * .1, this.canvas.height);
    this.FadeInBackground = true;
    this.FadeOutBackground = false;
    this.MaxHeight = this.canvas.height;
    this.MaxHeightMod = (this.MaxHeight / 1200);
    this.Type = Math.floor(Math.random() * 3);
    this.StemColor = "rgba(100,75,0,.6)";
    this.LeafColor = "rgba(100,75,0,.6)";
    this.bgColorR = Math.floor(Math.random() * Math.random() * 255);
    this.bgColorG = Math.floor(Math.random() * Math.random() * 255);
    this.bgColorB = Math.floor(Math.random() * Math.random() * 255);
    this.bgColorA = .001;
    this.FadeOutPercentage = 0;
    this.HasLeaves = false;
    this.Growing = true;
    this.Speed = Speed;
    this.GrowSpeed = 0;
    this.LeafGrowSpeed = 0;
    this.setGrowSpeed();
    this.StemSize = (Math.random() + 1) * (this.canvas.height / 750);
    this.LeafSize = (Math.random() + .5) * 75;
    this.LeafType = 0;
    this.Age = 0;
    this.AgeSquareRoot = 0;
    this.AgeLog = 0;
    this.NodeSpawnChance = .93;
    this.TotalNodes = 0;
    this.MaxNodes = MaxNodes;
    this.AverageAngle = 0;
    this.AverageAngleCalc = 0;
    this.AverageAngleWeight = 0;
    this.AngleRand = AngleRand;
    this.CurrentHeight = 1;
    this.Stems = new Array();
    this.Leaves = new Array();
    this.initNode = new Stem(this, null, 0);
}
Plant.prototype.setGrowSpeed = function () {
    if (this.Type == 2) {
        this.GrowSpeed = this.Speed
            / (this.AgeSquareRoot / 2)
            * (1 - ((1 + this.CurrentHeight) / (this.MaxHeight * .85)));
        this.LeafGrowSpeed = this.Speed / (this.AgeSquareRoot * .8) * (1 - ((1 + this.CurrentHeight / 4) / (this.MaxHeight)));
    } else {
        this.GrowSpeed = this.Speed / (this.AgeSquareRoot) * (1 - ((1 + this.CurrentHeight) / this.MaxHeight));
        this.LeafGrowSpeed = this.Speed / (this.AgeSquareRoot * .8) * (1 - ((1 + this.CurrentHeight / 4) / (this.MaxHeight)));
    }
    this.GrowSpeed = this.GrowSpeed * this.MaxHeightMod;
    this.LeafGrowSpeed = this.LeafGrowSpeed * this.MaxHeightMod;
}

Plant.prototype.Grow = function () {
    if (this.Growing) {
        this.update();
    }
    this.draw();
}
Plant.prototype.setCanvasSize = function () {
    this.canvas.width = General.getWindowWidth();
    this.canvas.height = General.getWindowHeight();
    this.setRoot(this.rootx, this.canvas.height);
}
Plant.prototype.setRoot = function (RootX, RootY) {
    this.rootx = RootX;
    this.rooty = RootY;
}
Plant.prototype.update = function () {
    if (this.Speed > 0) { this.Speed -= .005; }
    else { this.Speed = 0; }
    this.Age++;
    this.AgeSquareRoot = Math.sqrt(this.Age);
    this.AgeLog = Math.max(1, Math.log(this.Age));
    this.AverageAngleCalc = 0;
    this.AverageAngleWeight = 0;
    if (this.FadeInBackground) this.bgColorA = this.bgColorA + .0013;
    if (this.FadeOutBackground) {
        if(this.FadeOutPercentage<.2)
            this.FadeOutPercentage += .001;
        else if (this.FadeOutPercentage < .5)
            this.FadeOutPercentage += .002;
        else if (this.FadeOutPercentage < 1)
            this.FadeOutPercentage += .004;
    }
    this.setGrowSpeed();

    //if (this.CurrentHeight > this.MaxHeight) this.Growing = false;
    this.initNode.update();
    this.AverageAngle = this.AverageAngleCalc / this.AverageAngleWeight;
    
    return true;
}
Plant.prototype.draw = function () {
    var i = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var bgAlpha = Math.floor(Math.max(0, this.bgColorA - this.FadeOutPercentage * 2) * 100) / 100;
    if (bgAlpha > 0) {
        this.ctx.fillStyle = "rgba(" + this.bgColorR + "," + this.bgColorG + "," + this.bgColorB + "," + bgAlpha + ")";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }
    var rgba = this.StemColor
    this.ctx.fillStyle = rgba;
    this.ctx.strokeStyle = this.LeafColor;
    this.ctx.lineWidth = 1;
    for (i = 0; i < this.Stems.length; i++) {
        this.Stems[i].draw();
    }

    if(this.HasLeaves){
        this.ctx.fillStyle = this.LeafColor;
        this.ctx.strokeStyle = this.LeafColor;
        this.ctx.lineWidth = 1;
        for (i = 0; i < this.Leaves.length; i++) {
            this.Leaves[i].draw();
        }
    }

    //Draw Fade
    if (this.FadeOutPercentage > 0) {
        this.ctx.fillStyle = "rgba(0,0,0," + this.FadeOutPercentage + ")";;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }
}
