import defaultShader from "shader/fourcornerlittexture.js";
import Asset from "engine/asset.js";
import * as THREE from "three";
const textureLoader = new THREE.TextureLoader();

export default class ImageAsset extends Asset {
	/**
	 * The shader that will be used
	 */
	static shader = null;
	/**
	 * @type {number} Natural width of the image
	 */
	naturalWidth = 0;
	/**
	 * @type {number} Natural height of the image
	 */
	naturalHeight = 0;
	/**
	 * @param {string} absoluteUrl Absolute path to resource
	 */
	constructor(absoluteUrl) {
		super();

		this.shader = defaultShader;
		if (ImageAsset.shader) {
			this.shader = ImageAsset.shader;
			console.log("set this.shader to " + this.shader.name);
		} else {
			console.log("shader not found");
		}

		textureLoader.load(absoluteUrl, (texture) => {
			// console.log("loaded texture from " + url);
			this.texture = texture;

			this.naturalWidth = texture.image.naturalWidth;
			this.naturalHeight = texture.image.naturalHeight;

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

			let uniforms = {
				texture1: {
					value: texture,
				},
				repeat: {
					value: new THREE.Vector2(1, 1),
				}
			};

			console.log(this.shader.name);
			let material = null;

			if (this.shader == "MeshStandardMaterial") {
				material = new THREE.MeshStandardMaterial({ map: texture });
				material.side = THREE.FrontSide;
				material.transparent = true;
			} else {
				if (this.shader.name == "littexture1") {
					uniforms.lightMapValue = {
						value: 1.0,
					};
				} else if (this.shader.name == "fourcornerlittexture") {
					let newUniforms = {
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
					};
					uniforms = Object.assign(uniforms, newUniforms);
				}
				material = new THREE.ShaderMaterial({
					uniforms: uniforms,
					vertexShader: this.shader.vertex,
					fragmentShader: this.shader.fragment
				});
			} 

			this.root = new THREE.Mesh(geometry, material);
			this.root.receiveShadow = true;
			this.root.castShadow = true;

			super.loaded();
		});
	}

	getRoot() {
		let ret = this.root.clone();
		ret.material = ret.material.clone();
		if (ret.material.uniforms) {
			// The mazeObject may have to reorient these, so they're stored as references
			ret.material.userData.topLeftUniformReference = ret.material.uniforms.topLeftLighting;
			ret.material.userData.topRightUniformReference = ret.material.uniforms.topRightLighting;
			ret.material.userData.bottomLeftUniformReference = ret.material.uniforms.bottomLeftLighting;
			ret.material.userData.bottomRightUniformReference = ret.material.uniforms.bottomRightLighting;
		}
		return ret;
	}
}
