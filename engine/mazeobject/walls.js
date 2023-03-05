import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

import FourCornerCellLightReceiver from "engine/mazescript/four_corner_cell_light_receiver.js";

const ADDWALL_LEFT = 0;
const ADDWALL_RIGHT = 1;
const ADDWALL_UP = 2;
const ADDWALL_DOWN = 3;

export default class Walls extends MazeObject {
	/**
	 * @type {THREE.Mesh[]}
	 */
	wallMeshes = [];

	constructor(mazeEngine) {
		super(mazeEngine);
		let SIDE = mazeEngine.SIDE;

		window.wallMeshes = this.wallMeshes;

		this.name = "Walls";

		this.root = new THREE.Group();

		// #region wall generation

		let cells = mazeEngine.cells;
		let walls = this;

		function addWall(d, x, y) {
			// if (d != ADDWALL_UP) return;

			let wallMesh = mazeEngine.imageAssets.wall.getRoot();
			
			walls.wallMeshes.push(wallMesh);

			wallMesh.position.y = 0;
			wallMesh.scale.y = 1;

			let cell = cells[y][x];
			wallMesh.userData.cell = cell;

			wallMesh.scale.set(SIDE, SIDE, 1);

			let userData = wallMesh.material.userData;
			let uniforms = wallMesh.material.uniforms;

			// left
			if (d == ADDWALL_LEFT) {
				wallMesh.position.x = x * SIDE;
				wallMesh.position.z = -y * SIDE - SIDE * 0.5;
				wallMesh.rotation.y = Math.PI * 0.5;

				userData.bottomLeftUniformReference = [uniforms.topLeftLighting, uniforms.bottomLeftLighting];
				userData.topLeftUniformReference = [uniforms.topRightLighting, uniforms.bottomRightLighting];
				userData.topRightUniformReference = null;
				userData.bottomRightUniformReference = null;
			}
			//right
			else if (d == ADDWALL_RIGHT) {
				wallMesh.position.x = x * SIDE + SIDE;
				wallMesh.position.z = -y * SIDE + SIDE * -0.5;
				wallMesh.rotation.y = Math.PI * -0.5;

				// userData.bottomRightUniformReference = [uniforms.topLeftLighting, uniforms.bottomLeftLighting];
				// userData.topRightUniformReference = [uniforms.topRightLighting, uniforms.bottomRightLighting];
				// userData.topRightUniformReference = null;
				// userData.bottomRightUniformReference = null;

				userData.bottomRightUniformReference = [uniforms.topRightLighting, uniforms.bottomRightLighting];
				userData.topRightUniformReference = [uniforms.topLeftLighting, uniforms.bottomLeftLighting];
				userData.topLeftUniformReference = null;
				userData.bottomLeftUniformReference = null;
			}
			// up
			else if (d == ADDWALL_UP) {
				// console.log(`making up at ${x}, ${y}`);
				wallMesh.position.x = x * SIDE + SIDE * 0.5;
				wallMesh.position.z = -y * SIDE - SIDE;
				wallMesh.rotation.y = 0;

				userData.topLeftUniformReference = [uniforms.topLeftLighting, uniforms.bottomLeftLighting];
				userData.topRightUniformReference = [uniforms.topRightLighting, uniforms.bottomRightLighting];
				userData.bottomRightUniformReference = null;
				userData.bottomLeftUniformReference = null;
			}
			// down
			else if (d == ADDWALL_DOWN) {
				// console.log(`making down at ${x}, ${y}`);
				wallMesh.position.x = x * SIDE + SIDE * 0.5;
				wallMesh.position.z = -y * SIDE;
				wallMesh.rotation.y = Math.PI;

				userData.bottomLeftUniformReference = [uniforms.bottomRightLighting, uniforms.topRightLighting];
				userData.bottomRightUniformReference = [uniforms.bottomLeftLighting, uniforms.topLeftLighting];
				userData.topLeftUniformReference = null;
				userData.topRightUniformReference = null;
			}

			walls.root.add(wallMesh);

			return wallMesh;
		}
		for (let y = 0; y < cells.length; y++) {
			let row = cells[y];
			for (let x = 0; x < row.length; x++) {
				let cell = row[x];
				if (cell.up) {
					addWall(ADDWALL_UP, x, y);
				}
				if (cell.down) {
					addWall(ADDWALL_DOWN, x, y);
				}
				if (cell.left) {
					addWall(ADDWALL_LEFT, x, y);
				}
				if (cell.right) {
					addWall(ADDWALL_RIGHT, x, y);
				}
			}
		}

		// #endregion

		this.cellLightReceiver = this.addScript(FourCornerCellLightReceiver);
	}
	lateUpdate() {
		this.position.y = this.mazeEngine.SIDE * 0.5 * this.mazeEngine.globalYScale;
	}
}
