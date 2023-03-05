import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";
import FourCornerCellLightReceiver from "engine/mazescript/four_corner_cell_light_receiver.js";
/**
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 */
export default class Floor extends MazeObject {
	/**
	 * @param {MazeEngine} mazeEngine 
	 */
	constructor(mazeEngine) {
		super(mazeEngine);

		let SIDE = mazeEngine.SIDE;
		let HALF_SIDE = mazeEngine.HALF_SIDE;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		this.name = "Floor";
		this.root = new THREE.Group();

		window.floorMazeObject = this;

		this.scaleWithGlobalY = false;

		// #region floor cell generation
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let floorCell = mazeEngine.imageAssets.floor.getRoot();
				
				floorCell.userData.cell = mazeEngine.cells[y][x];

				floorCell.position.x = x * SIDE + HALF_SIDE;
				floorCell.position.z = -y * SIDE - HALF_SIDE;
				floorCell.scale.set(SIDE, SIDE, 1);
				floorCell.rotation.x = -Math.PI * 0.5;
				this.root.add(floorCell);
			}
		}
		// #endregion

		this.cellLightReceiver = this.addScript(FourCornerCellLightReceiver);
	}
}
