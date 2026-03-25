import validator from "../configuration/validation.config.js";
import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
import responseHelper from "../helpers/response.helper.js";
import APPSQUADZ from "../helpers/message.helper.js";
import __dirname from "../configuration/dir.config.js";
import helpers from "../helpers/index.helper.js";


const 
  { validationThrowsError } = validator,
  { send200, send400,send500,send401,send403 } = responseHelper,
  { createUser,retrieveUserByEmail,retrieveUserByPhone,updateUser } = userService,
  {generateToken}=helpers,
  {
    MESSAGES: {
      VLD_ERR,
    },
  } = APPSQUADZ;

  const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await retrieveUserByEmail(email);

    if (!user || user.role !== "SUPERADMIN") {
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
      message: "Superadmin login successful",
      data: { user, token },
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;

    const existingEmail = await retrieveUserByEmail(email);
    if (existingEmail) {
      return send403(res, {
        status: false,
        message: "Email already exists",
      });
    }

    const existingPhone = await retrieveUserByPhone(phoneNo);
    if (existingPhone) {
      return send403(res, {
        status: false,
        message: "Phone already exists",
      });
    }

    const admin = await createUser({
      name,
      email,
      phoneNo,
      password: await bcrypt.hash(password, 10),
      role: "ADMIN",
      isProfileComplete: true,
    });

    admin.password = undefined;

    return send200(res, {
      status: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
},
  userDomain = {
    createAdmin,
    superAdminLogin
  };

export default userDomain;
