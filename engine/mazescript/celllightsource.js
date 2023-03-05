import MazeScript from "engine/mazescript.js";

const CELL_UP = 0;
const CELL_DOWN = 1;
const CELL_LEFT = 2;
const CELL_RIGHT = 3;
const CELL_START = 4;

/**
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * 
 * @description Traverses the maze and adds to the lightMapValue of each cell based on distance from the mazeObject.
 */
export default class CellLightSource extends MazeScript {
	// /**
	//  * @type {string}
	//  */
	// lightString = "";

	updateLightMap() {
		let mazeEngine = this.mazeEngine;

		let gridPos = this.mazeObject.getGridPosition();

		let subtraction = 1.0/6.0;
		let recurse = function(x, y, value, bend, lastDirection) {
			if (lastDirection != CELL_START) {
				if (bend) {
					value *= 0.5;
				}

				value -= subtraction;

				if (value < 0) {
					return;
				}
			}

			let first = lastDirection == CELL_START;

			let cell = mazeEngine.cells[y][x];
			cell.lightMapValue = Math.max(cell.lightMapValue, value);

			if (lastDirection != CELL_DOWN && !cell.up) {
				recurse(x, y + 1, value, !first && lastDirection != CELL_UP, CELL_UP);
			}
			if (lastDirection != CELL_UP && !cell.down) {
				recurse(x, y - 1, value, !first && lastDirection != CELL_DOWN, CELL_DOWN);
			}
			if (lastDirection != CELL_RIGHT && !cell.left) {
				recurse(x - 1, y, value, !first && lastDirection != CELL_LEFT, CELL_LEFT);
			}
			if (lastDirection != CELL_LEFT && !cell.right) {
				recurse(x + 1, y, value, !first && lastDirection != CELL_RIGHT, CELL_RIGHT);
			}
		}
		recurse(gridPos.x, gridPos.y, 1.0, false, CELL_START);

		// this.lightString = "";
		// for (let y = mazeEngine.height - 1; y >= 0; y--) {
		// 	for (let x = 0; x < mazeEngine.width; x++) {
		// 		let cell = mazeEngine.cells[y][x];
		// 		this.lightString += cell.lightMapValue.toFixed(2) + " ";
		// 	}
		// 	this.lightString += "\n";
		// }
	}

	constructor(mazeObject) {
		super(mazeObject);
	}

	update() {
		super.update();
		let ls1 = this.lightString;

		this.updateLightMap();

		// for (let y = 0; y < this.mazeEngine.height; y++) {
		// 	for (let x = 0; x < this.mazeEngine.width; x++) {
		// 		this.mazeEngine.cells[y][x].lightMapValue = (x * y / (this.mazeEngine.width * this.mazeEngine.height));
		// 	}
		// }

		// if (this.lightString != ls1) {
		// 	console.log("===lightmap changed===");
		// 	console.log(this.lightString);
		// 	console.log("===end lightmap changed===");
		// }
	}
}
