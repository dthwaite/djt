/**
 * @file Meteor client processing
 * @author Dominic Thwaites
 */

DJT.lifeworker = new Worker('worker.js');

Meteor.call("getCode","promise.js",function(error,result) {
    Session.set('code',escapeHTML(result));
});

function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

Meteor.startup(function () {
    var $w=$(window);
    var background_offset=0;

    $w.on("scroll", function(event) {
        $("#code-background").offset({top: $w.scrollTop(),left:'0px'});
    }).on("resize", function() {
        $("#code-background").height($w.height());
        $(".wanderer").each(function() {
            var bouncer=$(this).data("bouncer");
            if (bouncer) bouncer.resize();
        });
    }).on('mousewheel DOMMouseScroll', function(event) {
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            background_offset=Math.min(0,background_offset+event.originalEvent.wheelDelta);
        } else {
            background_offset=Math.max($w.height()-$("#code-background p").innerHeight(),background_offset+event.originalEvent.wheelDelta);
        }
        $("#code-background p").offset({top: background_offset+$w.scrollTop() ,left:'0px'});
    });
});
