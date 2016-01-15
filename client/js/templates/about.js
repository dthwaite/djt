/**
 * @file Code for Template 'about'
 * @author Dominic Thwaites
 */
Template.about.onRendered(function() {
    DJT.disqus("about", window.location.href, "About");
    window.scrollTo(0, 0);
});