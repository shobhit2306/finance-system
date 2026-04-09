import validator from "../configuration/validation.config.js";
import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
import responseHelper from "../helpers/response.helper.js";
import APPSQUADZ from "../helpers/message.helper.js";
import helpers from "../helpers/index.helper.js";
import {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  statusSchema,
  getUsersQuerySchema,
} from "../validators/user.validator.js";

const { validationThrowsError } = validator,
  { send200, send400, send500, send401, send403 } = responseHelper,
  {
    createUser,
    retrieveUserByEmail,
    retrieveUserByPhone,
    updateUser,
    retrieveUser,
    retrieveAllUsers
  } = userService,
  { generateToken } = helpers;




const loginUser = async (req, res) => {
  try {
    // const { email, password } = req.body;
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return send400(res, {
        status: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    const user = await retrieveUserByEmail(email);

    if (!user || user.isDeleted) {
      return send401(res, {
        status: false,
        message: "Invalid credentials",
      });
    }

    // 3. Check status
    if (user.status !== "active") {
      return send403(res, {
        status: false,
        message: "User is inactive",
      });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return send401(res, {
        status: false,
        message: "Invalid credentials",
      });
    }

    // 5. Generate token
    const token = generateToken(user);

    // 6. Save login info
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
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};


const createNewUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
      return send400(res, {
        status: false,
        message: error.details[0].message,
      });
    }

    const { name, email, phoneNo, password, role } = value;
    const existingEmail = await retrieveUserByEmail(email);
    if (existingEmail) {
      return send403(res, { message: "Email already exists" });
    }

    const existingPhone = await retrieveUserByPhone(phoneNo);
    if (existingPhone) {
      return send403(res, { message: "Phone already exists" });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : null;

    const user = await createUser({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      role: role || "viewer",
      status: "active",
    });

    user.password = undefined;

    return send200(res, {
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};


const getUsers = async (req, res) => {
  try {

    const { error, value } = getUsersQuerySchema.validate(req.query);

    if (error) {
      return send400(res, {
        status: false,
        message: error.details[0].message,
      });
    }
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      startDate,
      endDate,
      sortBy = "createdAt",
      order = "desc",
    } = value;

    const query = { isDeleted: false };
    const userRole = req.user.role;

    let allowedRoles = [];

    if (userRole === "admin") {
      allowedRoles = ["admin", "analyst", "viewer"];
    } else if (userRole === "analyst") {
      allowedRoles = ["analyst", "viewer"];
    } else if (userRole === "viewer") {
      allowedRoles = ["viewer"];
    }

    if (role) {
      const requestedRoles = role.split(",");

      query.role = {
        $in: requestedRoles.filter((r) =>
          allowedRoles.includes(r)
        ),
      };
    } else {
      query.role = { $in: allowedRoles };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const users = await retrieveAllUsers(
      query,
      sort,
      parsedLimit,
      offset,
      "name email phoneNo role status createdAt"
    );

    return send200(res, {
      status: true,
      data: users.docs,
      meta: {
        total: users.totalDocs,
        page: users.page,
        limit: users.limit,
        totalPages: users.totalPages,
      },
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};


const updateUserById = async (req, res) => {
  try {

    const { error, value } = updateUserSchema.validate(req.body);

    if (error) {
      return send400(res, {
        status: false,
        message: error.details[0].message,
      });
    }

    const updates = value;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await updateUser(
      { _id: req.params.id, isDeleted: false },
      updates
    );

    return send200(res, {
      status: true,
      message: "User updated",
      data: user,
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};


const changeUserStatus = async (req, res) => {
  try {
    const { error, value } = statusSchema.validate(req.body);

    if (error) {
      return send400(res, {
        status: false,
        message: error.details[0].message,
      });
    }

    const { status } = value;

    const user = await updateUser(
      { _id: req.params.id },
      { status }
    );

    return send200(res, {
      status: true,
      message: `User ${status}`,
      data: user,
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    await updateUser(
      { _id: req.params.id },
      { isDeleted: true }
    );

    return send200(res, {
      status: true,
      message: "User deleted",
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const userDomain = {
  loginUser,
  createNewUser,
  getUsers,
  updateUserById,
  changeUserStatus,
  deleteUser,
};

export default userDomain;