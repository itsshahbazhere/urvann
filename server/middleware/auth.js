const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    // fetch token safely
    let token =
      req.cookies?.token ||
      (req.header("Authorization") &&
        req.header("Authorization").replace("Bearer ", "")) ||
      req.body.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    console.log("Token received:", token);

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      console.error("Token is invalid", error);
      return res.status(401).json({
        success: false,
        message: "Token isn't valid",
        error: error.message,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
      error: error.message,
    });
  }
};
