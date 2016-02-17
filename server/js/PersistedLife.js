/**
 * @file Establishes the PersistedLife class into DJT namespace
 * @author Dominic Thwaites
 * @see DJT.classes~PersistedLife
 */

// Call in the Life processor as a raw nodeJS file
Npm.require(process.cwd()+"/../web.browser/app/Life.js");

DJT.classes.PersistedLife=(/** @lends DJT.classes */function() {
    /**
     * @param {number} width Life grid width (X coordinate)
     * @param {number} height Life grid height (Y coordinate)
     * @param {string} id The id of the Life game being instantiated
     * @extends DJT.classes~Life
     * @class
     */
    function PersistedLife(width,height,id) {
        DJT.classes.Life.call(this, width, height);
        this.subscriptions = {};
        this.serverId = id;
        this.iteration=0;
    }

    // Set up this class to derive from the Life
    PersistedLife.prototype=Object.create(DJT.classes.Life.prototype);
    PersistedLife.prototype.constructor=PersistedLife;

    /**
     * Registers a unique client that is attached to this Life game
     *
     * @param {string} id A unique client subscription id
     */
    PersistedLife.prototype.setSubscription=function(id) {
        this.subscriptions[id]=true;
        DJT.mongo.games.update(this.serverId,{$set: {paused: false}});
    };

    /**
     * Un-Registers a unique client that was attached to this Life game
     *
     * @param {string} id A unique client subscription id
     */
    PersistedLife.prototype.unsetSubscription=function(id) {
        delete this.subscriptions[id];
        if (_.isEmpty(this.subscriptions)) DJT.mongo.games.update(this.serverId,{$set: {paused: true}});
    };

    /**
     * Persists a set of cell changes for this game
     *
     * @param {LifeIO~LifeCell[]} cells A set of cells that have changed
     */
    PersistedLife.prototype.persist=function(cells) {
        DJT.mongo.games.update(this.serverId,{$set: {paused: cells.length==0,iteration:this.iteration}});
        if (cells.length>0)  {
            this.iteration++;
            DJT.mongo.changes.insert({
                lifeId: this.serverId,
                iteration: this.iteration,
                cells: cells
            });
        }
    };

    /**
     * Applies all changes recorded from the start of this Life game
     */
    PersistedLife.prototype.catchup=function() {
        var me=this;
        this.allIterations().forEach(function(change) {
            me.apply(change.cells);
            me.iteration=change.iteration;
        });
    };

    /**
     * Gets all cell changes for this Life game
     *
     * @returns {DJT.classes~PersistedLife~LifeGame[]} A mongoDB collection of changes
     */
    PersistedLife.prototype.allIterations=function() {
        return DJT.mongo.changes.find({lifeId:this.serverId},{sort:{iteration:1}});
    };

    /**
     * Gets details of one Life game from the database
     *
     * @param {string} id The id of the Life gamme
     * @returns {DJT.classes~PersistedLife~LifeGame} Details of the Life game
     */
    PersistedLife.getGame=function(id) {
        return DJT.mongo.games.findOne(id);
    };

    /**
     * Gets details of all running Life games (those that are not paused)
     *
     * @returns {DJT.classes~PersistedLife~LifeGame[]} A MongoDB collection of games that are not paused
     */
    PersistedLife.getRunningGames=function() {
        return DJT.mongo.games.find({paused:false,iteration:{$lt:10000}});
    };

    /**
     * Creates a new Life game
     *
     * @param {number} width The width (X coordinate) of the game
     * @param {number} height The height (Y coordinate) of the game
     * @returns {string} The id of the new Life game
     */
    PersistedLife.createGame=function(width,height) {
        return DJT.mongo.games.insert({width:width,height:height,paused:true,iteration:0});
    };

    return PersistedLife;
})();

/**
 * MongoDB document that records one iteration of cell changes in a Life game
 *
 * @typeDef {object} DJT.classes~PersistedLife~ChangeLog
 * @property {string} _Id Unique id of the change
 * @property {string} lifeId Unique id of the life game
 * @property {number} iteration The iteration number or sequence number for this change set
 * @property {LifeIO~LifeCell[]} cells The set of cell changes
 */

/**
 * MongoDB document that records the main details of one Life game
 *
 * @typeDef {object} DJT.classes~PersistedLife~LifeGame
 * @property {string} _Id Unique id of the life game
 * @property {number} width The width (X coordinate) of the game
 * @property {number} height The height (Y coordinate) of the game
 * @property {boolean} paused True of the game is currently paused, otherwise false
 * @property {number} iteration The last iteration number that exists for the game (as held in [ChangeLog]{@link DJT.classes~PersistedLife~ChangeLog)}
 */