/**
 * @file Establishes the LifeUI class into DJT namespace
 * @author Dominic Thwaites
 * @see DJT.classes~LifeUI
 */
DJT.classes.LifeUI=(/** @lends DJT.classes */function() {
    var colour = "#ee0000";

    /**
     * Prepares for the management of the canvas drawing in accordance to draw instructions received
     *
     * @param {object} canvas An HTML canvas on which to draw the game of life
     * @param {LifeIO} lifeIO An object with a standard interface to send and receive Life game execution instructions
     * @param {boolean} resizeable True if the Life grid is to grow or shrink according to the size of the canvas
     * @class
     * @classdesc The UI logic to draw the state of a Life game
     *
     * This class assumes an outside agent that that performs the Life logic. Messages are sent and received to this
     * agent via the LifeIO interface passed in the constructor.
     *
     * @see module:Life
     */
    LifeUI = function (canvas, lifeIO, resizeable) {
        var me = this;
        this.canvas = canvas; // The canvas on which the life game is displayed
        this.io = lifeIO; // The worker thread that calculates the game
        this.resizeable = resizeable;
        if (resizeable) this.size = 10;
        else this.size = 2;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // public function (that needs this closure) to shut down
        this.die = function () {
            this.io.stop();
            if (this.resizeable) $(window).off("resize", resize);	  // no need to respond to resize events
        };

        // resize and respond to resize events
        if (this.resizeable) {
            $(window).on("resize", resize);
            resize();
        }

        // reset our canvas size and inform the worker of the new size
        function resize() {
            var $background = $("#code-background");
            canvas.width = $background.width();
            canvas.height = $background.height();
            lifeIO.resize(me.width(), me.height());

        }
    };

    /**
     * Initialises a new Life game with a size as implied by the canvas size
     */
    LifeUI.prototype.init = function () {
        var me = this;
        this.io.init(me.width(), me.height(), function (cells) {
            me.drawcells(cells);
        });
    };

    /**
     * Asks the IO interface to restore a specific life game
     *
     * @param {number} id The id of the Life game requested
     */
    LifeUI.prototype.restore = function (id) {
        var me = this;

        // Function to process a change in grid size
        function setSize(width,height) {
            me.canvas.width = width*me.size;
            me.canvas.height = height*me.size;

        }

        // Function to process a set of cell changes
        function cellChanges(cells) {
            me.drawcells(cells);
        }
        this.io.restore(id, setSize,cellChanges);
    };

    /**
     * Draws the cells provided onto the canvas
     *
     * @param cells {LifeIO~LifeCell[]} set of cells to be redrawn
     */
    LifeUI.prototype.drawcells = function (cells) {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = colour;
        for (var index in cells) {
            var cell = cells[index]
            if (cell.v) ctx.fillRect(cell.x * this.size, cell.y * this.size, this.size, this.size);
            else ctx.clearRect(cell.x * this.size, cell.y * this.size, this.size, this.size);
        }
    };

    /**
     * The width of the Life grid as implied by the canvas size
     *
     * @return {number} The grid width
     */
    LifeUI.prototype.width = function () {
        return Math.floor(this.canvas.width / this.size);
    };

    /**
     * The hieght of the Life grid as implied by the canvas size
     *
     * @returns {number} The grid height
     */
    LifeUI.prototype.height = function () {
        return Math.floor(this.canvas.height / this.size);
    };

    /**
     * Translates a physical X,Y position on the canvas to a Life Grid cell coordinate
     *
     * @param {number} x X coordinate of position
     * @param {number} y Y coordinate of position
     * @return {DJT.classes~LifeUI~GridCoordinates} The grid coordinates
     */
    LifeUI.prototype.normalise = function (x, y) {
        var xscale=1;
        var yscale=1;
        if (!this.resizable) {
            xscale=this.canvas.width / this.canvas.clientWidth;
            yscale=this.canvas.height / this.canvas.clientHeight;
        }
        return {
            x: Math.floor(x * xscale/this.size),
            y: Math.floor(y * yscale/this.size)
        }
    };

    return LifeUI;
})();

/**
 * @typedef DJT.classes~LifeUI~GridCoordinates
 * @property {number} x The X coordinate
 * @property {number} y The Y coordinate
 *
 */
