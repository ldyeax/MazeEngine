import MazeScript from "engine/mazescript.js";
import * as THREE from "three";

const STATE = {
	WAITING_FOR_GAME_START: -1,
	IDLE: 1,
	INTERPOLATING: 2
};

// #region wander helpers

// 0 radians: y + 1, x + 0
// PI/2 radians: y + 0, x - 1
// PI radians: y - 1, x + 0
// 3PI/2 radians: y + 0, x + 1
function wander_getY(rad) {
	if (rad > Math.PI * 1.75 || rad < Math.PI * 0.25) {
		return 1;
	}
	if (rad < Math.PI * 0.75) {
		return 0;
	}
	if (rad < Math.PI * 1.25) {
		return -1;
	}
	return 0;
}
function wander_getX(rad) {
	if (rad > Math.PI * 1.75 || rad < Math.PI * 0.25) {
		return 0;
	}
	if (rad < Math.PI * 0.75) {
		return -1;
	}
	if (rad < Math.PI * 1.25) {
		return 0;
	}
	return 1;
}

// #endregion

function fixRotation(rad) {
	while (rad < 0) {
		rad += Math.PI * 2;
	}
	while (rad > Math.PI * 2) {
		rad -= Math.PI * 2;
	}
	return rad;
}

function roundRotationIntoQuadrant(rad) {
	rad = fixRotation(rad);
	if (rad > Math.PI * 1.75 || rad < Math.PI * 0.25) {
		return 0;
	}
	if (rad < Math.PI * 0.75) {
		return Math.PI * 0.5;
	}
	if (rad < Math.PI * 1.25) {
		return Math.PI;
	}
	return Math.PI * 1.5;
}

/**
 * @typedef {import("engine/mazeobject.js").MazeObject} MazeObject
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/cell.js").default} Cell
 */
export default class AutoRunner extends MazeScript {
	/**
	 * @type {MazeEngine}
	 */
	mazeEngine = null;
	#state = -1;
	#secondsBetweenCells = 0.5;
	#elapsedTime = Infinity;
	#lastGridPos = new THREE.Vector2();
	#nextGridPos = new THREE.Vector2();
	#lastRotation = 0;
	#nextRotation = 0;
	#runFunc = null;
	/**
	 * @param {MazeObject} mazeObject 
	 */
	constructor(mazeObject) {
		super(mazeObject);

		// console.log("AutoRunner constructor");

		this.name = "AutoRunner";

		this.mazeEngine = mazeObject.mazeEngine;

		this.#state = STATE.WAITING_FOR_GAME_START;

		this.#initVariablesFromParentState();
	}

