/**
 * @file Code for Template 'diet'
 * @author Dominic Thwaites
 */
Template.diet.onRendered(function() {
    DJT.disqus("diet", window.location.href, "Diet");
    window.scrollTo(0, 0);
});