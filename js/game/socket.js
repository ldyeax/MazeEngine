// Create Game Cache
var gameCache = { online: null };
const startSocketIO = function () {
	try {

		const script = document.createElement('script');
		document.head.appendChild(script);

		script.onload = function () {

			// Start Socket
			try {
				gameCache.socket = io(`${location.protocol}//${location.hostname}:3001`);
			} catch (err) {
				gameCache.socket = null;
				console.error(err);
			}

			// Send Map
			const senderMap = function () {

				// Exist Cells
				if (Array.isArray(gameCache.seed)) {
					console.log(tinyLog('Map is being uploaded!', 'socket', gameCache.socket.id));
					gameCache.socket.emit('maze-map-sender', gameCache.seed, function (complete) {
						if (complete) {
							console.log(tinyLog('Map Upload Complete!', 'socket', gameCache.socket.id));
						} else {
							console.log(tinyLog('Map Upload Failed!', 'socket', gameCache.socket.id));
						}
					});
				}

				// Try Again
				else { setTimeout(function() { senderMap(); }, 300); }

			};

			// Online Users
			gameCache.socket.on('online-users', (online) => {
				if(typeof online === 'number') {
					gameCache.online = online;
				}
			});

			// Connection Start
			gameCache.socket.on('connect', () => {

				// Welcome
				console.log(tinyLog(`Connected!`, 'socket', gameCache.socket.id));
				senderMap();

			});

			// Disconnected
			gameCache.socket.on('disconnect', () => {
				console.log(tinyLog(`Disconnected!`, 'socket'));
			});

		};

		script.onerror = function (err) { console.error(err); };
		script.async = true;
		script.src = `${location.protocol}//${location.hostname}:3001/socket.io/socket.io.js`;

	} catch (err) {
		gameCache.socket = null;
		console.error(err);
	}
};
startSocketIO();

// Start Socket App
gameCache.start = function (Scene, maze) {
	if (gameCache.socket) {

		// Insert Map into the cache
		gameCache.seed = clone(maze.seed);
		console.log(tinyLog(`The map seed is ${maze.seed.join('')}`, 'game', 'map'));
		console.log(tinyLog(`Width ${maze.seedSize.width}`, 'game', 'map'));
		console.log(tinyLog(`Height ${maze.seedSize.height}`, 'game', 'map'));

	}
};
