/**
 * @file Code for Template 'evolution'
 * @author Dominic Thwaites
 */
Template.evolution.onRendered(function() {
    DJT.disqus("evolution", window.location.href, "Evolution");
    window.scrollTo(0, 0);
});

Template.evolution.helpers({
    lifebox: function() {
        if (Session.get("life_blocks")+Session.get("life_blinkers")+Session.get("life_gliders")==0) return "lifeUnclicked";
        return "lifeClicked";
    }
});