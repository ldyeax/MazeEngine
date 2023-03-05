import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

const KEY_ACTIONS = {
	FORWARD: 1,
	BACKWARD: 2,
	LEFT: 3,
	RIGHT: 4,
};

export default class Player extends MazeObject {
	static #STATE = {
		WAITING_FOR_GAME_START: -1,
		IDLE: 0,
		FLIPPING: 1,
	};

	moveSpeed = 0;
	rotateSpeed = Math.PI / 2;

	#checkCollision() {
		let oldPosition = this.lastPosition;
		let newPosition = oldPosition.clone();

		newPosition.x = this.position.x;
		if (this.mazeEngine.isCollidingWithWalls(newPosition)) {
			newPosition.x = oldPosition.x;
		}

		newPosition.z = this.position.z;
		if (this.mazeEngine.isCollidingWithWalls(newPosition)) {
			newPosition.z = oldPosition.z;
		}

		this.position.x = newPosition.x;
		this.position.z = newPosition.z;
	}

	constructor(mazeEngine, args) {
		super(mazeEngine, args);
		this.name = "Player";
		this.root = new THREE.Group();

		this.moveSpeed = mazeEngine.SIDE * 2;

		this.state = Player.#STATE.WAITING_FOR_GAME_START;

		this.currentPosition = new THREE.Vector2(0, 0);

		this.position.x = mazeEngine.SIDE * 0.5;
		this.position.z = mazeEngine.SIDE * -0.5;
		this.position.y = 0;
		this.lastPosition = this.position.clone();

		this.scaleWithGlobalY = false;

		let pointLight = new THREE.PointLight(0xffffff, 1, 0, 0.1);
		this.root.add(pointLight);
	}

	update() {
		super.update();

		let mazeEngine = this.mazeEngine;

		if (this.mazeEngine.isDown(KEY_ACTIONS.LEFT)) {
			this.rotation.y += this.rotateSpeed * mazeEngine.deltaTime;
		}
		if (this.mazeEngine.isDown(KEY_ACTIONS.RIGHT)) {
			this.rotation.y -= this.rotateSpeed * mazeEngine.deltaTime;
		}
		if (this.mazeEngine.isDown(KEY_ACTIONS.FORWARD)) {
			let dx = -Math.sin(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			let dz = -Math.cos(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			this.position.x += dx;
			this.position.z += dz;
		}
		if (this.mazeEngine.isDown(KEY_ACTIONS.BACKWARD)) {
			let dx = Math.sin(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			let dz = Math.cos(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			this.position.x += dx;
			this.position.z += dz;
		}

		this.#checkCollision();

		let camera = mazeEngine.cameraMazeObject;
		camera.position.set(this.position.x, this.mazeEngine.SIDE * 0.5, this.position.z);
		camera.rotation.set(0, this.rotation.y, 0);
	}
}
