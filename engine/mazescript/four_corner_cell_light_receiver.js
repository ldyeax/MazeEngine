import MazeScript from "engine/mazescript.js";

/**
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 */

/**
 * @param {THREE.Uniform|THREE.Uniform[]} uniformReference
 * @param {number} value
 * @description Sets the value of a uniform or an array of uniforms.
 */
function set_values(uniformReference, value) {
	if (uniformReference == null) {
		return;
	}
	if (Array.isArray(uniformReference)) {
		for (let i = 0; i < uniformReference.length; i++) {
			uniformReference[i].value = value;
		}
	} else {
		uniformReference.value = value;
	}
}

/**
 * @description Sets the corner lights of a plane based on the lightMapValue of surrounding cells.
 */
export default class FourCornerCellLightReceiver extends MazeScript {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
	}
	recurse(obj) {
		if (obj.userData && obj.userData.cell && obj.material) {
			/**
			 * @type {Cell}
			 */
			let cell = obj.userData.cell;

			set_values(obj.material.userData.topLeftUniformReference, cell.topLeftLight);
			set_values(obj.material.userData.topRightUniformReference, cell.topRightLight);
			set_values(obj.material.userData.bottomLeftUniformReference, cell.bottomLeftLight);
			set_values(obj.material.userData.bottomRightUniformReference, cell.bottomRightLight);
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
