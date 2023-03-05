self.onmessage = function(e) {
    let view = new Uint8Array(e.data);
	view[0] = 0xFF;
};
