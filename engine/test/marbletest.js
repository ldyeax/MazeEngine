import * as THREE from '../../three/Three.js';
import {
	GLTFLoader
} from "../../three_examples/jsm/loaders/GLTFLoader.js";

const gltfLoader = new GLTFLoader();

export default function marbleTest(scene) {
	gltfLoader.load('./assets/marbletest2.gltf', (gltf) => {
		let marble2 = window.marble2 = gltf.scene;
		marble2.position.set(50, -50, -200);
		marble2.scale.set(3, 3, 3);
		scene.add(marble2);
	});
	gltfLoader.load('./assets/marbletest.gltf', (gltf) => {
		let marble = window.marble = gltf.scene;
		marble.position.set(-50, -50, -200);
		marble.scale.set(3, 3, 3);
		scene.add(marble);
	});
}
