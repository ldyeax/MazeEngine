var tinyLog = function (msg, name, name2) {

	const now = moment().format('MM/DD/YYYY HH:mm:ss');

	if (typeof name === 'string') {
		if (typeof name2 === 'string') {
			return `[${now}] [${name}] [${name2}] ${msg}`;
		} else {
			return `[${now}] [${name}]  ${msg}`;
		}
	} else {
		return `[${now}] ${msg}`;
	}

};
