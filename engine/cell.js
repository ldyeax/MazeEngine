export default class Cell {
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has a north wall
	 */
	up = true;
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has a west wall
	*/
	left = true;
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has an east wall
	 */
	right = true;
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has a south wall
	 */
	down = true;

	/**
	 * @type {number}
	 * @default 0
	 * @description 0,0 is bottom left
	 */
	x = 0;
	/**
	 * @type {number}
	 * @default 0
	 * @description 0,0 is bottom left
	 */
	y = 0;

	/**
	 * @type {Cell}
	 * @description the cell connected above, if any
	 */
	above = null;
	/**
	 * @type {Cell}
	 * @description the cell connected below, if any
	 */
	below = null;
	/**
	 * @type {Cell}
	 * @description the cell connected to the left, if any
	 */
	leftOf = null;
	/**
	 * @type {Cell}
	 * @description the cell connected to the right, if any
	 */
	rightOf = null;

	// #region Lighting
	/**
	 * @type {number}
	 */
	lightMapValue = 0;
	/**
	 * @type {number}
	 * @description Lighting value calculated per frame
	 */
	topLeftLight = null;
	/**
	 * @type {number}
	 * @description Lighting value calculated per frame
	 */
	topRightLight = null;
	/**
	 * @type {number}
	 * @description Lighting value calculated per frame
	 */
	bottomLeftLight = null;
	/**
	 * @type {number}
	 * @description Lighting value calculated per frame
	 */
	bottomRightLight = null;
	/**
	 * @description Reset lights to null and lightMapValue to 0
	 */
	clearLighting() {
		this.lightMapValue = 0;
		this.topLeftLight = null;
		this.topRightLight = null;
		this.bottomLeftLight = null;
		this.bottomRightLight = null;
	}
	// #endregion

	constructor(x = 0, y = 0, up = true, left = true, right = true, down = true) {
		this.x = x;
		this.y = y;
		this.up = up;
		this.left = left;
		this.right = right;
		this.down = down;
	}

	secluded() {
		return (this.up && this.left && this.right && this.down);
	}

	tryGetConnectedCell(x2, y2) {
		if (x2 == this.x && y2 == this.y + 1) {
			return this.above;
		}
		if (x2 == this.x && y2 == this.y - 1) {
			return this.below;
		}
		if (x2 == this.x - 1 && y2 == this.y) {
			return this.leftOf;
		}
		if (x2 == this.x + 1 && y2 == this.y) {
			return this.rightOf;
		}
		return null;
	}
};
