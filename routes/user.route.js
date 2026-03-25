import { Router } from "express";
import userDomain from "../controller/user.controller.js";
import APPSQUADZ from "../helpers/message.helper.js";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import roleGuardMiddleware from "../middlewares/roleGuard.middleware.js";

const userRouter = Router(),
  {
register,
    authByEmail,
    profile,
    completeProfile,
    enrollUser,
    watchVideo,
    attemptQuiz,
    getScores
  } = userDomain,
  {
    ROUTES: {
      USER_ENDPOINTS: {
        REGISTER,
        AUTH_EMAIL,
        PROFILE,
        COMPLETE_PROFILE,
        USER_ENROLL,
        USER_WATCH_VID,
        USER_QUIZ,
        USER_SCORE
      },
    },
  } = APPSQUADZ;

userRouter.post(REGISTER, register);
userRouter.post(AUTH_EMAIL, authByEmail);
userRouter.get(PROFILE, profile);
userRouter.post( COMPLETE_PROFILE,jwtMiddleware.verifyToken,roleGuardMiddleware.authorize(["USER"]),completeProfile);
userRouter.post(USER_ENROLL,jwtMiddleware.verifyToken,roleGuardMiddleware.authorize(["USER"]),enrollUser);
userRouter.post(USER_WATCH_VID, jwtMiddleware.verifyToken, roleGuardMiddleware.authorize(["USER"]), watchVideo);
userRouter.post(USER_QUIZ, jwtMiddleware.verifyToken, roleGuardMiddleware.authorize(["USER"]), attemptQuiz);
userRouter.get(USER_SCORE, jwtMiddleware.verifyToken, roleGuardMiddleware.authorize(["USER"]), getScores);
export default userRouter;
