/**
 * @file Code for Template 'programming'
 * @author Dominic Thwaites
 */
Template.programming.onRendered(function() {
    DJT.disqus("programming", window.location.href, "Programming");
    window.scrollTo(0, 0);
});

