import responseHelper from "../helpers/response.helper.js";
import indexHelper from "../helpers/index.helper.js";
import APPSQUADZ from "../helpers/message.helper.js";

const { send401 } = responseHelper,
  { verifyToken: jwtVerify } = indexHelper,
  {
    MESSAGES: { NO_TOKEN_ERR, PASS_TOKEN_INVD_ERR },
  } = APPSQUADZ;

const verifyToken = (req, res, next) => {
    try {
      if (!req.header("authorization"))
        send401(res, {
          status: false,
          message: "Error",
          data: [{ msg: NO_TOKEN_ERR }],
        });
      else {
        const token = req.header("authorization").split("Bearer ");
        // console.log("token==>", token);
        req.user = jwtVerify(token[1]).sub;
        next();
      }
    } catch (error) {
      send401(res, {
        status: false,
        message: "Error",
        data: [{ msg: PASS_TOKEN_INVD_ERR }],
      });
    }
  },
  jwtMiddleware = { verifyToken };

export default jwtMiddleware;
