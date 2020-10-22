/// <reference path="World.js" />
//Created by Christopher Jacobs - http://apexearth.info
function Stem(Plant, Node, Angle) {
    this.Plant = Plant;
    this.ParentNode = Node;
    this.Plant.TotalNodes++;
    this.globalx = 0;
    this.globaly = 0;
    this.Thickness = 0;
    this.TargetThickness = 0;
    this.NodeNumber = Plant.TotalNodes;
    this.ChildNodes = new Array();
    this.GlobalChildren = 0;
    this.Length = 0;
    this.Speed = (.5 + .5 * Math.random());
    this.Age = 1;
    this.Leaf = null;
    this.Angle = Angle;
    this.AngleRad = (Angle + 90) / 180 * Math.PI;
    this.AngleMomentum = 0;
    this.TargetAngle = Angle;
    this.Height = 1;

    var angleMod = this.getAngleMod();
    this.TargetAngle = (this.ParentNode != null ? this.ParentNode.TargetAngle + angleMod : angleMod / 2);
    if (this.NodeNumber <= 2) {
        this.TargetAngle /= 4;
    }
    if (Node == null) {
        this.ChildNodes.push(new Stem(Plant, this, Angle));
        this.addGlobalChildCount();
    }
    if (this.Plant.HasLeaves && this.ParentNode != null) {
        if (this.ParentNode.Leaf != null) {
            this.Leaf = this.ParentNode.Leaf;
            this.Leaf.setOwner(this);
            this.ParentNode.Leaf = null;
        } else {
            this.Leaf = new Leaf(this);
        }

    }
    this.Plant.Stems.push(this);
}

Stem.prototype.getAngleMod = function () {
    var angleMod = 0;
    if (this.Plant.Type == 0) {
        angleMod = ((Math.random() * this.Plant.AngleRand) * 2) - this.Plant.AngleRand - (this.ParentNode != null ? this.Plant.AverageAngle : 0);
        angleMod = (Math.random() > .8 ? 0 : Math.max(-60 * Math.random(), Math.min(60 * Math.random(), angleMod)));
    } else if (this.Plant.Type == 1) {
        angleMod = (Math.random() > .5 ? 1 : -1) * this.Plant.AngleRand * (Math.random() * .35 + .25) - this.Plant.AverageAngle;
    } else if (this.Plant.Type == 2) {
        angleMod = (this.Plant.TotalNodes) / this.Plant.MaxNodes;
        angleMod = (Math.random() > .5 ? 1 : -1) * this.Plant.AngleRand * (Math.random() * .75 + .75) * angleMod;
    }
    angleMod = (angleMod > 60 ? 60 : (angleMod < -60 ? -60 : angleMod));
    return angleMod;
}

Stem.prototype.getChildSpawnChance = function () {
    //Configure plant type specials
    if (this.Plant.Type == 2) {
        if (this.Length < 20 * this.Plant.MaxHeightMod) return 0;
        return ((this.Height < this.Plant.MaxHeight / 4 ? 1 : 4) - this.ChildNodes.length)
            * this.Plant.NodeSpawnChance
            * this.Plant.MaxHeightMod
            * (this.Height < this.Plant.MaxHeight / 4 ? 15 : 3)
            - Math.abs(this.TargetAngle / 50);
    } else {
        if (this.Length < 10 * this.Plant.MaxHeightMod) return 0;
        return (3 - this.ChildNodes.length) * this.Plant.NodeSpawnChance * (1 - ((this.GlobalChildren + 1) / 50));
    }
    //-----------------------
}

Stem.prototype.grow = function () {
    if (this.Plant.Type == 2) {
        this.Length += this.Speed * this.Plant.GrowSpeed / Math.log(10 + this.GlobalChildren) * 5;
    } else {
        this.Length += this.Speed * this.Plant.GrowSpeed / Math.log(100 + this.Thickness + this.Length) * 10;
    }
}

Stem.prototype.updateMomentum = function () {
    //Momentum Calculations
    if (world.wind > 0) {
        if (this.Angle >= -90 && this.Angle <= 90 || this.angle <= -90 && this.Angle >= -180 || this.angle > 90 && this.Angle <= 180) {
            this.AngleMomentum += world.wind / Math.max(3, Math.sqrt(this.Thickness)) / 10;
        } else {
            this.AngleMomentum -= world.wind / Math.max(3, Math.sqrt(this.Thickness)) / 10;
        }
    } else if (world.wind < 0) {
        if (this.Angle >= -90 && this.Angle <= 90 || this.angle <= -90 && this.Angle >= -180 || this.angle > 90 && this.Angle <= 180) {
            this.AngleMomentum -= world.wind / Math.max(3, Math.sqrt(this.Thickness)) / 10;
        } else {
            this.AngleMomentum += world.wind / Math.max(3, Math.sqrt(this.Thickness)) / 10;
        }
    }

    this.Angle += this.AngleMomentum;
    this.ParentNode.AngleMomentum += this.AngleMomentum * .01;
    for (i = 0; i < this.ChildNodes.length; i++) {
        this.ChildNodes[i].AngleMomentum += this.AngleMomentum * .01;
    }
    this.AngleMomentum = (Math.abs(this.AngleMomentum * .95) < .02 ? 0 : this.AngleMomentum * .95);
    //-----------------
}

