/**
 * @file Code for Template 'about'
 * @author Dominic Thwaites
 */
Template.about.onRendered(function() {
    DJT.disqus("structure", window.location.href, "Structure");
    window.scrollTo(0, 0);
});