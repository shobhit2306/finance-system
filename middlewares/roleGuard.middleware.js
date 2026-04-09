import responseHelper from "../helpers/response.helper.js";

const { send403 } = responseHelper;

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return send403(res, {
          status: false,
          message: `Role '${req.user?.role}' not allowed`,
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