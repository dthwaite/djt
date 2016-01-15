/**
 * @file Code for Template 'life'
 * @author Dominic Thwaites
 */
Session.setDefault("life_blocks",0);
Session.setDefault("life_blinkers",0);
Session.setDefault("life_gliders",0);

function incShape(shape) {
    switch(shape) {
        case "block":
            Session.set("life_blocks",Session.get("life_blocks")+1);
            break;
        case "blinker":
            Session.set("life_blinkers",Session.get("life_blinkers")+1);
            break;
        case "glider":
            Session.set("life_gliders",Session.get("life_gliders")+1);
            break;

    }
}

Template.life.onRendered(function() {
    $("#code-background").height($(window).height());
    this.life=new DJT.classes.LifeUI($("#code-background canvas")[0],new DJT.classes.WorkerIO(DJT.lifeworker),true);
    this.life.init();
    $(".clickthrough").parentsUntil($("#code-background").parent()).addClass("clickby");
});

Template.life.events({
    "click canvas": function(event,template) {
        var coords=template.life.normalise(event.clientX,event.clientY);
        var shape=DJT.classes.LifePatterns.randomShape(coords.x,coords.y);
        template.life.io.apply(shape.cells);
        incShape(shape.shape);
    }
});

Template.life.onDestroyed(function() {
    this.life.die();
    $(".clickthrough").parentsUntil($("#code-background").parent()).removeClass("clickby");
});