Stem.prototype.update = function () {
    if (this.ParentNode != null) {
        //Growing
        this.Age++;
        this.grow();

        this.updateMomentum();

        if (this.Angle != this.TargetAngle) {
            if(this.Angle>this.TargetAngle){
                this.Angle -= Math.max(this.Plant.GrowSpeed, (this.Angle - this.TargetAngle)*.15);
                if (this.Angle < this.TargetAngle) this.Angle = this.TargetAngle;
            } else {
                this.Angle += Math.max(this.Plant.GrowSpeed, (this.TargetAngle - this.Angle)*.15);
                if (this.Angle > this.TargetAngle) this.Angle = this.TargetAngle;
            }
        }


        if(this.ChildNodes.length>0)
            this.TargetThickness = 2 + this.GlobalChildren/3 + Math.sqrt(this.GlobalChildren);
        else
            this.TargetThickness = 2;
        if (this.Thickness != this.TargetThickness) {
            if (this.Thickness > this.TargetThickness) {
                this.Thickness -= this.Plant.GrowSpeed;
                if (this.Thickness < this.TargetThickness) this.Thickness = this.TargetThickness;
            } else {
                this.Thickness += this.Plant.GrowSpeed;
                if (this.Thickness > this.TargetThickness) this.Thickness = this.TargetThickness;
            }
        }
        //------------------------

        //making children
        if (this.Plant.TotalNodes < this.Plant.MaxNodes && Math.random() < this.getChildSpawnChance()) {
            this.ChildNodes.push(new Stem(this.Plant, this, this.Angle));
            this.addGlobalChildCount();
        }


        //final stuff
        this.AngleRad = (this.Angle + 90) / 180 * 3.1415;
        this.setGlobalX();
        this.setGlobalY();

        this.Height = this.Plant.rooty - this.globaly;
        if (this.Plant.CurrentHeight < this.Height) {
            this.Plant.CurrentHeight = this.Height;
        }
    }
    this.Plant.AverageAngleCalc += this.TargetAngle * this.Length;
    this.Plant.AverageAngleWeight += this.Length;
    var i, Node;
    for (i = 0; i < this.ChildNodes.length; i++) {
        Node = this.ChildNodes[i];
        Node.update();
    }
    if (this.Leaf) this.Leaf.update();
}
Stem.prototype.draw = function () {
    if (this.ParentNode != null) {

        var destCoord = General.angle(this.Angle + 180, this.Thickness / 2, 0);
        var destCoordX = destCoord[0];
        var destCoordY = destCoord[1];
        destCoord = General.angle(this.Angle + 180, -this.Thickness / 2, 0);
        var destCoordX2 = destCoord[0];
        var destCoordY2 = destCoord[1];

        var sourceCoord = General.angle(this.ParentNode.Angle + 180, (this.ParentNode.Thickness == 0 ? this.Thickness * 2 : this.ParentNode.Thickness) / 2, 0);
        var sourceCoordX = sourceCoord[0];
        var sourceCoordY = sourceCoord[1];
        sourceCoord = General.angle(this.ParentNode.Angle + 180, -(this.ParentNode.Thickness == 0 ? this.Thickness * 1.4 : this.ParentNode.Thickness) / 2, 0);
        var sourceCoordX2 = sourceCoord[0];
        var sourceCoordY2 = sourceCoord[1];

        var coordsx = new Array();
        var coordsy = new Array();
        coordsx.push(this.ParentNode.globalx + sourceCoordX);
        coordsy.push(this.ParentNode.globaly + sourceCoordY);
        coordsx.push(this.globalx + destCoordX);
        coordsy.push(this.globaly + destCoordY);
        coordsx.push(this.globalx + destCoordX2);
        coordsy.push(this.globaly + destCoordY2);
        coordsx.push(this.ParentNode.globalx + sourceCoordX2);
        coordsy.push(this.ParentNode.globaly + sourceCoordY2);
        General.drawPolygon(this.Plant.ctx, coordsx, coordsy);

    }
}
Stem.prototype.setGlobalX = function () {
    this.globalx = -Math.cos(this.AngleRad) * this.Length + (this.ParentNode != null ? this.ParentNode.setGlobalX() : this.Plant.rootx);
    return this.globalx;
}
Stem.prototype.setGlobalY = function () {
    this.globaly = -Math.sin(this.AngleRad) * this.Length + (this.ParentNode != null ? this.ParentNode.setGlobalY() : this.Plant.rooty);
    return this.globaly;
}
Stem.prototype.addGlobalChildCount = function () {
    this.GlobalChildren++;
    if (this.ParentNode != null) {
        this.ParentNode.addGlobalChildCount();
    }
}