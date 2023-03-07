# MazeEngine
Javascript and THREE.js game engine made for Windows 95-style maze games. Loosely modeled around Unity3D.

MazeEngine is constructed with an optional pathRoot as an argument. pathRoot must be such that pathRoot + /engine points to the "engine" folder. It defaults to "."

```javascript
	let maze = new MazeEngine({
		pathRoot: "../"
	});
```

Wait for assets to load:
```javascript
await maze.loadAssets();
```

Instaniate your "Scene", which will derive from MazeObject. Note that TestScene is the name of the class, not an instance of an object - MazeEngine performs the instantiation. instantiate returns a reference to the instantiated MazeObject.

```javascript
maze.instantiate(TestScene);
```

And start it with a reference to a canvas.

```javascript
maze.start(document.getElementById("canvas"));
```

# MazeObject
Analogous to GameObject, but also used for "Scenes". See the scenes under "scene" for examples of this.
```javascript
export default class TestScene1 extends MazeObject {
	constructor(mazeEngine, args) {
```
mazeEngine will be a reference to the mazeEngine that's instantiating it, and args can be anything you want, passed as the second argument to instantiate on MazeEngine.instantiate(Class, args). Examples of MazeObject are in the "mazeobject" folder.

# MazeScript
Analogous to MonoBehaviour. A script that can be added to any MazeObject. args can be passed similar to on MazeObject.
```javascript
player = mazeEngine.instantiate(Player, {height: 1.75});
player.addScript(HairJiggler, {bounciness: 100});
```

Contributors:
[jimm](https://github.com/ldyeax)
[Yasmin Seidel](https://github.com/jasminDreasond)
