export default class Asset {
	/**
	 * @type {boolean}
	 */
	loaded = false;
	/**
	 * @type {THREE.Object3D}
	 */
	root = null;
	/**
	 * @type {MazeEngine}
	 */

	loaded() {
		this.loaded = true;
	}
}

