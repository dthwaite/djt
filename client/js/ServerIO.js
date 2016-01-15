/**
 * @file Establishes the ServerIO class into DJT namespace
 * @author Dominic Thwaites
 * @see DJT.classes~ServerIO
 */
DJT.classes.ServerIO=(/** @lends DJT.classes */function() {
    /**
     * creates a new ServerIO class
     *
     * @classdesc Provides communication between a client [LifeUI]{@link DJT.classes~LifeUI} class and the server
     * @param {DJT.classes~ServerIO~idChangeCallback} idChange Callback for when an id is provided
     * @implements LifeIO
     * @class
     */
    var ServerIO=function(idChange) {
        this.idChange=idChange;
        this.iteration=0;
    };

    ServerIO.prototype.init=function(width, height, cellChanges) {

        var me=this;
        Meteor.call("createLife",width,height,function(error,result) {
            me.id=result;
            if (me.idChange) me.idChange(me.id);
            me.load(cellChanges);
        });
    };

    ServerIO.prototype.restore=function(id, sizeRecorder, cellChanges) {
        var me=this;
        this.id=id;
        Meteor.call("restoreLife",id,function(error,result) {
            sizeRecorder(result.width,result.height);
            me.load(cellChanges);
        });
    };

    ServerIO.prototype.load=function(cellChanges) {
        var me=this;
        this.subscription=Meteor.subscribe("lifechange",this.id);
        DJT.mongo.changes.find({lifeId:this.id}).observeChanges({added:function(id,field) {
            me.iteration++;
            cellChanges(field.cells);
        }});
    };

    ServerIO.prototype.stop=function() {
        if (this.subscription) this.subscription.stop();
    };

    ServerIO.prototype.resize=function(width, height) {
        //TODO: Implement a resize method for a server processed Life game
    };


    ServerIO.prototype.apply=function(cells) {
        Meteor.call("lifeUpdate",this.id,cells);
    };

    return ServerIO;

    /**
     * Callback function passed into the constructor
     *
     * @callback DJT.classes~ServerIO~idChangeCallback
     * @param {string} id The id of the Life game
     */
})();