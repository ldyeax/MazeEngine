import MazeObject from "engine/mazeobject.js";

const KEYSTATE_DOWN = 1;
const KEYSTATE_HELD = 2;
const KEYSTATE_UP = 3;
const KEYSTATE_NONE = 0;

const KEY_ACTIONS = {
	FORWARD: 1,
	BACKWARD: 2,
	LEFT: 3,
	RIGHT: 4,
};

const keyMap = {};
keyMap[KEY_ACTIONS.FORWARD] = "KeyW";
keyMap[KEY_ACTIONS.BACKWARD] = "KeyS";
keyMap[KEY_ACTIONS.LEFT] = "KeyA";
keyMap[KEY_ACTIONS.RIGHT] = "KeyD";

export default class InputManager extends MazeObject {
	constructor(mazeEngine) {
		super(mazeEngine);
		let keyStates = this.keyStates = mazeEngine.keyStates;

		keyStates[KEY_ACTIONS.FORWARD] = KEYSTATE_NONE;
		keyStates[KEY_ACTIONS.BACKWARD] = KEYSTATE_NONE;
		keyStates[KEY_ACTIONS.LEFT] = KEYSTATE_NONE;
		keyStates[KEY_ACTIONS.RIGHT] = KEYSTATE_NONE;

		this.lastKeyStates = Object.assign({}, keyStates);

		window.addEventListener("keydown", function (e) {
			let code = e.code;
			// console.log(`Keydown: ${code}`);
			for (let actionName in KEY_ACTIONS) {
				let actionId = KEY_ACTIONS[actionName];
				if (keyMap[actionId] === code) {
					let existingState = keyStates[actionId];
					if (existingState !== KEYSTATE_HELD) {
						keyStates[actionId] = KEYSTATE_DOWN;
						// console.log(`Keydown: ${actionName}`);
						// console.log(keyStates);
					}
				}
			}
		});
		window.addEventListener("keyup", function (e) {
			let code = e.code;
			for (let actionName in KEY_ACTIONS) {
				let actionId = KEY_ACTIONS[actionName];
				if (keyMap[actionId] === code) {
					keyStates[actionId] = KEYSTATE_UP;
				}
			}
		});
	}
	// sets key states based on current (set by addEventListeners above) and last states
	update() {
		super.update();
		let keyStates = this.keyStates;
		for (let actionName in KEY_ACTIONS) {
			let actionId = KEY_ACTIONS[actionName];
			let currentKeyState = keyStates[actionId];
			let lastKeyState = this.lastKeyStates[actionId];
			let toSet = null;
			switch (lastKeyState) {
				case KEYSTATE_UP:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							toSet = KEYSTATE_NONE;
							break;
						case KEYSTATE_DOWN:
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_HELD:
							console.error("Illegal state transition: up then held");
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_NONE:
							toSet = KEYSTATE_NONE;
							break;
					}
					break;
				case KEYSTATE_DOWN:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							toSet = KEYSTATE_UP;
							break;
						case KEYSTATE_DOWN:
							toSet = KEYSTATE_HELD;
							break;
						case KEYSTATE_HELD:
							toSet = KEYSTATE_HELD;
							break;
						case KEYSTATE_NONE:
							console.error("Illegal state transition: down then none");
							toSet = KEYSTATE_UP;
							break;
					}
					break;
				case KEYSTATE_HELD:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							toSet = KEYSTATE_UP;
							break;
						case KEYSTATE_DOWN:
							console.error("Illegal state transition: held then down");
							toSet = KEYSTATE_UP;
							break;
						case KEYSTATE_HELD:
							toSet = KEYSTATE_HELD;
							break;
						case KEYSTATE_NONE:
							console.error("Illegal state transition: held then none");
							toSet = KEYSTATE_UP;
							break;
					}
					break;
				case KEYSTATE_NONE:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							console.error("Illegal state transition: none then up");
							toSet = KEYSTATE_NONE;
							break;
						case KEYSTATE_DOWN:
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_HELD:
							console.error("Illegal state transition: none then held");
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_NONE:
							toSet = KEYSTATE_NONE;
							break;
					}
					break;
			}
			this.keyStates[actionId] = toSet;
		}
		this.lastKeyStates = Object.assign({}, keyStates);
	}
};	
