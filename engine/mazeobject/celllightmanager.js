import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";
/*
preupdate: set clear all cell lighting
update: set primary cell values
update2: set corner cell values
lateupdate: each mesh writes to its own shader
*/

/**
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/cell.js").default} Cell
 */
export default class CellLightManager extends MazeObject {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
	}
	preUpdate() {
		super.preUpdate();
		
		let mazeEngine = this.mazeEngine;
		if (!mazeEngine.cells || mazeEngine.cells.length === 0) {
			return;
		}

		for (let y = 0; y < mazeEngine.height; y++) {
			for (let x = 0; x < mazeEngine.width; x++) {
				mazeEngine.cells[y][x].clearLighting();
			}
		}
	}
	update2() {
		super.update2();
		let mazeEngine = this.mazeEngine;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let cell = mazeEngine.cells[y][x];
				let value = 0;
				let count = 0;

				let visited1 = false;
				let visited2 = false;
				let visited3 = false;

				// I would normally write this recursively and generically,
				// but copilot is writing it for me and it avoids allocations/stack calls
				
				// #region top left
				visited1 = visited2 = visited3 = false;
				count = 0;
				if (cell.leftOf && cell.leftOf.topRightLight != null) {
					cell.topLeftLight = cell.leftOf.topRightLight;
				} else if (cell.above && cell.above.bottomLeftLight != null) {
					cell.topLeftLight = cell.above.bottomLeftLight;
				} else {
					value = cell.lightMapValue;
					count = 1;
					if (cell.above) {
						visited1 = true;
						value += cell.above.lightMapValue;
						count++;
						if (cell.above.leftOf) {
							visited2 = true;
							value += cell.above.leftOf.lightMapValue;
							count++;
							if (cell.above.leftOf.below) {
								visited3 = true;
								value += cell.above.leftOf.below.lightMapValue;
								count++;
							}
						}
					}
					if (!visited3 && cell.leftOf) {
						visited3 = true;
						value += cell.leftOf.lightMapValue;
						count++;
						if (!visited2 && cell.leftOf.above) {
							visited2 = true;
							value += cell.leftOf.above.lightMapValue;
							count++;
						}
					}
					cell.topLeftLight = value / count;
				}
				// #endregion

				// #region top right
				visited1 = visited2 = visited3 = false;
				count = 0;
				if (cell.rightOf && cell.rightOf.topLeftLight != null) {
					cell.topRightLight = cell.rightOf.topLeftLight;
				} else if (cell.above && cell.above.bottomRightLight != null) {
					cell.topRightLight = cell.above.bottomRightLight;
				} else {
					value = cell.lightMapValue;
					count = 1;
					if (cell.above) {
						visited1 = true;
						value += cell.above.lightMapValue;
						count++;
						if (cell.above.rightOf) {
							visited2 = true;
							value += cell.above.rightOf.lightMapValue;
							count++;
							if (cell.above.rightOf.below) {
								visited3 = true;
								value += cell.above.rightOf.below.lightMapValue;
								count++;
							}
						}
					}
					if (!visited3 && cell.rightOf) {
						visited3 = true;
						value += cell.rightOf.lightMapValue;
						count++;
						if (!visited2 && cell.rightOf.above) {
							visited2 = true;
							value += cell.rightOf.above.lightMapValue;
							count++;
						}
					}
					cell.topRightLight = value / count;
				}
				// #endregion

				// #region bottom left
				visited1 = visited2 = visited3 = false;
				count = 0;
				if (cell.leftOf && cell.leftOf.bottomRightLight != null) {
					cell.bottomLeftLight = cell.leftOf.bottomRightLight;
				} else if (cell.below && cell.below.topLeftLight != null) {
					cell.bottomLeftLight = cell.below.topLeftLight;
				} else {
					value = cell.lightMapValue;
					count = 1;
					if (cell.below) {
						visited1 = true;
						value += cell.below.lightMapValue;
						count++;
						if (cell.below.leftOf) {
							visited2 = true;
							value += cell.below.leftOf.lightMapValue;
							count++;
							if (cell.below.leftOf.above) {
								visited3 = true;
								value += cell.below.leftOf.above.lightMapValue;
								count++;
							}
						}
					}
					if (!visited3 && cell.leftOf) {
						visited3 = true;
						value += cell.leftOf.lightMapValue;
						count++;
						if (!visited2 && cell.leftOf.below) {
							visited2 = true;
							value += cell.leftOf.below.lightMapValue;
							count++;
						}
					}
					cell.bottomLeftLight = value / count;
				}
				// #endregion

				// #region bottom right
				visited1 = visited2 = visited3 = false;
				count = 0;
				if (cell.rightOf && cell.rightOf.bottomLeftLight != null) {
					cell.bottomRightLight = cell.rightOf.bottomLeftLight;
				} else if (cell.below && cell.below.topRightLight != null) {
					cell.bottomRightLight = cell.below.topRightLight;
				} else {
					value = cell.lightMapValue;
					count = 1;
					if (cell.below) {
						visited1 = true;
						value += cell.below.lightMapValue;
						count++;
						if (cell.below.rightOf) {
							visited2 = true;
							value += cell.below.rightOf.lightMapValue;
							count++;
							if (cell.below.rightOf.above) {
								visited3 = true;
								value += cell.below.rightOf.above.lightMapValue;
								count++;
							}
						}
					}
					if (!visited3 && cell.rightOf) {
						visited3 = true;
						value += cell.rightOf.lightMapValue;
						count++;
						if (!visited2 && cell.rightOf.below) {
							visited2 = true;
							value += cell.rightOf.below.lightMapValue;
							count++;
						}
					}
					cell.bottomRightLight = value / count;
				}
				// #endregion
			}
		}
	}
}
