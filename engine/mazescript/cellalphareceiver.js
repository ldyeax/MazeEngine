import MazeScript from "engine/mazescript.js";

/**
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 */
export default class CellAlphaReceiver extends MazeScript {
	/**
	 * @param {function} opacityFunction
	 */
	opacityFunction = null;
	recurse(obj, cell) {
		if (obj.material) {
			let opacity = cell.lightMapValue;
			if (this.opacityFunction) {
				opacity = this.opacityFunction(opacity);
			}
			obj.material.opacity = opacity;
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

	constructor(mazeObject, args) {
		super(mazeObject);
		if (args.opacityFunction) {
			this.opacityFunction = args.opacityFunction;
		}
	}
}
