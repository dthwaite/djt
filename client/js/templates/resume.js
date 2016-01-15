/**
 * @file Code for Template 'resume'
 * @author Dominic Thwaites
 */
Template.resume.onRendered(function() {
    DJT.disqus("resume", window.location.href, "Resume");
    window.scrollTo(0, 0);
});

Template.resume.events({
    "click .enquirybox button": function (event, template) {
        window.scrollTo(0, 0);
        $(".overlay").slideDown("slow");
    },
    "click #quit-overlay": function(event,template) {
        $(".overlay").slideUp("slow");
    }
});