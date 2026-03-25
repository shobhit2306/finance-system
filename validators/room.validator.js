import validator from "../configuration/validation.config.js";
import APPSQUADZ from "../helpers/message.helper.js";

const { check } = validator,
  {
    VALIDATIONS: {
      NAME_ALPHA,
      NAME_REQ,
    },
  } = APPSQUADZ;

const name = check("name")
    .not()
    .isEmpty()
    .withMessage(NAME_REQ)
    .custom((value) => /^[a-zA-Z ]*$/.test(value))
    .withMessage(NAME_ALPHA),
        capacity = check("capacity")
    .not()
    .isEmpty()
    .withMessage("capacity is a required field"),
        floor = check("floor")
    .not()
    .isEmpty()
    .withMessage("floor is a required field"),
    hourlyRate = check("hourlyRate")
    .not()
    .isEmpty()
    .withMessage("hourlyRate is a required field")
    ,
  roomValidator = {
    name, capacity, floor, hourlyRate
  };

export default roomValidator;
