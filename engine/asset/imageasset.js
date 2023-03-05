import shader from "shader/fourcornerlittexture.js";
import Asset from "engine/asset.js";
import * as THREE from "three";
const textureLoader = new THREE.TextureLoader();

export default class ImageAsset extends Asset {
	constructor(mazeEngine, key) {
		super(mazeEngine, key);
		let url = this.url = this.mazeEngine.imageAssets[key];
		textureLoader.load(url, (texture) => {
			this.texture = texture;

			let geometry = new THREE.PlaneGeometry(1, 1);
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			texture.offset.x = 0;
			texture.offset.y = 0;
			// console.log("repeat x y : " + repeatX + ", " + repeatY + "")
			texture.repeat.x = 1;
			texture.repeat.y = 1;

			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			texture.anisotropy = 0;

			// let material = new THREE.MeshStandardMaterial({ map: texture });
			// material.side = THREE.DoubleSide;
			// material.side = THREE.FrontSide;

			let material = new THREE.ShaderMaterial({
				uniforms: {
					texture1: {
						value: texture,
					},
					repeat: {
						value: new THREE.Vector2(1, 1),
					},
					// lightMapValue: {
					// 	value: 1.0,
					// }
					topLeftLighting: {
						value: 1.0
					},
					topRightLighting: {
						value: 1.0
					},
					bottomLeftLighting: {
						value: 1.0
					},
					bottomRightLighting: {
						value: 1.0
					}
				},
				vertexShader: shader.vertex,
				fragmentShader: shader.fragment
			});

			this.root = new THREE.Mesh(geometry, material);
			this.root.receiveShadow = true;
			this.root.castShadow = true;

			super.loaded();
			this.mazeEngine.imageAssets[key] = this;
		});
	}

	getRoot() {
		let ret = this.root.clone();
		ret.material = ret.material.clone();
		// The mazeObject may have to reorient these, so they're stored as references
		ret.material.userData.topLeftUniformReference = ret.material.uniforms.topLeftLighting;
		ret.material.userData.topRightUniformReference = ret.material.uniforms.topRightLighting;
		ret.material.userData.bottomLeftUniformReference = ret.material.uniforms.bottomLeftLighting;
		ret.material.userData.bottomRightUniformReference = ret.material.uniforms.bottomRightLighting;
		return ret;
	}
}
