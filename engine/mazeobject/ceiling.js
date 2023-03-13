import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

import FourCornerCellLightReceiver from "engine/mazescript/four_corner_cell_light_receiver.js";
import CellLightReceiverSingle from "engine/mazescript/celllightreceiver_single.js";

/**
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 */
export default class Ceiling extends MazeObject {
	/**
	 * @param {MazeEngine} mazeEngine 
	 */
	constructor(mazeEngine) {
		super(mazeEngine);

		let SIDE = mazeEngine.SIDE;
		let HALF_SIDE = mazeEngine.HALF_SIDE;

		let height = mazeEngine.height;
		let width = mazeEngine.width;

		this.name = "Ceiling";
		this.root = new THREE.Group();

		// #region ceiling cell generation
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let ceilingCell = mazeEngine.assets.ceiling.getRoot();;

				ceilingCell.userData.cell = mazeEngine.cells[y][x];

				ceilingCell.position.x = x * SIDE + HALF_SIDE;
				ceilingCell.position.z = -y * SIDE - HALF_SIDE;
				ceilingCell.position.y = SIDE;

				ceilingCell.rotation.x = Math.PI * 0.5;

				ceilingCell.scale.set(SIDE, SIDE, 1);

				let userData = ceilingCell.material.userData;
				let uniforms = ceilingCell.material.uniforms;

				userData.topLeftUniformReference = uniforms.bottomLeftLighting;
				userData.topRightUniformReference = uniforms.bottomRightLighting;
				userData.bottomLeftUniformReference = uniforms.topLeftLighting;
				userData.bottomRightUniformReference = uniforms.topRightLighting;

				this.root.add(ceilingCell);
			}
		}
		// #endregion

		if (mazeEngine.assets.ceiling.shader.name == "fourcornerlittexture") {
			this.cellLightReceiver = this.addScript(FourCornerCellLightReceiver);
		} else if (mazeEngine.assets.ceiling.shader.name == "littexture1") {
			this.cellLightReceiver = this.addScript(CellLightReceiverSingle);
		}
	}
}
