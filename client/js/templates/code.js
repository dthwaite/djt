/**
 * @file Code for Template 'code'
 * @author Dominic Thwaites
 */
Template.code.onRendered(function() {
    $("#code-background").height($(window).height());
});

Template.code.helpers({
    js: function () {
        return Session.get('code');
    }
});