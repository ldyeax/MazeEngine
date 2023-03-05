import MazeScript from "engine/mazescript.js";

/**
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 */
export default class CellAlphaReceiver extends MazeScript {
	recurse(obj, cell) {
		if (obj.material) {
			obj.material.opacity = cell.lightMapValue;
		}
		for (let child of obj.children) {
			this.recurse(child, cell);
		}
	}
	update() {
		super.update();
		let gridPosition = this.mazeObject.getGridPosition();
		let cell = this.mazeEngine.cells[gridPosition.y][gridPosition.x];
		this.recurse(this.mazeObject.root, cell);
	}
}
