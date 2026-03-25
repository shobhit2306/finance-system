import validator from "../configuration/validation.config.js";
import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
import responseHelper from "../helpers/response.helper.js";
import APPSQUADZ from "../helpers/message.helper.js";
import __dirname from "../configuration/dir.config.js";
import helpers from "../helpers/index.helper.js";
import sessionModel from "../models/session.model.js";
import enrollmentModel from "../models/enrollment.model.js";

const 
  { validationThrowsError } = validator,
  { send200, send400,send500,send401,send403 } = responseHelper,
  { createUser,retrieveUserByEmail,retrieveUserByPhone,updateUser,retrieveUser } = userService,
  {generateToken}=helpers,
  {
    MESSAGES: {
      VLD_ERR,
    },
  } = APPSQUADZ;

const orgSignup = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;

    // 1. Check existing email
    const existing = await retrieveUserByEmail(email);
    if (existing) {
      return send403(res, {
        status: false,
        message: "Email already registered",
      });
    }

    // 2. Create organization user
    const org = await createUser({
      name,
      email,
      phoneNo,
      password: await bcrypt.hash(password, 10),
      role: "ORGANIZATION",
      isProfileComplete: true,
    });

    return send200(res, {
      status: true,
      message: "Organization registered successfully",
      data: org,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
};
const orgLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const org = await retrieveUserByEmail(email);

    if (!org || org.role !== "ORGANIZATION") {
      return send401(res, {
        status: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, org.password);

    if (!isMatch) {
      return send401(res, {
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(org);

    await updateUser(
      { _id: org._id },
      {
        loginToken: token,
        loginTime: new Date(),
      }
    );

    org.password = undefined;

    return send200(res, {
      status: true,
      message: "Organization login successful",
      data: { org, token },
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const sponsorUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const orgId = req.user._id;

    // 1. Active session
    const session = await sessionModel.findOne({ isActive: true });

    if (!session) {
      return send403(res, {
        status: false,
        message: "No active session available",
      });
    }

    // 2. Check user exists
    const user = await retrieveUser({ _id:userId })
    // const user = await userModel.findById(userId);
    if (!user) {
      return send404(res, {
        status: false,
        message: "User not found",
      });
    }

    // 3. Already enrolled?
    const existing = await enrollmentModel.findOne({
      userId,
      sessionId: session._id,
    });

    if (existing) {
      return send403(res, {
        status: false,
        message: "User already enrolled",
      });
    }

    // 4. Create sponsored enrollment
    const enrollment = await enrollmentModel.create({
      userId,
      sessionId: session._id,
      paymentStatus: "SPONSORED",
      amount: 0,
    });

    return send200(res, {
      status: true,
      message: "User sponsored successfully",
      data: enrollment,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
};
const  organisationDomain = {
    orgSignup,
    orgLogin,
sponsorUser
  };

export default organisationDomain;
