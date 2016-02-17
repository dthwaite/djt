/**
 * @file Code for Template 'simulation'
 * @author Dominic Thwaites
 */
var speed=10; // Multiple of real-time
var scale=1; // Number of meters per pixel
var simulation=null;
var canvas=null;
var lane1=null;


Template.simulation.onRendered(function() {
    simulation=new DJT.classes.Simulation(1);
    canvas=new DJT.classes.SimulationRenderer(document.getElementById("simulation_canvas"),scale);
    lane1 = new simulation.Lane(20, 1000);
    lane1.terminate();
    lane2 = new simulation.Lane(20, 1000);
    lane1.adjoin(lane2,0);
    canvas.drawLane(1,1,lane1);
    simulation.addVehicle(lane1);
    setInterval(drawframe,1000/speed);
});

function drawframe() {
    simulation.vehicles.forEach(function(vehicle) {
        canvas.drawVehicle(vehicle);
    });
    simulation.step();

    if (simulation.iteration%10==0) simulation.addVehicle(lane1);
}

Template.serverlife.events({
    "click #quit-overlay": function(event,template) {
        $(".overlay").slideUp("slow");
    }
});