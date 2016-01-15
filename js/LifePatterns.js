/**
 * @file Utility class to provide Life shapes and is also extensively used by the testing suite
 * @author Dominic Thwaites
 */
DJT.classes.LifePatterns=(/** @lends DJT.classes */function() {

    var shapes = {
        block: {type:"block",iteration:0,coords:[[0, 0], [1, 0], [0, 1], [1, 1]]},
        x_blinker: {type:"blinker",iteration:0,coords:[[0, 1], [1, 1], [2, 1]]},
        y_blinker: {type:"blinker",iteration:1,coords:[[1, 0], [1, 1], [1, 2]]},
        glider_1: {type:"glider",iteration:0,coords:[[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]},
        glider_2: {type:"glider",iteration:1,coords:[[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]]},
        glider_3: {type:"glider",iteration:2,coords:[[2, 1], [0, 2], [2, 2], [1, 3], [2, 3]]},
        glider_4: {type:"glider",iteration:3,coords:[[1, 1], [2, 2], [3, 2], [1, 3], [2, 3]]},
        glider_5: {type:"glider",iteration:4,coords:[[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]]}
    };

    /**
     * Dummy constructor (do not use or implement)
     *
     * @classdesc A static class that does not get instantiated
     * @class
     */
    function LifePatterns() {}

    /**
     * Gets a pattern for a life shape at the given coordinates
     *
     * @param {DJT.classes~LifePatterns~shapes} pattern The name of the pattern to get
     * @param {number} Xoffset The X coordinate of where to place the pattern
     * @param {number} Yoffset The Y coordinate of where to place the pattern
     * @returns {LifeIO~LifeCell[]} The set of cells that define the shape at the given position
     */
    LifePatterns.getPattern=function(pattern,Xoffset,Yoffset) {
        if (Xoffset==undefined) Xoffset=0;
        if (Yoffset==undefined) Yoffset=0;
        var cells = [];
        for (var coord in shapes[pattern].coords) cells.push({
            x: shapes[pattern].coords[coord][0]+Xoffset,
            y: shapes[pattern].coords[coord][1]+Yoffset,
            v: true
        });
        return cells;
    };

    /**
     * Static function: Retrieves the specification of a random shape to be inserted into the Life grid at the given  position
     *
     * @param {number} x The X coordinate of desired cell
     * @param {number} y The Y coordinate of desired cell
     * @return {DJT.classes~LifePatterns~ShapeSpec} The shape chosen and the array of cells that define it
     */
    LifePatterns.randomShape=function(x,y) {
        var choices=[];
        for (var shape in shapes) if (shapes[shape].iteration==0) choices.push({shape:shape,type:shapes[shape].type});
        var choice=choices[Math.floor(Math.random() * choices.length)];
        var shape = [{key:"block",value:"block"},{key:"x_blinker",value:"blinker"},{key:"glider_1",value:"glider"}][Math.floor(Math.random() * 3)];
        return {shape: choice.type, cells: LifePatterns.getPattern(choice.shape,x,y)};
    };

    /**
     * Sets a pattern into the given Life game
     *
     * @param {DJT.classes~Life} life The Life game into which the pattern is to be inserted
     * @param {LifeIO~LifeCell[]} pattern The pattern to insert
     * @returns {LifeIO~LifeCell[]} The cells that changed as a result of the insertion
     */
    LifePatterns.setPattern=function(life,pattern) {
        return life.apply(LifePatterns.getPattern(pattern));
    };

    // Checks the set of cells to equate the shape provided
    /**
     * Checks the set of cells to equate the shape provided
     * @param {LifeIO~LifeCell[]} cells The cells to check
     * @param {DJT.classes~LifePatterns~ShapeNames} pattern The pattern name expected
     * @param {number} Xoffset The X coordinate offset of where the pattern in the cells array is positioned
     * @param {number} Yoffset The Y coordinate offset of where the pattern in the cells array is positioned
     * @returns {boolean} True if the cells match the given pattern
     */
    LifePatterns.checkPattern=function(cells, pattern,Xoffset,Yoffset) {
        if (Xoffset==undefined) Xoffset=0;
        if (Yoffset==undefined) Yoffset=0;
        if (cells.length != shapes[pattern].coords.length) return false;
        for (var index1 in cells) {
            var cell = cells[index1];
            var found = false;
            for (var index2 in shapes[pattern].coords) {
                var coord = shapes[pattern].coords[index2];
                if (cell.x == coord[0]+Xoffset && cell.y == coord[1]+Yoffset && cell.v) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    };

    return LifePatterns;
})();


/**
 * @typedef DJT.classes~LifePatterns~ShapeSpec
 * @property {DJT.classes~LifePatterns~ShapeNames} shape The name of a shape
 * @property {LifeIO~LifeCell[]} cells The set of alive cells that represent the shape
 *
 */

/**
 * @typedef DJT.classes~LifePatterns~ShapeNames
 * @property {string} block
 * @property {string} blinker
 * @property {string} glider
 */