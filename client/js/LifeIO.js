/**
 * Interface used by the [LifeUI]{@link DJT.classes~LifeUI} class to access a Life processor
 *
 * @see DJT.classes~LifeUI
 * @see DJT.classes~ServerIO
 * @see DJT.classes~WorkerIO
 * @interface LifeIO
 * @author Dominic Thwaites
 */

/**
 * Initialises a new Life game
 *
 * @function
 * @name LifeIO#init
 * @param {number} width width of the Life game (X axis)
 * @param {number} height height of the Life game (Y axis)
 * @param {LifeIO~cellChangesCallback} cellChangeCallback callback to receive changes
 */


/**
 * Restores the current state of a Life game
 *
 * @function
 * @name LifeIO#restore
 * @param id {string} identifying unique code of the Life game to be restored
 * @param sizeRecorder {Function} to be called with the Life game's dimension (parameter: {width:number,height:number})
 * @param {LifeIO~cellChangesCallback} cellChangeCallback callback to receive changes
 */

/**
 * Loads the current state of the Life game.
 *
 * @function
 * @name LifeIO#load
 * @param cellChanges {Function} to be called with the cell changes and any subsequent changes
 */


/**
 * Stops the processing of this Life game
 *
 * @function
 * @name LifeIO#stop
 */

/**
 * Resizes the Life game
 *
 * @function
 * @name LifeIO#resize
 * @param {number} width width of the Life game (X axis)
 * @param {number} height height of the Life game (Y axis)
 */

/**
 * Applies a set of cells (alive or dead) into the Life game
 *
 * @function
 * @name LifeIO#apply
 * @param {LifeIO~LifeCell[]} cells An Array of cell values to apply
 */

/**
 * A structure to represent one cell in the Life game grid
 *
 * @typeDef {Object} LifeIO~LifeCell
 * @property x {number} X coordinate of cell
 * @property y {number} Y coordinate of cell
 * @property v {boolean} True if cell has life, false otherwise
 *
 */

/**
 * A structure to represent the size of the Life game
 *
 * @typeDef {Object} LifeIO~LifeSize
 * @property width {number} The width  (X coordinate)
 * @property height {number} The height (Y coordinate)
 *
 */

/**
 * Callback function for cell changes
 *
 * @callback LifeIO~cellChangesCallback
 * @param {LifeIO~LifeCell[]} changes The set of cell changes that have been applied (and thus expected to be drawn)
 */


