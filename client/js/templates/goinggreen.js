/**
 * @file Code for Template 'goinggreen'
 * @author Dominic Thwaites
 */
Template.goinggreen.onRendered(function() {
    DJT.disqus("goinggreen", window.location.href, "Going Green");
    window.scrollTo(0, 0);
});