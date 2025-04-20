const jwt = require('jsonwebtoken');

const authenticateJwtToken = (request, response, next) => {
	const authHeaders = request.headers['authorization'];
	let jwtToken;
	if (authHeaders !== undefined) {
		jwtToken = authHeaders.split(' ')[1];
	}
	if (jwtToken === undefined) {
		response.status(401);
		response.send('Invalid JWT Token');
	} else {
		jwt.verify(jwtToken, 'MY_SECRET_KEY', (error, payload) => {
			if (error) {
				response.status(401);
				response.send('Invalid JWT Token');
			} else {
				request.user = payload.user;
				request.credits = payload.credits;
				next();
			}
		});
	}
};

module.exports = authenticateJwtToken;
