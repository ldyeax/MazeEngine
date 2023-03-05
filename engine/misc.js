import * as THREE from "three";

export default {
	/**
	 * @type {number}
	 */
	INV_1000: 1.0 / 1000.0,

	/**
	 * 
	 * @param {string} str 
	 * @param {number} n 
	 */
	prependLog(str, n) {
		let s = "";
		for (let i = 0; i < n; i++) {
			s += "\t";
		}
		s += str;
		console.log(s);
	},
	cloneGltf(gltf) {
		const clone = {
			animations: gltf.animations,
			scene: gltf.scene.clone(true)
		};
	
		const skinnedMeshes = {};
	
		gltf.scene.traverse(node => {
			if (node.isSkinnedMesh) {
				skinnedMeshes[node.name] = node;
			}
		});
	
		const cloneBones = {};
		const cloneSkinnedMeshes = {};
	
		clone.scene.traverse(node => {
			if (node.isBone) {
				cloneBones[node.name] = node;
			}
	
			if (node.isSkinnedMesh) {
				cloneSkinnedMeshes[node.name] = node;
			}
		});
	
		for (let name in skinnedMeshes) {
			const skinnedMesh = skinnedMeshes[name];
			const skeleton = skinnedMesh.skeleton;
			const cloneSkinnedMesh = cloneSkinnedMeshes[name];
	
			const orderedCloneBones = [];
	
			for (let i = 0; i < skeleton.bones.length; ++i) {
				const cloneBone = cloneBones[skeleton.bones[i].name];
				orderedCloneBones.push(cloneBone);
			}
	
			cloneSkinnedMesh.bind(
				new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
				cloneSkinnedMesh.matrixWorld);
		}

		function cloneMaterials(node) {
			for (let child in node.children) {
				if (child.material) {
					child.material = child.material.clone();
				}
				cloneMaterials(child);
			}
		}

		cloneMaterials(clone.scene);
	
		return clone;
	}
};
