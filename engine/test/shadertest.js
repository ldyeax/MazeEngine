import * as THREE from "three";
import tracedLighting from "engine/shader/littexture1.js";

const textureLoader = new THREE.TextureLoader();
const wallUrl = "assets/img/wall.png";

export default function(scene) {
	textureLoader.load(wallUrl, (texture) => {
		console.log("shadertest loaded");
	
		let geometry = new THREE.PlaneGeometry(100, 100);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	
		let material1 = new THREE.MeshStandardMaterial({ map: texture });
		material1.side = THREE.DoubleSide;
		let mesh1 = new THREE.Mesh(geometry, material1);
		mesh1.position.set(-50, 0, -600);
		scene.add(mesh1);
	
		let material2 = new THREE.ShaderMaterial({
			vertexShader: tracedLighting.vertex,
			fragmentShader: tracedLighting.fragment,
			uniforms: {
				texture1: { value: texture },
				lightMapValue: { value: 1.0 },
				repeat: { value: new THREE.Vector2(1.0, 1.0) },
			},
		});
		let mesh2 = new THREE.Mesh(geometry, material2);
		mesh2.position.set(50, 0, -600);
		scene.add(mesh2);

		let ambient = new THREE.AmbientLight(0xFFFFFF);
		ambient.intensity = 1.0;
		scene.add(ambient);
	});
}
