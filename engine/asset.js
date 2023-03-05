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
	mazeEngine = null;
	/**
	 * @type {string}
	 */
	key = "";

	constructor(mazeEngine, key) {
		this.mazeEngine = mazeEngine;
		this.key = key;
		// console.log(`Constructed Asset ${key}`);
	}

	loaded() {
		// console.log(`Asset ${this.key} loaded`);
		window["assetroot_" + this.key] = this.root;
		this.loaded = true;
	}
}

