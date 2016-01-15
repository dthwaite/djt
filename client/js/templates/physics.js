/**
 * @file Code for Template 'physics'
 * @author Dominic Thwaites
 */
Template.physics.onRendered(function() {
    DJT.disqus("physics", window.location.href, "Physics");
    window.scrollTo(0, 0);
});

Template.physics.events({
    "click #understanding": function(event,template) {
        window.scrollTo(0, 0);
        $(".overlay").slideDown("slow");
    },
    "click #quit-overlay": function(event,template) {
        $(".overlay").slideUp("slow");
    }
});