import MazeScript from "engine/mazescript.js";
import MazeObject from "engine/mazeobject.js";

const STATE = {
	WAITING_FOR_GAME_START: -1,
	INTERPOLATING: 0,
};

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
		//this.mazeObject.rotation.y += this.speed * this.mazeEngine.deltaTime;
	}
}
