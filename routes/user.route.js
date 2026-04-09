import { Router } from "express";
import userDomain from "../controller/user.controller.js";
import APPSQUADZ from "../helpers/message.helper.js";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import roleGuardMiddleware from "../middlewares/roleGuard.middleware.js";

const userRouter = Router(),
  {
    loginUser,
    createNewUser,
    getUsers,
    updateUserById,
    changeUserStatus,
    deleteUser,
  } = userDomain,
  {
    ROUTES: {
      USER_ENDPOINTS: {
        LOGIN,
        CREATE_USER,
        GET_USERS,
        UPDATE_USER,
        CHANGE_STATUS,
        DELETE_USER,
      },
    },
  } = APPSQUADZ;


userRouter.post(LOGIN, loginUser);

userRouter.post(
  CREATE_USER,
  jwtMiddleware.verifyToken,
  roleGuardMiddleware.authorize("admin"),
  createNewUser
);

userRouter.get(
  GET_USERS,
  jwtMiddleware.verifyToken,
  roleGuardMiddleware.authorize("admin", "analyst"),
  getUsers
);

userRouter.put(
  UPDATE_USER,
  jwtMiddleware.verifyToken,
  roleGuardMiddleware.authorize("admin"),
  updateUserById
);

userRouter.patch(
  CHANGE_STATUS,
  jwtMiddleware.verifyToken,
  roleGuardMiddleware.authorize("admin"),
  changeUserStatus
);

userRouter.delete(
  DELETE_USER,
  jwtMiddleware.verifyToken,
  roleGuardMiddleware.authorize("admin"),
  deleteUser
);

export default userRouter;