DJT.classes.SimulationRenderer=function SimulationRenderer(canvas,scale) {
    this.canvas=canvas;
    this.scale=scale;
    this.lanes=[];
    canvas.width=1000;
    canvas.height=500;
};

var renderer=DJT.classes.SimulationRenderer.prototype;

renderer.drawLane=function(x,y,lane) {
    var coords={x:x,y:y,width:Math.floor(lane.distance/this.scale),height:7};
    this.lanes[lane.id]=coords;
    var ctx=this.canvas.getContext("2d");
    ctx.fillStyle = "#dddddd";
    ctx.strokeRect(coords.x,coords.y,coords.width,coords.height);
    if (lane.joins.after) this.drawLane(x+coords.width,y,lane.joins.after);
    if (lane.joins.right.lane) this.drawLane(x+lane.joins.right.start,y+coords.height,lane.joins.right.lane);
};

renderer.drawVehicle=function(vehicle) {
    var ctx = this.canvas.getContext("2d");
    var previoussituation = vehicle.newSituation();
    var currentsituation = vehicle.currentSituation();
    if (previoussituation && previoussituation.lane) drawVehicle.call(this, previoussituation, "#ffffff");
    if (currentsituation && currentsituation.lane) drawVehicle.call(this, currentsituation, "#ff0000");

    function drawVehicle(situation,colour) {
        ctx.fillStyle = colour;
        var coords = this.lanes[situation.lane.id];
        ctx.fillRect(Math.floor((coords.x + 1 + situation.position - vehicle.size)/this.scale), coords.y + 2, 1+Math.round(vehicle.size/this.scale), 3);
    }
};
