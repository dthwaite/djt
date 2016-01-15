/**
 * @file Code for Template 'bouncing_logos'
 * @author Dominic Thwaites
 */
Template.bouncing_logos.onRendered(function() {
    function clicked() {
        $(".wanderer").each(function() {
            if ($(this).data("bouncer")) $(this).data("bouncer").stopgo();
        });
    }

    $(".wanderer").on("load", function() {
        $(this).data("bouncer",new DJT.classes.Bouncer($(this),{sizelimit:10,speed:150,accuracy:50}));
    });

    $(".clickthrough").parentsUntil($("#code-background").parent()).on("click",clicked);
    $("#code-background").on("click",clicked);
});

Template.bouncing_logos.onDestroyed(function() {
    $(".clickthrough").parentsUntil($("#code-background").parent()).off("click");
    $(".wanderer").each(function() {
        if ($(this).data("bouncer")) $(this).data("bouncer").stopgo("stop");
    });
});