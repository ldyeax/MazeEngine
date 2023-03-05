import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

const STATE = {
	WAITING_FOR_GAME_START: -1,
	INTERPOLATING: 0,
};

/**
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/cell.js").default} Cell
 */
export default class AutoRunner extends MazeObject {
	#state = -1;
	#secondsBetweenCells = 0.5;
	#elapsedTime = Infinity;
	#lastGridPos = new THREE.Vector2();
	#nextGridPos = new THREE.Vector2();
	#lastRotation = 0;
	#nextRotation = 0;

	/**
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
		this.name = "Player";
		this.root = new THREE.Group();

		this.#moveSpeed = mazeEngine.SIDE * 4;
		this.#state = STATE.WAITING_FOR_GAME_START;

		this.position.x = mazeEngine.SIDE * 0.5;
		this.position.z = mazeEngine.SIDE * -0.5;
		this.position.y = 0;
		this.lastPosition = this.position.clone();

		this.scaleWithGlobalY = false;
	}

	update() {
		super.update();

		let mazeEngine = this.mazeEngine;

		switch (this.#state) {
			case Player.#STATE.WAITING_FOR_GAME_START:
				break;
			case Player.#STATE.INTERPOLATING:
				let proportion = this.#elapsedTime / this.#secondsBetweenCells;
				if (proportion >= 1) {
					this.#elapsedTime = 0;

					let y = parseInt(this.#nextGridPos.y);
					let x = parseInt(this.#nextGridPos.x);

					let leftX = x + parseInt(Math.cos(this.#nextRotation + Math.PI * 0.5));
					let leftY = y + parseInt(Math.sin(this.#nextRotation + Math.PI * 0.5));

					let aboveX = x + parseInt(Math.cos(this.#nextRotation));
					let aboveY = y + parseInt(Math.sin(this.#nextRotation));

					/**
					 * @type {Cell}
					 */
					let cell = mazeEngine.cells[y][x];

					/**
					 * @type {Cell}
					 */
					let destination = null;
					
					if (destination = cell.tryGetConnectedCell(leftX, leftY)) {
						this.#nextRotation = this.#nextRotation + Math.PI * 0.5;
						this.#nextGridPos.x = leftX;
						this.#nextGridPos.y = leftY;
					} else if (destination = cell.tryGetConnectedCell(aboveX, aboveY)) {
						this.#nextRotation = 0;
						this.#nextGridPos.x = aboveX;
						this.#nextGridPos.y = aboveY;
					} else {
						destination = cell;
						this.#nextRotation = this.#nextRotation - Math.PI * 0.5;
					}
				} else {
					let x = THREE.MathUtils.lerp(this.#lastGridPos.x, this.#nextGridPos.x, proportion);
					let y = THREE.MathUtils.lerp(this.#lastGridPos.y, this.#nextGridPos.y, proportion);
					this.position.x = x * mazeEngine.SIDE + mazeEngine.SIDE * 0.5;
					this.position.z = y * mazeEngine.SIDE + mazeEngine.SIDE * -0.5;
					this.rotation.y = THREE.MathUtils.lerp(this.#lastRotation, this.#nextRotation, proportion);
					this.#elapsedTime += mazeEngine.deltaTime;
				}
				break;
		}

		let camera = mazeEngine.cameraMazeObject;
		camera.position.set(this.position.x, this.mazeEngine.SIDE * 0.5, this.position.z);
		camera.rotation.set(0, this.rotation.y, 0);
	}
}
