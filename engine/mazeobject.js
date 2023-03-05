import * as THREE from "three";

/**
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/mazescript.js").default} MazeScript
 */
export default class MazeObject {
	static count = 0;

	/**
	 * @type {MazeEngine}
	 */
	mazeEngine = null;

	/**
	 * @type {string}
	 */
	name = "";

	/**
	 * @type {THREE.Vector3}
	 */
	position = new THREE.Vector3();

	/**
	 * @type {THREE.Vector3}
	 */
	lastPosition = new THREE.Vector3();

	/**
	 * @type {THREE.Vector3}
	 */
	rotation = new THREE.Vector3();

	/**
	 * @type {THREE.Vector3}
	 */
	scale = new THREE.Vector3(1, 1, 1);

	/**
	 * @type {THREE.Object3D}
	 */
	root = null;

	/**
	 * @type {MazeScript[]}
	 */
	scripts = [];

	/**
	 * @type {boolean}
	 */
	addedToScene = false;
	/**
	 * @type {boolean}
	 */
	destroyed = false;

	/**
	 * @type {number}
	 */
	id = 0;

	/**
	 * @type {boolean}
	 */
	scaleWithGlobalY = true;

	/**
	 * @param {MazeEngine} mazeEngine 
	 */
	constructor(mazeEngine) {
		this.id = MazeObject.count++;
		this.mazeEngine = mazeEngine;
	}

	preUpdate() {
	}
	update() {
		this.lastPosition = this.position.clone();
	}
	update2(){
	}
	lateUpdate() {
	}

	preUpdateScripts() {
		for (let script of this.scripts) {
			script.preUpdate();
		}
	}
	updateScripts() {
		for (let script of this.scripts) {
			script.update();
		}
	}
	updateScripts2() {
		for (let script of this.scripts) {
			script.update2();
		}
	}
	lateUpdateScripts() {
		for (let script of this.scripts) {
			script.lateUpdate();
		}
	}

	/**
	 * @param {MazeScript} scriptClass 
	 * @returns {MazeScript}
	 */
	addScript(scriptClass) {
		let ret = new scriptClass(this);
		this.scripts.push(ret);
		return ret;
	}
	/**
	 * @returns {THREE.Vector2}
	 */
	getGridPosition() {
		return new THREE.Vector2(
			Math.floor(this.position.x * this.mazeEngine.INV_SIDE),
			Math.floor(this.position.z * this.mazeEngine.INV_SIDE_NEGATIVE)
		);
	}
	destroy() {
		destroyed = true;
	}
}
