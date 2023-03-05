import MazeScript from "engine/mazescript.js";

/**
 * @typedef {import("engine/cell.js").default} Cell
 */
export default class CellLightReceiverSingle extends MazeScript {
	recurse(obj) {
		if (obj.userData && obj.userData.cell && obj.material) {
			/**
			 * @type {Cell}
			 */
			let cell = obj.userData.cell;
			window.clcell = cell;
			obj.material.uniforms.lightMapValue.value = cell.lightMapValue;
		}

		for (let child of obj.children) {
			this.recurse(child);
		}
	}
	lateUpdate() {
		super.lateUpdate();
		this.recurse(this.mazeObject.root);
	}
}
