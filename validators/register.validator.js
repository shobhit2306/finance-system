import validator from "../configuration/validation.config.js";
import APPSQUADZ from "../helpers/message.helper.js";

const { check } = validator,
  {
    VALIDATIONS: {
      NAME_ALPHA,
      NAME_REQ,
      PASSWORD_REQ,
      PASSWORD_INVD,
      PHONE_REQ,
      PHONE_INVD,
      EMAIL_REQ,
      INVD_EMAIL,
    },
  } = APPSQUADZ;

const name = check("name")
    .not()
    .isEmpty()
    .withMessage(NAME_REQ)
    .custom((value) => /^[a-zA-Z ]*$/.test(value))
    .withMessage(NAME_ALPHA),
  email = check("email")
    .not()
    .isEmpty()
    .withMessage(EMAIL_REQ)
    .trim()
    .isEmail()
    .withMessage(INVD_EMAIL),
  password = check("password")
    .not()
    .isEmpty()
    .withMessage(PASSWORD_REQ)
    .custom((value) =>
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        value
      )
    )
    .withMessage(PASSWORD_INVD),
    phoneNo = check("phoneNo")
    .not()
    .isEmpty()
    .withMessage(PHONE_REQ)
    .custom((value) =>
      /^([0-9]){10}$/.test(
        value
      )
    )
    .withMessage(PHONE_INVD),
  registerValidator = {
    name,
    email,
    password,
    phoneNo
  };

export default registerValidator;
