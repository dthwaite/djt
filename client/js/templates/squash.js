/**
 * @file Code for Template 'squash'
 * @author Dominic Thwaites
 */
Template.squash.onRendered(function() {
    DJT.disqus("squash", window.location.href, "Squash");
    window.scrollTo(0, 0);
});