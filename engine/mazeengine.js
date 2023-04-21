import misc from "engine/misc.js";
import ImageAsset from "asset/imageasset.js";
import GLTFAsset from "asset/gltfasset.js";

import InputManager from "mazeobject/inputmanager.js";

import * as THREE from "three";

const SIDE = 320;
const N_SIDE = -SIDE;
const INV_SIDE = 1.0 / SIDE;
const INV_SIDE_NEGATIVE = -INV_SIDE;
const HALF_SIDE = 0.5 * SIDE;
const HALF_N_SIDE = -HALF_SIDE;
const inv1000 = 1.0 / 1000.0;
const WALL_COLLISION_DIST = 0.1;
const ONE_MINUS_WALL_COLLISION_DIST = 1.0 - WALL_COLLISION_DIST;

const KEYSTATE_DOWN = 1;
const KEYSTATE_HELD = 2;
const KEYSTATE_UP = 3;
const KEYSTATE_NONE = 0;

let noclip = window.location.search.indexOf("noclip") != -1;

/**
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("mazeobject/player.js").default} Player
 */
export default class MazeEngine {
	// #region Options
	/**
	 * @type {Object.<string, any>}
	 */
	options = {
		pathRoot: ".",
		initDefaultAssets: true,
		enableWindowDebugAssigments: true
	};

	/**
	 * @type {string}
	 */
	get pathRoot() {
		return this.options.pathRoot;
	}
	/**
	 * @type {boolean}
	 */
	get initDefaultAssets() {
		return this.options.initDefaultAssets;
	}
	/**
	 * @type {boolean}
	 * @description Assign various values to the window object for debugging
	 */
	get enableWindowDebugAssigments() {
		return this.options.enableWindowDebugAssigments; 
	}
	// #endregion
	
	/**
	 * @param {string} path Path relative to pathRoot
	 * @returns relative path resolved to absolute path with pathRoot
	 */
	resolvePath(path) {
		let ret = this.pathRoot;
		if (ret.length > 0 && ret[ret.length - 1] != '/') {
			if (path.length > 0 && path[0] != '/') {
				ret += '/';
			}
		}
		ret += path;
		return ret;
	}

	/**
	 * @type {number}
	 */
	SIDE = 0;
	/**
	 * @type {number}
	 */
	SIDE_NEGATIVE = 0;
	/**
	 * @type {number}
	 */
	HALF_SIDE = 0;
	/**
	 * @type {number}
	 */
	HALF_SIDE_NEGATIVE = 0;
	/**
	 * @type {number}
	 */
	INV_SIDE = 0;
	/**
	 * @type {number}
	 */
	INV_SIDE_NEGATIVE = 0;

	/**
	 * @type {Cell[][]}
	 */
	cells = [];

	/**
	 * @type {Player}
	 */
	player = null;
	/**
	 * @type {number}
	 */
	width = 8;
	/**
	 * @type {number}
	 */
	height = 8;

	// #region misc function
	/**
	 * @param {THREE.Vector2|number} vector2_x 
	 * @param {number} y 
	 * @returns {THREE.Vector2}
	 */
	gridToWorld(vector2_x, y) {
		if (typeof y == 'number') {
			let x = vector2_x;
			return new THREE.Vector3(HALF_SIDE + x * SIDE, 0, HALF_N_SIDE + y * N_SIDE);
		}
		let vector2 = vector2_x;
		return new THREE.Vector3(vector2.x * SIDE, 0, vector2.y * SIDE);
	}
	// #endregion

	// #region Time
	/**
	 * @type {number}
	 */
	#lastUpdateTime = 0;
	/**
	 * @type {number}
	 */
	deltaTime = 0;
	
