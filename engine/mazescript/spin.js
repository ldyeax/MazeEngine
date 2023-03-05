import MazeScript from "engine/mazescript.js";

/**
 * @typedef {import("engine/mazeobject.js").MazeObject} MazeObject
 */
export default class Spin extends MazeScript {
	/**
	 * @type {number}
	 */
	spin = 1;
	/**
	 * @param {MazeObject} mazeObject 
	 */
	constructor(mazeObject) {
		super(mazeObject);
		this.speed = 1;
	}
	update() {
		this.mazeObject.rotation.y += this.speed * this.mazeEngine.deltaTime;
	}
}
