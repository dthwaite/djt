/**
 * @file Code for Template 'lifeClicked'
 * @author Dominic Thwaites
 */
Template.lifeClicked.events({
    "click .enquirybox button": function(event,template) {
        window.scrollTo(0, 0);
        $(".overlay").slideDown("slow");
        template.life=new DJT.classes.LifeUI($(".life-canvas")[0],new DJT.classes.ServerIO(function(id) {
            Session.set("life_id",id);
        }),false);
        template.life.init();
    },
    "click #quit-overlay": function(event,template) {
        $(".overlay").slideUp("slow");
        template.life.io.stop();
    },
    "change #lifeId": function(event,template) {
        var value=$("#lifeId").val();
    },
    "click canvas": function(event,template) {
        var coords=template.life.normalise(event.offsetX,event.offsetY);
        template.life.io.apply(DJT.classes.LifePatterns.randomShape(coords.x,coords.y).cells);
    }
});

Template.lifeClicked.helpers({
    shapes: function(shape) {
        switch (shape) {
            case "block":
                return Session.get("life_blocks");
            case "blinker":
                return Session.get("life_blinkers");
            case "glider":
                return Session.get("life_gliders");
        }
        return 0;
    },
    lifeId: function() {
        return Session.get("life_id");
    }
});

