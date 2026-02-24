import { body } from "express-validator";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

// User Validators
const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is Required")
      .isLength({ min: 3 })
      .withMessage("Username should be atleast 3 characters")
      .isLength({ max: 13 })
      .withMessage("Username cannot exceed 13 characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is Required")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is not valid"),
    body("username").optional(),
    body("password").notEmpty().withMessage("Password is Required"),
  ];
};

// Projects Validotors
const createProjectValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Project name is required")
      .isLength({ max: 100 })
      .withMessage("Project name cannot exceed 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
  ];
};

const updateProjectValidator = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project name cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Project name cannot exceed 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
  ];
};

const addProjectMemberValidator = () => {
  return [
    body("userId")
      .trim()
      .notEmpty()
      .withMessage("userId is required")
      .isMongoId()
      .withMessage("Invalid userId"),
    body("role")
      .optional()
      .isIn(AvailableUserRoles)
      .withMessage(`Role must be one of: ${AvailableUserRoles.join(", ")}`),
  ];
};

const updateMemberRoleValidator = () => {
  return [
    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRoles)
      .withMessage(`Role must be one of: ${AvailableUserRoles.join(", ")}`),
  ];
};

export { userRegistrationValidator, userLoginValidator,  createProjectValidator,
  updateProjectValidator,
  addProjectMemberValidator,
  updateMemberRoleValidator,};
