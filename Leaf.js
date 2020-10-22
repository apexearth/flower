/// <reference path="World.js" />
//Created by Christopher Jacobs - http://apexearth.info
function Leaf(Stem) {
    this.setOwner(Stem);
    this.Angle = Stem.Angle;
    this.TargetAngle = Stem.Angle;
    this.AngleMomentum = 0;
    this.bezxoffset = Math.random() * .3 + .2;
    this.bezyoffset = Math.random() * .5 + .2;
    this.Size = 0;
    this.Stem.Plant.Leaves.push(this);
}
Leaf.prototype.setOwner = function (owner) {
    this.Stem = owner;
}


Leaf.prototype.updateMomentum = function () {
    //Momentum Calculations
    if (world.wind > 0) {
        if (this.Angle >= -90 && this.Angle <= 90 || this.angle <= -90 && this.Angle >= -180 || this.angle > 90 && this.Angle <= 180) {
            this.AngleMomentum += world.wind * Math.max(1, this.Size) * .01;
        } else {
            this.AngleMomentum -= world.wind * Math.max(1, this.Size) * .01;
        }
    } else if (world.wind < 0) {
        if (this.Angle >= -90 && this.Angle <= 90 || this.angle <= -90 && this.Angle >= -180 || this.angle > 90 && this.Angle <= 180) {
            this.AngleMomentum -= world.wind * Math.max(1, this.Size) * .01;
        } else {
            this.AngleMomentum += world.wind * Math.max(1, this.Size) * .01;
        }
    }
    this.Angle += this.AngleMomentum;
    this.Stem.AngleMomentum += this.AngleMomentum * .1 / Math.max(3, Math.sqrt(this.Stem.Thickness));
    this.AngleMomentum = (Math.abs(this.AngleMomentum * .95) < .02 ? 0 : this.AngleMomentum * .95);
    //-----------------
}

Leaf.prototype.update = function () {
    if (this.Size < this.Stem.Plant.LeafSize)
        this.Size += this.Stem.Plant.LeafGrowSpeed;

    this.TargetAngle = this.Stem.Angle;
    this.updateMomentum();

    if (this.Angle != this.TargetAngle) {
        if (this.Angle > this.TargetAngle) {
            this.Angle -= (this.Angle - this.TargetAngle) * .15;
            if (this.Angle < this.TargetAngle) this.Angle = this.TargetAngle;
        } else {
            this.Angle += (this.TargetAngle - this.Angle) * .15;
            if (this.Angle > this.TargetAngle) this.Angle = this.TargetAngle;
        }
    }
}
Leaf.prototype.draw = function () {
    var x = this.Stem.globalx, y = this.Stem.globaly;
    var drawAngle = this.Angle;
    var bezax = this.Size * .35
    var bezay = this.Size * this.bezyoffset;
    var bezbx = -this.Size * .35
    var bezby = this.Size * this.bezyoffset;
    var destx = 0;
    var desty = this.Size;
    var beza = General.angle(drawAngle + 180, bezax, bezay);
    bezax = beza[0];
    bezay = beza[1];
    var bezb = General.angle(drawAngle + 180, bezbx, bezby);
    bezbx = bezb[0];
    bezby = bezb[1];
    var dest = General.angle(drawAngle + 180, destx, desty);
    destx = dest[0];
    desty = dest[1];
    this.Stem.Plant.ctx.beginPath(); //bezierCurveTo
    if (this.Stem.Plant.LeafType == 0) {
        this.Stem.Plant.ctx.moveTo(x, y);//lineTo
        this.Stem.Plant.ctx.bezierCurveTo(x + bezax, y + bezay, x + bezax, y + bezay, x + destx, y + desty);
        this.Stem.Plant.ctx.moveTo(x, y);
        this.Stem.Plant.ctx.bezierCurveTo(x + bezbx, y + bezby, x + bezbx, y + bezby, x + destx, y + desty);
    } else {
        this.Stem.Plant.ctx.moveTo(x, y);//lineTo
        this.Stem.Plant.ctx.lineTo(x + bezax, y + bezay);
        this.Stem.Plant.ctx.lineTo(x + destx, y + desty);
        this.Stem.Plant.ctx.moveTo(x, y);
        this.Stem.Plant.ctx.lineTo(x + bezbx, y + bezby);
        this.Stem.Plant.ctx.lineTo(x + destx, y + desty);
    }
    this.Stem.Plant.ctx.closePath();
    this.Stem.Plant.ctx.fill();
    this.Stem.Plant.ctx.stroke();

}