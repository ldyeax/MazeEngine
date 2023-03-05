import MazeObject from "engine/mazeobject.js";
import misc  from "engine/misc.js";
import Spin from "mazescript/spin.js";
import * as THREE from "three";
import CellAlphaReceiver from "mazescript/cellalphareceiver.js";

let mazeEngine = null;
export default class MarbleTest extends MazeObject {
	/**
	 * @type {Object.<string, number>}
	 */
	static #MARBLE_STATE = {
		IDLE: 0,
		SHRINKING: 1
	};

	/**
	 * @type {number}
	 */
	#state = MarbleTest.#MARBLE_STATE.IDLE;

	/**
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		let x = args.x;
		let y = args.y;
		super(mazeEngine, args);
		this.name = "MarbleTest" + this.id;

		this.root = mazeEngine.gltfAssets.marbletest.getRoot();

		let spin = this.addScript(Spin);
		spin.speed = x + y + 1;

		this.position = mazeEngine.gridToWorld(x, y);
		this.position.y = 0;
		this.scale = new THREE.Vector3(3, 3, 3);
		window["marble"+this.id] = this;

		this.cellAlphaReceiver = this.addScript(CellAlphaReceiver);
	}
	update() {
		super.update();
		let player = this.mazeEngine.player;

		switch (this.#state) {
			case MarbleTest.#MARBLE_STATE.IDLE:
				if (this.getGridPosition() == player.getGridPosition()) {
					this.#state = MarbleTest.#MARBLE_STATE.SHRINKING;
				}
				break;
			case MarbleTest.#MARBLE_STATE.SHRINKING:
				this.scale.y -= 0.1 * mazeEngine.deltaTime;
				if (this.scale.y < 0) {
					this.scale.y = 0;
					this.destroy();
				}
				break;
		}
	}
}