	#initVariablesFromParentState() {
		this.#lastGridPos = this.mazeObject.getGridPosition();
		this.#nextGridPos = this.#lastGridPos.clone();
		this.#lastRotation = this.mazeObject.rotation.y;
		this.#nextRotation = this.#lastRotation;
		// console.log(`lastGridPos set to: ${this.#lastGridPos.x}, ${this.#lastGridPos.y}`);
	}
	#fixRotations() {
		this.#nextRotation = fixRotation(this.#nextRotation);
		this.#lastRotation = fixRotation(this.#lastRotation);
	}
	#copyNextToLast() {
		this.#lastGridPos.x = this.#nextGridPos.x;
		this.#lastGridPos.y = this.#nextGridPos.y;
		this.#lastRotation = this.#nextRotation;
	}

	// #region Public Methods
	#destinationMode_path = null;
	#destinationMode_pathIndex = 0;
	#destinationMode_finalRotation = 0;
	/**
	 * Set autorunner to run to destination
	 * @param {THREE.Vector2} destination 
	 */
	setMode_Destination(destination, rotation) {
		// console.log("setMode_Destination");
		this.#destinationMode_finalRotation = rotation;
		this.#runFunc = this.#runToDestination;
		this.#initVariablesFromParentState();
		// console.log(`lastGridPos: ${this.#lastGridPos.x}, ${this.#lastGridPos.y}`);
		// console.log(`destination: ${destination.x}, ${destination.y}`);
		this.#destinationMode_path = this.mazeEngine.findPath(this.#lastGridPos, destination);
		// console.log("got path:");
		// console.log(this.#destinationMode_path);
		this.#destinationMode_pathIndex = -1;
		this.#elapsedTime = Infinity;
		this.#state = STATE.INTERPOLATING;
	}

	/**
	 * Set autorunner to run aimlessly
	 */
	setMode_Wander() {
		this.#initVariablesFromParentState();
		this.#runFunc = this.#runWander;
		this.#elapsedTime = Infinity;
		this.#state = STATE.INTERPOLATING;
	}

	/**
	 * Set autorunner to idle
	 */
	setMode_Idle() {
		this.#runFunc = ()=>{return false;};
		this.#elapsedTime = Infinity;
		this.#state = STATE.INTERPOLATING;
	}
	// #endregion

	// #region internal run funtions: set next position/rotation and return true to continue, false to return to idle

	#runWander() {
		// console.log("Wandering");

		// console.log(`wander lastGridPos 1: ${this.#lastGridPos.x}, ${this.#lastGridPos.y}`);
		// console.log(`wander nextGridPos 1: ${this.#nextGridPos.x}, ${this.#nextGridPos.y}`);

		let y = this.#lastGridPos.y;
		let x = this.#lastGridPos.x;

		let forwardRotation = roundRotationIntoQuadrant(this.#lastRotation);

		// console.log(`at ${x}, ${y} facing ${this.mazeEngine.dbg_getCardinalNameFromYRot(forwardRotation)}`);

		let leftRotation = roundRotationIntoQuadrant(forwardRotation + Math.PI * 0.5);
		let backwardRotation = roundRotationIntoQuadrant(forwardRotation + Math.PI);
		let rightRotation = roundRotationIntoQuadrant(forwardRotation + Math.PI * 1.5);

		// this.#nextRotation = forwardRotation; // Math.random() < 0.5 ? leftRotation : forwardRotation;
		// this.#nextGridPos.x = x;
		// this.#nextGridPos.y = y + 1;

		// console.log(`wander lastGridPos 2: ${this.#lastGridPos.x}, ${this.#lastGridPos.y}`);
		// console.log(`wander nextGridPos 2: ${this.#nextGridPos.x}, ${this.#nextGridPos.y}`);

		// return true;

		let leftX = x + wander_getX(leftRotation);
		let leftY = y + wander_getY(leftRotation);

		let forwardX = x + wander_getX(forwardRotation);
		let forwardY = y + wander_getY(forwardRotation);

		let rightX = x + wander_getX(rightRotation);
		let rightY = y + wander_getY(rightRotation);

		let backwardX = x + wander_getX(backwardRotation);
		let backwardY = y + wander_getY(backwardRotation);

		// console.log(`turning left would lead to ${leftX}, ${leftY}, now facing ${this.mazeEngine.dbg_getCardinalNameFromYRot(leftRotation)}`);
		// console.log(`remaining forward would lead to ${forwardX}, ${forwardY}, now facing ${this.mazeEngine.dbg_getCardinalNameFromYRot(forwardRotation)}`);

		let mazeEngine = this.mazeEngine;
		/**
		 * @type {Cell}
		 */
		let cell = mazeEngine.cells[y][x];

		if (cell.tryGetConnectedCell(leftX, leftY)) {
			this.#nextRotation = leftRotation;
			this.#nextGridPos.x = leftX;
			this.#nextGridPos.y = leftY;
			return true;
		}

		if (cell.tryGetConnectedCell(forwardX, forwardY)) {
			this.#nextRotation = forwardRotation;
			this.#nextGridPos.x = forwardX;
			this.#nextGridPos.y = forwardY;
			return true;
		}

		if (cell.tryGetConnectedCell(rightX, rightY)) {
			this.#nextRotation = rightRotation;
			this.#nextGridPos.x = rightX;
			this.#nextGridPos.y = rightY;
			return true;
		}

		if (cell.tryGetConnectedCell(backwardX, backwardY)) {
			this.#nextRotation = backwardRotation;
			this.#nextGridPos.x = backwardX;
			this.#nextGridPos.y = backwardY;
			return true;
		}

		console.error("Could not connect cell");
		return false;
	}

	#runToDestination() {
		// console.log("runToDestination");
		this.#destinationMode_pathIndex++;
		if (this.#destinationMode_pathIndex >= this.#destinationMode_path.length) {
			// console.log("past end of path");
			return false;
		}
		this.#nextGridPos = this.#destinationMode_path[this.#destinationMode_pathIndex];

		if (this.#destinationMode_pathIndex == this.#destinationMode_path.length - 1) {
			// console.log("end rotation");
			this.#nextRotation = this.#destinationMode_finalRotation;
		} else if (this.#nextGridPos.x < this.#lastGridPos.x) {
			this.#nextRotation = Math.PI * 0.5;
		} else if (this.#nextGridPos.x > this.#lastGridPos.x) {
			this.#nextRotation = Math.PI * 1.5;
		} else if (this.#nextGridPos.y < this.#lastGridPos.y) {
			this.#nextRotation = Math.PI;
		} else if (this.#nextGridPos.y > this.#lastGridPos.y) {
			this.#nextRotation = 0;
		}

		// console.log(`nextGridPos: ${this.#nextGridPos.x}, ${this.#nextGridPos.y}`);
		return true;
	}

	// #endregion

	update() {
		super.update();

		let mazeEngine = this.mazeEngine;

		switch (this.#state) {
			case STATE.WAITING_FOR_GAME_START:
				if (mazeEngine.globalYScale >= 1) {
					this.#elapsedTime = Infinity;
					if (this.#runFunc) {
						this.#state = STATE.INTERPOLATING;
					} else {
						this.#state = STATE.IDLE;
					}
				}
				break;
			case STATE.IDLE:
				break;
			case STATE.INTERPOLATING:
				let proportion = this.#elapsedTime / this.#secondsBetweenCells;
				if (proportion > 1) {
					// console.log(`Finding next cell: lastGridPos was ${this.#lastGridPos.x}, ${this.#lastGridPos.y} and nextGridPos is ${this.#nextGridPos.x}, ${this.#nextGridPos.y}`);
					this.#copyNextToLast();
					this.#elapsedTime = 0;
					this.#fixRotations();
					if (!this.#runFunc()) {
						// console.log("Find function returned false, returning to idle");
						this.#state = STATE.IDLE;
						this.mazeObject.setPositionFromGridPos_partial(this.#lastGridPos);
						this.mazeObject.rotation.y = this.#lastRotation;
						break;
					}
					// console.log(`will lerp x from ${this.#lastGridPos.x} to ${this.#nextGridPos.x}`);
					// console.log(`will lerp y from ${this.#lastGridPos.y} to ${this.#nextGridPos.y}`);
					// console.log(`will lerp rot from ${this.#lastRotation} to ${this.#nextRotation}`);
					proportion = 0;
				}

				if (proportion < 0) {
					proportion = 0;
				}
				if (proportion > 1) {
					proportion = 1;
				}

				let x = THREE.MathUtils.lerp(this.#lastGridPos.x, this.#nextGridPos.x, proportion);
				let y = THREE.MathUtils.lerp(this.#lastGridPos.y, this.#nextGridPos.y, proportion);
				this.mazeObject.setPositionFromGridPos_partial_XY(x, y);
				this.mazeObject.rotation.y = THREE.MathUtils.lerp(this.#lastRotation, this.#nextRotation, proportion);

				// this.mazeObject.setPositionFromGridPos_partial(this.#nextGridPos);
				// this.mazeObject.rotation.y = this.#nextRotation;

				this.#elapsedTime += mazeEngine.deltaTime;
				break;
		}
	}
}
