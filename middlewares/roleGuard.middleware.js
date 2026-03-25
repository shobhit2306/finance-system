import responseHelper from "../helpers/response.helper.js";

const { send403 } = responseHelper;

const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return send403(res, {
          status: false,
          message: "Access denied",
        });
      }
      next();
    } catch (error) {
      return send403(res, {
        status: false,
        message: "Authorization error",
      });
    }
  };
};

export default { authorize };