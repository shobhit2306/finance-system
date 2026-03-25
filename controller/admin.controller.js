import validator from "../configuration/validation.config.js";
import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
import responseHelper from "../helpers/response.helper.js";
import APPSQUADZ from "../helpers/message.helper.js";
import __dirname from "../configuration/dir.config.js";
import helpers from "../helpers/index.helper.js";
import sessionModel from "../models/session.model.js";

const
  { validationThrowsError } = validator,
  { send200, send400, send401, send500,send403 } = responseHelper,
  { createUser, retrieveUserByEmail, updateUser } = userService,
  { generateToken } = helpers,
  {
    MESSAGES: {
      VLD_ERR,
    },
  } = APPSQUADZ;


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await retrieveUserByEmail(email);

    if (!user || user.role !== "ADMIN") {
      return send401(res, {
        status: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return send401(res, {
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    await updateUser(
      { _id: user._id },
      {
        loginToken: token,
        loginTime: new Date(),
      }
    );

    user.password = undefined;

    return send200(res, {
      status: true,
      message: "Admin login successful",
      data: { user, token },
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};


const createSession = async (req, res) => {
  try {
    const adminId = req.user._id;

    // 1. Admin should not have another session
    const existingAdminSession = await sessionModel.findOne({ adminId });

    if (existingAdminSession) {
      return send403(res, {
        status: false,
        message: "Admin already assigned to a session",
      });
    }

    // 2. Only one active session globally
    const activeSession = await sessionModel.findOne({ isActive: true });

    if (activeSession) {
      return send403(res, {
        status: false,
        message: "Another active session already exists",
      });
    }

    // 3. Create session
    const { title, startDate } = req.body;

    const start = new Date(startDate);

    const end = new Date(start);
    end.setDate(end.getDate() + 30); // ✅ fixed 30 days

    const now = new Date();

    const isActive = now >= start && now <= end;

    const session = await sessionModel.create({
      title,
      adminId,
      startDate: start,
      endDate: end,
      isActive,
      status: isActive ? "ACTIVE" : "UPCOMING",
    });

    return send200(res, {
      status: true,
      message: "Session assigned to admin successfully",
      data: session,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
},
  userDomain = {
    adminLogin,
    createSession
  };

export default userDomain;
