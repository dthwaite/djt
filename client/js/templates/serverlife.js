/**
 * @file Code for Template 'serverlife'
 * @author Dominic Thwaites
 */
Template.serverlife.onRendered(function() {
    this.life=new DJT.classes.LifeUI($(".life-canvas")[0],new DJT.classes.ServerIO(),false);
    this.life.restore(this.data);
    DJT.disqus("life", window.location.href, "Life");
});

Template.serverlife.events({
    "click canvas": function(event,template) {
        var coords=template.life.normalise(event.offsetX,event.offsetY);
        template.life.io.apply(DJT.classes.LifePatterns.randomShape(coords.x,coords.y).cells);
    },
    "click .container button": function(event,template) {
        window.scrollTo(0, 0);
        $(".overlay").slideDown("slow");
    },
    "click #quit-overlay": function(event,template) {
        $(".overlay").slideUp("slow");
    }
});