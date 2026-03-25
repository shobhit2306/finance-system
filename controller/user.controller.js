import validator from "../configuration/validation.config.js";
import bcrypt from "bcrypt";
import helpers from "../helpers/index.helper.js";
import userService from "../services/user.service.js";
import responseHelper from "../helpers/response.helper.js";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import registerValidator from "../validators/register.validator.js";
import authByEmailValidator from "../validators/auth.email.validator.js";
import APPSQUADZ from "../helpers/message.helper.js";
import __dirname from "../configuration/dir.config.js";
import moment from "moment";
import sessionModel from "../models/session.model.js";
import enrollmentModel from "../models/enrollment.model.js";
import videoProgressModel from "../models/videoProgress.model.js";
import quizModel from "../models/quiz.model.js";

const {
    generateToken,
  } = helpers,
  { validationThrowsError } = validator,
  { send200, send403, send400, send401, send404,send500 } = responseHelper,
  {
    createUser,
    retrieveUserByEmail,
    retrieveUserByPhone,
    updateUser,
    retrieveUser,
  } = userService,
  
  { verifyToken: jwtAuthGuard } = jwtMiddleware,
  {
    MESSAGES: {
      VLD_ERR,
      USER_REG_SUCCESS,
      USER_NOT_FOUND_ERR,
      LOGIN_SUCCESS,
      NUMBER_ALR_RGSTD,
      USER_INVD_PWD_ERR,
      USER_PROFILE,
    }
  } = APPSQUADZ

