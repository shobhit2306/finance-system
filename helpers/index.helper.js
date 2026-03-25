import jwt from "jsonwebtoken";
import defaultConfig from "../configuration/app.config.js";

const { jwtExpiry, jwtIss, jwtSecret } = defaultConfig;

const generateToken = (user) => {
    return jwt.sign(
      {
        iss: jwtIss,
        sub: user,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + jwtExpiry),
      }, 
      jwtSecret
    );
  },
  verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
  },
  invalidEndpoint = (router) => {
    return router.use("*", function (req, res) {
      res.send({
        status: false,
        message: "Error",
        data: [{ msg: "Invalid Endpoint" }],
      });
    });
  },
  helpers = {
    generateToken,
    verifyToken,
    invalidEndpoint,
  };

export default helpers;
