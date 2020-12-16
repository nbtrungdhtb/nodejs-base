const _ = require("lodash");

class RequestHandler {
	constructor(logger) {
		this.logger = logger;
	}

	throwIf(fn, status, errorType, errorMessage) {
		return result => (fn(result) ? this.throwError(status, errorType, errorMessage)() : result);
	}

	validateJoi(err, status, errorMessage) {
		if (err) { this.logger.log(`error in validating request : ${errorMessage}`, "error"); }
		return !_.isNull(err) ? this.throwError(status, errorMessage)() : "";
	}

	throwError(status, errorMessage) {
		return (e) => {
			if (!e) e = new Error(errorMessage || "Default Error");

			e.status = status;
			e.errorMessage = errorMessage;
			throw e;
		};
	}

	catchError(res, error) {
		if (!error) error = new Error("Default error");
		res.status(error.status || 500).json({ type: "error", message: error.message || "Unhandled error", error });
	}

	notFoundResponse (res, msg) {
		const data = {
			success: false,
			message: msg,
		};
		return res.status(404).json(data);
	}

	unauthorizedResponse (res, msg) {
		const data = {
			success: false,
			message: msg,
		};
		return res.status(401).json(data);
	}

	errorResponse (req, res, msg) {
		this.logger.log(`error ,Error during processing request: ${`${req.protocol}://${req.get("host")}${req.originalUrl}`} details message: ${msg}`, "error");
		const data = {
			success: false,
			message: msg,
		};
		return res.status(500).json(data);
	}

	successResponseWithData (res, data) {
		this.logger.log(`a request has been made and proccessed successfully at: ${new Date()}`, "info");
		const resData = {
			success: true,
			data: data
		};
		return res.status(200).json(resData);
	}

	successResponse (res, msg) {
		const data = {
			success: true,
			message: msg
		};
		return res.status(200).json(data);
	}

	successLogin(res, token, refresh_token) {
		const data = {
			success: true,
			message: "Login successfully",
			data: {
				token: token,
				refresh_token: refresh_token,
				type: "Bearer"
			}
		};
		return res.status(200).json(data);
	}

	errorLogin(res) {
		const data = {
			success: false,
			message: "Username or password do not exist"
		};
		return res.status(200).json(data);
	}
}
module.exports = RequestHandler;
