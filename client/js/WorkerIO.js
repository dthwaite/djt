/**
 * @file Establishes the WorkerIO class into DJT namespace
 * @author Dominic Thwaites
 * @see DJT.classes~WorkerIO
 */
DJT.classes.WorkerIO=(/** @lends DJT.classes */function() {

    /**
     * creates a new WorkerIO class
     *
     * @classdesc Provides communication between a client [LifeUI]{@link DJT.classes~LifeUI} class and a worker thread
     * @param {Worker} worker A web worker reference that implements the Life game
     * @param {Function} idChange Callback for when an id is provided
     * @implements LifeIO
     * @class
     */
    var WorkerIO = function (worker,idChange) {
        this.worker = worker;
        this.idChange=idChange;
        this.iteration = 0;
    };

    WorkerIO.prototype.init = function (width, height, cellChanges) {

        this.id = Random.id(20);
        if (this.idChange) this.idChange(this.id);
        this.worker.postMessage({name: this.id, command: 'init', size: {width: width, height: height}});
        this.load(cellChanges);
    };

    WorkerIO.prototype.restore=function(id, sizeRecorder, cellChanges) {
        //TODO: Implement Life restore function from a worker thread
    };

    WorkerIO.prototype.load = function (cellChanges) {
        var me = this;
        this.worker.addEventListener('message', function (event) {
            if (event.data.name == me.id) {
                me.iteration++;
                cellChanges(event.data.cells);
            }
        });
    };

    WorkerIO.prototype.stop = function () {
        this.worker.postMessage({name: this.id, command: 'stop'});
    };

    WorkerIO.prototype.resize = function (width, height) {
        this.worker.postMessage({name: this.id, command: 'resize', size: {width: width, height: height}});
    };

    WorkerIO.prototype.apply = function (cells) {
        this.worker.postMessage({name: this.id, command: 'apply', cells: cells});
    };

    return WorkerIO;
})();