const register = [
  registerValidator.name,
  registerValidator.phoneNo,
  registerValidator.email,
  registerValidator.password,

  async (req, res) => {
    const errors = validationThrowsError(req);

    if (errors.length) {
      return send400(res, {
        status: false,
        message: VLD_ERR,
        data: errors,
      });
    }

    const { password, email, phoneNo } = req.body;

    // Check existing email
    const existingEmail = await retrieveUserByEmail(email);
    if (existingEmail) {
      return send403(res, {
        status: false,
        message: "Email already registered",
      });
    }

    // Check existing phone
    const existingPhone = await retrieveUserByPhone(phoneNo);
    if (existingPhone) {
      return send403(res, {
        status: false,
        message: "Phone already registered",
      });
    }

    // Create user
    const userObj = {
      name: req.body.name,
      email,
      phoneNo,
      role: "USER", // ✅ enforce role
      password: await bcrypt.hash(password, 10),
    };

    const created = await createUser(userObj);

    const token = generateToken(created);

    const user = await updateUser(
      { _id: created._id },
      {
        loginToken: token,
        loginTime: moment().utc().toDate(),
      }
    );

    // Remove sensitive fields
    user.password = undefined;

    return send200(res, {
      status: true,
      message: USER_REG_SUCCESS,
      data: user,
    });
  },
],
  authByEmail = [
    authByEmailValidator.email,
    authByEmailValidator.password,
  
    async (req, res) => {
      const errors = validationThrowsError(req);
      if (errors.length)
        send400(res, { status: false, message: VLD_ERR, data: errors });
      else {
        const {
          body: { email, password }
        } = req;

        let user = null;
        const existingUser = await retrieveUserByEmail(email);

        if (!existingUser) {
          send404(res, {
            status: false,
            message: "Error",
            data: [{ msg: USER_NOT_FOUND_ERR }],
          });
        } else {
          const {
            password: existingPassword,
            _id: existingUserId
          } = existingUser;

              if (!(await bcrypt.compare(password, existingPassword)))
                send401(res, {
                  status: false,
                  message: "Error",
                  data: [{ msg: USER_INVD_PWD_ERR }],
                });
              else {
                  user = await updateUser(
                    { _id: existingUserId },
                    {
                      loginToken: generateToken(existingUser),
                      loginTime: moment().utc().toDate(),
                    }
                  );
                  user.password = undefined;
                  send200(res, {
                    status: true,
                    message: LOGIN_SUCCESS,
                    data: user,
                  }); 
              }
        }
      }
    },
  ],
  profile = [
    jwtAuthGuard,
    async (req, res) => {
      const {
          user: { _id },
        } = req,
        profile = await retrieveUser({ _id });
      profile.loginToken = profile.password = undefined;
      send200(res, { status: true, message: USER_PROFILE, data: profile });
    },
  ],
 completeProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Check active session
    const activeSession = await sessionModel.findOne({ isActive: true });

    if (!activeSession) {
      return send403(res, {
        status: false,
        message: "No active session available. Cannot complete profile.",
      });
    }

    // 2. Update user profile
    const updatedUser = await updateUser(
      { _id: userId },
      {
        ...req.body,
        isProfileComplete: true,
      }
    );

    // Remove sensitive fields
    updatedUser.password = undefined;

    return send200(res, {
      status: true,
      message: "Profile completed successfully",
      data: updatedUser,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
},
 enrollUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Check active session
    const activeSession = await sessionModel.findOne({ isActive: true });

    if (!activeSession) {
      return send403(res, {
        status: false,
        message: "No active session available",
      });
    }

    // 2. Check already enrolled
    const existing = await enrollmentModel.findOne({
      userId,
      sessionId: activeSession._id,
    });

    if (existing) {
      return send403(res, {
        status: false,
        message: "User already enrolled in this session",
      });
    }

    // 3. Create enrollment (mock payment success)
    const enrollment = await enrollmentModel.create({
      userId,
      sessionId: activeSession._id,
      paymentStatus: "PAID",
      amount: activeSession.price,
    });

    return send200(res, {
      status: true,
      message: "Enrollment successful",
      data: enrollment,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
},
watchVideo = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Active session
    const session = await sessionModel.findOne({ isActive: true });

    if (!session) {
      return send403(res, { message: "No active session" });
    }

    const now = new Date();
if (session.endDate < now) {
  return send403(res, {
    message: "Session expired",
  });
}
    // 2. Enrollment check
    const enrolled = await enrollmentModel.findOne({
      userId,
      sessionId: session._id,
    });

    if (!enrolled) {
      return send403(res, { message: "User not enrolled" });
    }

    // 3. Daily limit check
    const today = new Date().toISOString().split("T")[0];

    const alreadyWatched = await videoProgressModel.findOne({
      userId,
      sessionId: session._id,
      date: today,
    });

    if (alreadyWatched) {
      return send403(res, {
        message: "Daily video already watched",
      });
    }

    // 4. Mark watched
    const progress = await videoProgressModel.create({
      userId,
      sessionId: session._id,
      date: today,
    });

    return send200(res, {
      status: true,
      message: "Video watched successfully",
      data: progress,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
},
attemptQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const { score } = req.body;

    const session = await sessionModel.findOne({ isActive: true });

    if (!session) {
      return send403(res, { message: "No active session" });
    }

const now = new Date();
if (session.endDate < now) {
  return send403(res, {
    message: "Session expired",
  });
}

    const enrolled = await enrollmentModel.findOne({
      userId,
      sessionId: session._id,
    });

    if (!enrolled) {
      return send403(res, { message: "User not enrolled" });
    }

    const today = new Date().toISOString().split("T")[0];

    const alreadyAttempted = await quizModel.findOne({
      userId,
      sessionId: session._id,
      date: today,
    });

    if (alreadyAttempted) {
      return send403(res, {
        message: "Quiz already attempted today",
      });
    }

    const attempt = await quizModel.create({
      userId,
      sessionId: session._id,
      date: today,
      score,
    });

    return send200(res, {
      status: true,
      message: "Quiz submitted successfully",
      data: attempt,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
},
 getScores = async (req, res) => {
  try {
    const userId = req.user._id;

    const attempts = await quizModel.find({ userId });

    return send200(res, {
      status: true,
      data: attempts,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
},
  userDomain = {
    register,
    authByEmail,
    profile,
    completeProfile,
    enrollUser,
    watchVideo,
    attemptQuiz,
    getScores
  };

export default userDomain;
