import MazeObject from "engine/mazeobject.js";

export default class N64 extends MazeObject {
	mazeEngine = null;

	constructor(mazeEngine) {
		super(mazeEngine);
		this.name = "N64";
		this.root = mazeEngine.meshAssets.N64.clone();
	}
	update() {
		super.update();
		this.root.rotation.y += 0.9 * Time.deltaTime;
	}
}
