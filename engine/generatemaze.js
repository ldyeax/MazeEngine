import Cell from "engine/cell.js";

/**
 * @typedef {import("engine/cell.js").default} Cell
 */

function mazeAsciiArt(cells) {
	let ret = "";
	for (let y = cells.length - 1; y >= 0; y--) {
		for (let x = 0; x < cells[y].length; x++) {
			let cell = cells[y][x];
			if (cell.up) {
				ret += "⬛⬛⬛";
			} else {
				ret += "⬛⬜⬛";
			}
		}
		ret += "\n";
		for (let x = 0; x < cells[y].length; x++) {
			let cell = cells[y][x];
			if (cell.left) {
				ret += "⬛⬜";
			} else {
				ret += "⬜⬜";
			}
			if (cell.right) {
				ret += "⬛";
			} else {
				ret += "⬜";
			}
		}
		ret += "\n";
		for (let x = 0; x < cells[y].length; x++) {
			let cell = cells[y][x];
			if (cell.down) {
				ret += "⬛⬛⬛";
			} else {
				ret += "⬛⬜⬛";
			}
		}
		ret += "\n";
	}
	return ret;
}

/**
 * @param {number} width 
 * @param {number} height 
 * @returns {Cell[][]}
 */
export default function generateMaze(width, height, seed) {
	const seedGenerator = [];
	width = Math.round(Math.abs(width));
	height = Math.round(Math.abs(height));
	if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
		console.error(`Invalid dimensions passed to generateMaze: ${width}, ${height}`);
		width = 1;
		height = 1;
	}

	let ret = [];

	if (width * height == 1) {
		ret.push([new Cell(0, 0)]);
	} else if (width == 1) {
		for (let y = 0; y < height; y++) {
			ret.push([
				new Cell(0, y, y == height - 1, true, true, y == 0)
			]);
		}
	} else if (height == 1) {
		for (let x = 0; x < width; x++) {
			ret.push([
				new Cell(x, 0, true, x == 0, x == width - 1, true)
			]);
		}
	} else {
		for (let y = 0; y < height; y++) {
			ret.push([]);
			for (let x = 0; x < width; x++) {
				ret[y].push(new Cell(x, y));
			}
		}

		function secludedCellExists() {
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					if (ret[y][x].secluded()) {
						return true;
					}
				}
			}
			return false;
		}

		function tryConnectCells(y1, x1, y2, x2) {
			if (x1 < 0 || x1 >= width || y1 < 0 || y1 >= height) {
				return false;
			}
			if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) {
				return false;
			}
			let cell1 = ret[y1][x1];
			let cell2 = ret[y2][x2];
			if (!cell2.secluded()) {
				return false;
			}
			// New cell is below
			if (y2 < y1) {
				cell2.up = false;
				cell1.down = false;
			}
			// New cell is above
			else if (y2 > y1) {
				cell2.down = false;
				cell1.up = false;
			}
			// New cell is right
			else if (x1 < x2) {
				cell2.left = false;
				cell1.right = false;
			}
			// New cell is left
			else if (x1 > x2) {
				cell2.right = false;
				cell1.left = false;
			}
			cell2.parent = cell1;
			return true;
		}
		// Dead end: cell with no surrounding secluded cells
		function isDeadEnd(y, x) {
			if (y > 0) {
				if (ret[y - 1][x].secluded()) {
					return false;
				}
			}
			if (y < height - 1) {
				if (ret[y + 1][x].secluded()) {
					return false;
				}
			}
			if (x > 0) {
				if (ret[y][x - 1].secluded()) {
					return false;
				}
			}
			if (x < width - 1) {
				if (ret[y][x + 1].secluded()) {
					return false;
				}
			}
			return true;
		}

		// Make the path
		let trail = [];
		let x = Math.round(width / 2);
		let y = height - 1;
		let countGenerator = -1;

		while (secludedCellExists()) {
			// console.log(ascii(ret));
			// console.log("================");

			if (isDeadEnd(y, x)) {
				// console.log("is dead end: " + x + ", " + y);
				if (trail.length == 0) {
					throw "Dead end reached with no trail";
				}
				let last = trail.pop();
				// console.log("Last:");
				// console.log(last);
				x = last.x;
				y = last.y;
				continue;
			}

			countGenerator++;
			let direction;

			if (seed && Array.isArray(seed)) {
				direction = seed[countGenerator];
			} else {
				direction = Math.floor(Math.random() * 4);
			}

			seedGenerator.push(direction);

			switch (direction) {
				case 0:
					if (tryConnectCells(y, x, y, x - 1)) {
						x--;
						break;
					}
					case 1:
						if (tryConnectCells(y, x, y, x + 1)) {
							x++;
							break;
						}
						case 2:
							if (tryConnectCells(y, x, y - 1, x)) {
								y--;
								break;
							}
							case 3:
								if (tryConnectCells(y, x, y + 1, x)) {
									y++;
									break;
								}
			}
			trail.push({
				x: x,
				y: y
			});
		}
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (!ret[y][x].up) {
				ret[y][x].above = ret[y + 1][x];
			}
			if (!ret[y][x].down) {
				ret[y][x].below = ret[y - 1][x];
			}
			if (!ret[y][x].left) {
				ret[y][x].leftOf = ret[y][x - 1];
			}
			if (!ret[y][x].right) {
				ret[y][x].rightOf = ret[y][x + 1];
			}
		}
	}

	return {
		cells: ret, 
		seed: seedGenerator, 
		asciiArt: mazeAsciiArt(ret) 
	};
};
