import responseHelper from "../helpers/response.helper.js";
import indexHelper from "../helpers/index.helper.js";
import APPSQUADZ from "../helpers/message.helper.js";

const { send401, send403 } = responseHelper,
  { verifyToken: jwtVerify } = indexHelper,
  {
    MESSAGES: { NO_TOKEN_ERR, PASS_TOKEN_INVD_ERR, INCTV_USER_ERR },
  } = APPSQUADZ;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return send401(res, {
        status: false,
        message: NO_TOKEN_ERR,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwtVerify(token);

    req.user = decoded.sub;

    if (req.user.status === "inactive") {
      return send403(res, {
        status: false,
        message: INCTV_USER_ERR,
      });
    }

    next();
  } catch (error) {
    return send401(res, {
      status: false,
      message: PASS_TOKEN_INVD_ERR,
    });
  }
},
  jwtMiddleware = { verifyToken };

export default jwtMiddleware;
