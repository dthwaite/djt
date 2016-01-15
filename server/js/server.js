/**
 * @file Meteor server processing
 * @author Dominic Thwaites
 */

var sl=DJT.classes.ServerLives;

Meteor.publish("lifechange",sl.publishChanges);

Meteor.setInterval(sl.iterateLives,250);

Meteor.methods({
    getCode: function(file) {
        return Assets.getText(file);
    },
    lifeUpdate: sl.lifeUpdate,
    createLife: sl.createLife,
    restoreLife: sl.restoreLife
});

Meteor.startup(function () {

});