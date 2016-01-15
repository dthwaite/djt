/**
 * Project name space
 *
 * All globals for this project should be set within this object
 *
 * @author Dominic Thwaites
 * @namespace
 */
DJT={
    /**
     * All project classes are registered here
     *
     * Instantiation of a class instance takes the form of:
     * ``` javascript
     * var a=new DJT.classes.A()
     * ```
     */
    classes: {},
    /** DISQUS page change function: Setup by disqus.js */
    disqus: null,
    /** Worker thread for Life management: Setup by client.js */
    lifeworker: null,
    /** MongoDB collections */
    mongo: {
        games:new Mongo.Collection("LifeGames"),
        changes:new Mongo.Collection("LifeChanges")
    }
};






