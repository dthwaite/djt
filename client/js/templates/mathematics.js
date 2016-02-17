/**
 * @file Code for Template 'goinggreen'
 * @author Dominic Thwaites
 */
Template.mathematics.onRendered(function() {
    DJT.disqus("mathematics", window.location.href, "Mathematics");
    window.scrollTo(0, 0);
});