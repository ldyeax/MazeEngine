import Asset from "engine/asset.js";

import {
	GLTFLoader
} from "three_examples/jsm/loaders/GLTFLoader.js";

import * as SkeletonUtils from "three_examples/jsm/utils/SkeletonUtils.js";

import misc from "engine/misc.js";

const gltfLoader = new GLTFLoader();

/**
 * Asset implementation for a GLTF file.  
 * It supports a three_props property on any object in the GLTF scene.  
 * This must be a JSON string. Properties will be applied to the object and any children.  
 * For a child to have a different property it must have its own definition of that property to overwrite it.  
 * three_props supports the following properties:  
 * - transparent: boolean, enables transparent rendering
 * - receiveShadow: boolean, enables receiving shadows
 * - castShadow: boolean, enables casting shadows  
 * Remember to enable custom data attributes when exporting the GLTF from Blender.  
 *   
 * Both GLTF and GLB are supported.
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 */
export default class GLTFAsset extends Asset {
	static #defaultProperties = {
		transparent: true,
		receiveShadow: false,
		castShadow: false,
	};

	static setPropertiesAndCloneMaterials(gltfObject, properties = {}, depth = 0) {
		// let l = function(s){ prependLog(s, depth); }
		let l = function (_) {};
		l(`setProperties(${gltfObject.name}, ${JSON.stringify(properties)}))`);
		properties = Object.assign({}, GLTFAsset.#defaultProperties, properties);
		if (gltfObject.userData && gltfObject.userData.three_props) {
			l("Found three_props");
			try {
				Object.assign(properties, JSON.parse(gltfObject.userData.three_props));
				l("Got new properties, set: " + JSON.stringify(properties));
			} catch (e) {
				console.error("Error parsing three_props on " + gltfObject.name);
				console.error(e);
				console.error(gltfObject.userData.three_props);
			}
		}
		if (gltfObject.material) {
			l("Found material");
			gltfObject.material = gltfObject.material.clone();
			GLTFAsset.setPropertiesAndCloneMaterials(gltfObject.material, properties, depth + 1);
		} else {
			l("No material");
		}
		for (let key of Object.keys(properties)) {
			l(`Checking if ${key} is defined on ${gltfObject.name}`)
			if (typeof gltfObject[key] !== "undefined") {
				l(`Setting ${key} to ${properties[key]} on ${gltfObject.name}`)
				gltfObject[key] = properties[key];
			} else {
				l("Not defined");
			}
		}
		if (gltfObject.children) {
			l("found children");
			for (let child of gltfObject.children) {
				GLTFAsset.setPropertiesAndCloneMaterials(child, properties, depth + 1);
			}
		} else {
			l("No children");
		}
	}

	/**
	 * @returns {THREE.Scene} SkeletonUtils.clone(this.gltf.scene), with properties set 
	 */
	getRoot() {
		let ret = SkeletonUtils.clone(this.gltf.scene);
		GLTFAsset.setPropertiesAndCloneMaterials(ret);
		return ret;
	}

	/**
	 * @param {string} absoluteUrl
	 */
	constructor(absoluteUrl) {
		super();
		gltfLoader.load(absoluteUrl, (gltf) => {
			this.gltf = gltf;
			super.loaded();
		});
	}
};