	#updateTime() {
		let time = Date.now() * misc.INV_1000;
		this.deltaTime = time - this.#lastUpdateTime;
		this.#lastUpdateTime = time;
		// title.innerText = `FPS: ${Math.round(1 /  this.deltaTime)}`;
	}

	// #endregion

	// #region constructor
	/** Options:
	 *  - **pathRoot**:  
	 * 	The root where the "engine" folder is located inside.  
	 * 	e.g. if the engine folder is located at "/public/engine", then the pathRoot is "/public".  
	 *  Default: "."  
	 *  - **initDefaultAssets**:  
	 * 	Whether to add the default assets located in the "assets" folder automatically.  
	 *  Default: true  
	 *  - **enableWindowDebugAssigments**:  
	 * 	Whether to assign various values to the window object for debugging.  
	 *  Default: true  
	 */
	constructor(options) {
		this.SIDE = SIDE;
		this.SIDE_NEGATIVE = -SIDE;
		this.HALF_SIDE = HALF_SIDE;
		this.HALF_SIDE_NEGATIVE = -HALF_SIDE;
		this.INV_SIDE = INV_SIDE;
		this.INV_SIDE_NEGATIVE = INV_SIDE_NEGATIVE;

		this.options = Object.assign(this.options, options);

		if (this.initDefaultAssets) {
			this.#initDefaultAssets();
		}
		if (this.enableWindowDebugAssigments) {
			window.me = this;
		}

		if (options.progressFunction) {
			this.progressFunction = options.progressFunction;
		}
		if (options.loadingFinishedFunction) {
			this.loadingFinishedFunction = options.loadingFinishedFunction;
		}
	}
	// #endregion

	// #region globalYScale
	/**
	 * @type {number}
	 */
	globalYScale = 0;
	#updateGlobalYScale() {
		this.globalYScale += this.deltaTime;
		if (this.globalYScale > 1) {
			this.globalYScale = 1;
		}
	}
	// #endregion

	// #region assets
	/**
	 * @type {boolean}
	 */
	assetsLoaded = false;
	/**
	 * @type {Object.<string, Asset>}
	 */
	assets = {
	};

	/**
	 *  @type {function} function(loadedCount, totalCount)
	 */
	progressFunction = null;
	/**
	 * @type {function}
	 */
	loadingFinishedFunction = null;

	loadAssets() {
		let mazeEngine = this;
		return new Promise((resolve) => {
			let interval = setInterval(() => {
				let allLoaded = true;
				let values = Object.values(mazeEngine.assets);
				mazeEngine.loadedCount = 0;
				for (let asset of values) {
					if (!asset.loaded) {
						allLoaded = false;
					} else {
						mazeEngine.loadedCount++;
					}
				}
				if (mazeEngine.progressFunction) {
					mazeEngine.progressFunction(mazeEngine.loadedCount, values.length);
				}
				if (allLoaded) {
					clearInterval(interval);
					mazeEngine.assetsLoaded = true;
					resolve();
					if (mazeEngine.loadingFinishedFunction) {
						mazeEngine.loadingFinishedFunction();
					}
				}
			}, 1);
		});
	};

	#initDefaultAssets() {
		let defaultImageAssets = {
			ceiling: "assets/img/ceiling.png",
			floor: "assets/img/floor.png",
			wall: "assets/img/wall.png",
			globe: "assets/img/globe.png",
			ponycloud: "assets/img/ponycloud.png",
		};
		let defaultGltfAssets = {
			N64: "assets/n64/scene.gltf",
			marbletest: "assets/marbletest2.gltf",
		};

		for (let key of Object.keys(defaultImageAssets)) {
			let relativeUrl = defaultImageAssets[key];
			this.assets[key] = new ImageAsset(this.resolvePath(relativeUrl));
		}
		for (let key of Object.keys(defaultGltfAssets)) {
			let relativeUrl = defaultGltfAssets[key];
			this.assets[key] = new GLTFAsset(this.resolvePath(relativeUrl));
		}
	}
	// #endregion

	// #region collision
	isCollidingWithWalls(position) {
		if (noclip) {
			return false;
		}
	
		let zDiv = -position.z * INV_SIDE;
		let cell_y = Math.floor(zDiv);
		let yPortion = zDiv - cell_y;
		let xDiv = position.x * INV_SIDE;
		let cell_x = Math.floor(position.x / SIDE);
		let xPortion = xDiv - cell_x;

		let cell = null;
		try {
			cell = this.cells[cell_y][cell_x];
		} catch (_) {};

		if (!cell) {
			return false;
		}
	
		let collision = false;
		if (cell.left && xPortion < WALL_COLLISION_DIST) {
			collision = true;
		} else if (cell.right && xPortion > ONE_MINUS_WALL_COLLISION_DIST) {
			collision = true;
		} else if (cell.up && yPortion > ONE_MINUS_WALL_COLLISION_DIST) {
			collision = true;
		} else if (cell.down && yPortion < WALL_COLLISION_DIST) {
			collision = true;
		}
	
		return collision;
	}
	// #endregion

	// #region three
	/**
	 * @type {THREE.Scene}
	 */
	scene = null;
	/**
	 * @type {THREE.PerspectiveCamera}
	 */
	camera = null;
	/**
	 * @type {THREE.WebGLRenderer}
	 */
	renderer = null;

	updateCanvasSize() {
		let canvasWidth = 640;
		let canvasHeight = Math.round(canvasWidth * window.innerHeight / window.innerWidth);
	
		if (this.renderer) {
			this.renderer.setSize(canvasWidth, canvasHeight, false);
		}

		if (this.camera) {
			this.camera.aspect = canvasWidth / canvasHeight;
			this.camera.updateProjectionMatrix();			
		}
	}
	
	// #endregion

	// #region keystates
	/**
	 * @type {Object.<string, number>}
	 */
	static KEY_ACTIONS = {
		FORWARD: 1,
		BACKWARD: 2,
		LEFT: 3,
		RIGHT: 4,
	};
	/**
	 * @type {Object.<string, number>}
	 */
	keyStates = {};
	/**
	 * @param {string} action 
	 * @returns {boolean}
	 */
	isDown(action) {
		return this.keyStates[action] == KEYSTATE_DOWN || this.keyStates[action] == KEYSTATE_HELD;
	}
	// #endregion

	// #region mazeObjects
	/**
	 * @type {MazeObject[]}
	 */
	#mazeObjects = [];
	#checkForDestroyed() {
		let foundDestroyed = false;
		for (let mazeObject of this.#mazeObjects) {
			if (mazeObject.destroyed) {
				console.log(`Removing from scene: ${mazeObject.name}`);
				if (mazeObject.root) {
					this.scene.remove(mazeObject.root);
				}
				foundDestroyed = true;
			}
		}

		if (foundDestroyed) {
			this.#mazeObjects = this.#mazeObjects.filter(mazeObject => !mazeObject.destroyed);
		}
	}
	#updateMazeObjects() {
		for (let mazeObject of this.#mazeObjects) {
			let root = mazeObject.root;

			if (root && !mazeObject.addedToScene) {
				// console.log(`Adding to scene: ${mazeObject.name}`);
				this.scene.add(root);
				mazeObject.addedToScene = true;
			}
		}

		for (let mazeObject of this.#mazeObjects) {
			mazeObject.preUpdate();
		}

		for (let mazeObject of this.#mazeObjects) {
			mazeObject.preUpdateScripts();
		}
		
		for (let mazeObject of this.#mazeObjects) {
			mazeObject.update();
		}

		for (let mazeObject of this.#mazeObjects) {
			mazeObject.updateScripts();
		}

		for (let mazeObject of this.#mazeObjects) {
			mazeObject.update2();
		}

		for (let mazeObject of this.#mazeObjects) {
			mazeObject.updateScripts2();
		}

		for (let mazeObject of this.#mazeObjects) {
			let root = mazeObject.root;
			if (root) {
				let position = mazeObject.position;
				let rotation = mazeObject.rotation;

				root.position.set(position.x, position.y, position.z);
				root.rotation.set(rotation.x, rotation.y, rotation.z);

				let scale = mazeObject.scale.clone();
				if (mazeObject.scaleWithGlobalY) {
					scale.y *= this.globalYScale;
				}
				root.scale.set(scale.x, scale.y, scale.z);
			}
		}

		for (let mazeObject of this.#mazeObjects) {
			mazeObject.lateUpdate();
		}
		for (let mazeObject of this.#mazeObjects) {
			mazeObject.lateUpdateScripts();
		}
	}
	instantiate(mazeObjectClass, args={}) {
		let mazeObject = new mazeObjectClass(this, args);
		this.#mazeObjects.push(mazeObject);
		//console.log(`Instantiated: ${mazeObject.name}`);
		return mazeObject;
	}
	// #endregion

	// #region update
	_update() {
		this.#updateTime();
		this.#updateGlobalYScale();
		this.#checkForDestroyed();
		this.#updateMazeObjects();

		if (this.renderer && this.scene && this.camera) {
			this.renderer.render(this.scene, this.camera);		
		}

		requestAnimationFrame(this.#boundUpdate);
	}
	/**
	 * @type {function}
	 */
	#boundUpdate = this._update.bind(this);
	// #endregion

	start(canvas) {
		if (!this.assetsLoaded) {
			console.log("assets not loaded");
			this.loadAssets().then(this.start.bind(this));
			return;
		}

		this.#lastUpdateTime = Date.now() * misc.INV_1000;

		window.scene = this.scene = new THREE.Scene();

		let renderer = this.renderer = new THREE.WebGLRenderer({
			antialias: false,
			canvas: canvas,
			alpha: true
		});
		renderer.setClearColor(0, 0);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.shadowMap.renderSingleSided = false;
		renderer.shadowMap.renderReverseSided = false;

		window.addEventListener("resize", this.updateCanvasSize.bind(this));
		this.updateCanvasSize();

		this.instantiate(InputManager);

		this._update();
	}

	// #region pathfinding
	/**
	 * @param {Cell} start 
	 * @param {Cell} end 
	 * @param {number} marker 
	 * @returns {Cell[]} path
	 */
	#findPath_recurse(start, end, marker) {
		// console.log("#findPath_recurse");
		if (start.marker == marker) {
			// console.log("already visited");
			return null;
		}
		if (start == end) {
			// console.log("found end");
			return [start.gridPos()];
		}
		start.marker = marker;
		let appendum = null;
		if (start.above) {
			// console.log("going above");
			appendum = this.#findPath_recurse(start.above, end, marker);
		}
		if (appendum == null && start.below) {
			// console.log("going below");
			appendum = this.#findPath_recurse(start.below, end, marker);
		}
		if (appendum == null && start.leftOf) {
			// console.log("going left");
			appendum = this.#findPath_recurse(start.leftOf, end, marker);
		}
		if (appendum == null && start.rightOf) {
			// console.log("going right");
			appendum = this.#findPath_recurse(start.rightOf, end, marker);
		}
		if (appendum == null) {
			// console.log("no path found");
			return null;
		}
		appendum.unshift(start.gridPos());
		// console.log("found path:");
		// console.log(appendum);
		return appendum;
	}
	/**
	 * @param {THREE.Vector2} vec2 
	 */
	getCellFromGridPos(gridPos) {
		//console.log(`getCellFromGridPos(${gridPos.x}, ${gridPos.y})`);
		return this.cells[gridPos.y][gridPos.x];
	}
	/**
	 * 
	 * @param {THREE.Vector2} start 
	 * @param {THREE.Vector2} end 
	 * @returns 
	 */
	findPath(start, end) {
		//console.log("getting start cell");
		let startCell = this.getCellFromGridPos(start);
		//console.log("getting end cell");
		let endCell = this.getCellFromGridPos(end);
		return this.#findPath_recurse(startCell, endCell, this.#lastUpdateTime);
	}
	// #endregion

	// #region debug utility 
	/**
	 * North, South, East, or West from y rotation
	 * @param {number} yRot 
	 * @returns {string}
	 */
	dbg_getCardinalNameFromYRot(yRot) {
		while (yRot < 0) {
			yRot += 2 * Math.PI;
		}
		while (yRot > 2 * Math.PI) {
			yRot -= 2 * Math.PI;
		}
		if (yRot < Math.PI * 0.25 || yRot > Math.PI * 1.75) {
			return "North";
		}
		if (yRot < Math.PI * 0.75) {
			return "West";
		}
		if (yRot < Math.PI * 1.25) {
			return "South";
		}
		return "East";
	}
	dbg_setPlayerRot(yRot) {
		this.player.rotation.y = yRot;
		console.log(this.dbg_getCardinalNameFromYRot(yRot));
	}
	// #endregion

}
