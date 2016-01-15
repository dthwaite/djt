/**
 * @file Establishes the ServerLives class into DJT namespace
 * @author Dominic Thwaites
 * @see DJT.classes~ServerLife
 */
DJT.classes.ServerLives=(/** @lends DJT.classes */function() {
    // Holds all Lives, keyed by the Life id
    var lives={};



    /**
     * This class can not be instantiated, all methods are static
     *
     * @class
     * @classdesc This is a **static** class not intended for instantiation
     * It is used by the server to manage Life games as instructed from the client
     */
    function ServerLives() {}


    /**
     * Gets a [PersistedLife]{@link DJT.classes~PersistedLife} instance, creating one if necessary
     *
     * @param {string} id The id of the Life game requested
     * @returns {DJT.classes~PersistedLife}
     */
    ServerLives.getLife=function(id) {
        if (!_.has(lives,id)) {
            var life = DJT.classes.PersistedLife.getGame(id);
            if (life) {
                lives[id] = new DJT.classes.PersistedLife(life.width, life.height, id);
                lives[id].catchup();
            } else throw new Meteor.error("bad-life-id","Life id "+id+" is not known");
        }
        return lives[id];
    };

    /**
     * Clears out the cache of all lives
     */
    ServerLives.clear=function() {
        lives={};
    };

    /**
     * Publishes changes to the given client
     *
     * @param {string} id The client's subscription id
     * @returns {DJT.classes~PersistedLife~LifeGame[]} A mongoDB collection of changes
     */
    ServerLives.publishChanges=function(id) {
        check(id,String);
        var connection=this.connection.id;
        var life=ServerLives.getLife(id);
        life.setSubscription(connection);
        this.onStop(function(event) {
            life.unsetSubscription(connection);
        });
        return life.allIterations();
    };

    /**
     * Iterates all un-paused Life games by one generation
     */
    ServerLives.iterateLives=function() {
        DJT.classes.PersistedLife.getRunningGames().forEach(function(life) {
            ServerLives.getLife(life._id).iterate();
        });
    };

    /**
     * Updates a Life game with a set of changes
     *
     * @param {string} id The id of the Life game
     * @param {LifeIO~LifeCell[]} cells The set of cell changes
     */
    ServerLives.lifeUpdate=function(id,cells) {
        check(id,String);
        check(cells,Array);
        ServerLives.getLife(id).apply(cells);
    };

    /**
     * Create a new life game with the given dimensions
     *
     * @param {number} width The width (X coordinate) of the game
     * @param {number} height The height (Y coordinate) of the game
     * @returns {string} The id of the new Life game
     */
    ServerLives.createLife=function(width,height) {
        check(width,Number);
        check(height,Number);
        return DJT.classes.PersistedLife.createGame(width,height);
    };

    /**
     * Restores all historic cell changes into a new Life game
     * @param {string} id The id of the Life game
     * @returns {LifeIO~LifeSize}
     */
    ServerLives.restoreLife=function(id) {
        check(id,String);
        return ServerLives.getLife(id).getDimensions();
    };

    return ServerLives;
})();
