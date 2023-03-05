import * as THREE from "three";
import MazeObject from "engine/mazeobject.js";

export default class MazeCamera extends MazeObject {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
		let SIDE = mazeEngine.SIDE;

		this.name = "Main Camera";

		let fov = args.fov || 45;
		let aspect = args.aspect || mazeEngine.canvasWidth / mazeEngine.canvasHeight;
		let near = args.near || 0.1;
		let far = args.far || 10000;
		let position = args.position || new THREE.Vector3(0.5 * SIDE, 0.5 * SIDE, -0.5 * SIDE);
		let rotation = args.rotation || new THREE.Vector3(0, 0, 0);

		let camera = window.camera = mazeEngine.camera = 
			new THREE.PerspectiveCamera(fov, aspect, near, far);

		this.position = position;
		this.rotation = rotation;

		camera.position.set(position.x, position.y, position.z);
		camera.rotation.set(rotation.x, rotation.y, rotation.z);

		this.root = camera;

		this.scaleWithGlobalY = false;

		mazeEngine.updateCanvasSize();
	}

	update() {
		super.update();
		// let player = this.mazeEngine.player;

		// let position = this.mazeEngine.player.position.clone();
		// position.y = 0.5 * this.mazeEngine.SIDE;
		// this.position = position;
		// this.rotation = player.rotation;
	}
};
