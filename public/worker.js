/**
 * @file Executed by a worker thread to calculate the game of life
 * @author Dominic Thwaites
 * @see DJT.classes~Life
 */
DJT={classes:{}};
importScripts('Life.js'); // Life game logic

/**
 * Logic for a worker thread to manage and iterate Life games. Imports Life.js
 *
 * @namespace WorkerThread
 * @see DJT.classes~Life
 */
(/** @lends WorkerThread */function() {
	var lives = {};
	var uid = 0;
	/**
	 * Commands understood when embedded in the data structure of a message sent to the Worker
	 *
	 * @typedef WorkerThread~Command
	 * @property {string} init Initialises a new game of Life
	 * @property {string} resize Resizes an existing game of life
	 * @property {string} apply Applies cell changes into a game of life
	 * @property {string} stop Stops iterations for an existing game of life
	 * @see WorkerThread~Message
	 */

	/**
	 * Message structure expected by this worker
	 *
	 * @typedef WorkerThread~Message
	 * @property {WorkerThread~Command} command The type of action required
	 * @property {LifeIO~LifeSize} size The size of the Life game (for 'init' and 'resize' commands only)
	 * @property {LifeIO~LifeCell[]} cells The set of cells to be applied (for 'apply' command only)
	 */

	/**
	 * Receives messages from the browser UI instructing how to manage the Life game
	 *
	 * Data received on the event (event.data) must be a {@link WorkerThread~Message}
	 *
	 * @param {Event} event A standard worker thread event
	 */
	function processEvent(event) {
		switch (event.data.command) {
			case 'init':
				if (!lives.hasOwnProperty(event.data.name))
					lives[event.data.name] = {
						paused: true,
						life: new DJT.classes.Life(event.data.size.width, event.data.size.height)
					};
				break;
			case 'resize':
				if (lives[event.data.name]) {
					var cells = lives[event.data.name].life.resize(event.data.size.width, event.data.size.height);
					postChanges(event.data.name, cells); // All set cells are returned (assuming UI has to redraw from blank)
				}
				break;
			case 'apply':
				if (lives[event.data.name]) {
					lives[event.data.name].life.apply(event.data.cells);
					postChanges(event.data.name, event.data.cells);
				}
				break;
			case 'stop':
				if (lives[event.data.name]) lives[event.data.name].paused = true;
				break;
		}
	}

	// Iterates all Lives
	function iterateLives() {
		for (var id in lives) {
			if (!lives[id].paused) postChanges(id, lives[id].life.iterate());
		}
	}

	/**
	 * Posts cell changes back to UI
	 *
	 * @param {string} id The id of  the Life
	 * @param {LifeIO~LifeCell[]} cells The set of cell changes to be communicated back
	 */
	function postChanges(id, cells) {
		var message = {name: id, cells: cells};
		lives[id].paused = message.cells.length == 0;
		postMessage(message);
	}

	 // Receive messages that are instructions as to how to setup or manage the Life game
	addEventListener('message',processEvent);

	 // Every 100 milliseconds we have the worker do an iteration of each life game
	setInterval(iterateLives, 100);
})();

