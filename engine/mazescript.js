/**
 * @class MazeScript
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 */
export default class MazeScript {
	/**
	 * @type {number}
	 */
	static count = 0;
	/**
	 * @type {number}
	 */
	id = 0;
	/**
	 * @type {MazeObject}
	 */
	mazeObject = null;
	/**
	 * @type {MazeEngine}
	 */
	mazeEngine = null;
	/**
	 * @param {MazeObject} mazeObject 
	 */
	constructor(mazeObject) {
		this.id = MazeScript.count++;
		this.mazeObject = mazeObject;
		this.mazeEngine = mazeObject.mazeEngine;
	}
	preUpdate() {}
	update() {}
	update2() {}
	lateUpdate() {}
};
