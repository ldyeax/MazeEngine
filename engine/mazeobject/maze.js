import generateMaze from "engine/generatemaze.js";
import MazeObject from "engine/mazeobject.js";

import Ceiling from "mazeobject/ceiling.js";
import Walls from "mazeobject/walls.js";
import Floor from "mazeobject/floor.js";

export default class Maze extends MazeObject {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);

		// console.log(`Instantiating Maze: ${JSON.stringify(args)}`);

		let width = this.width = mazeEngine.width = args.width;
		let height = this.height = mazeEngine.height = args.height;
		let seed = this.seed = mazeEngine.seed = args.seed;

		const mazeData = generateMaze(width, height, seed);
		mazeEngine.cells = this.cells = mazeData.ret;
		mazeEngine.seed = this.seed = mazeData.seed;
		mazeEngine.seedSize = this.seedSize = { width, height };

		mazeEngine.ceilingMazeObject = this.ceilingMazeObject = mazeEngine.instantiate(Ceiling);
		mazeEngine.wallsMazeObject = this.wallsMazeObject = mazeEngine.instantiate(Walls);
		mazeEngine.floorMazeObject = this.floorMazeObject = mazeEngine.instantiate(Floor);
	}
}
