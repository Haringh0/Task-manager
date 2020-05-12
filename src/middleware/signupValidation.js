const { check } = require("express-validator");
const User = require("../models/users");
const passwordValidator = require("password-validator");

const schema = new passwordValidator();

schema
  .is()
  .min(8)
  .is()
  .max(18)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols()
  .has()
  .not()
  .spaces();

module.exports = {
  firstNameValidation: check("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name cannot be empty!")
    .bail()
    .isString()
    .isLength({ min: 5 })
    .withMessage("First name should be atleast 5 characters long.")
    .bail(),
  lastNameValidation: check("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty!")
    .bail()
    .isString()
    .isLength({ min: 5 })
    .withMessage("Last name should be atleast 5 characters long.")
    .bail(),
  ageValidation: check("age")
    .trim()
    .notEmpty()
    .withMessage("Age cannot be empty!")
    .bail()
    .isNumeric({ no_symbols: true })
    .withMessage("Age should be in numbers!")
    .bail(),
  signupEmailValidation: check("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email!")
    .bail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });

      console.log(email);

      if (existingUser) {
        throw new Error("email exists! use another email.");
      }
    }),

  signupPasswordValidation: check("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty!")
    .bail()
    .isLength({ min: 8, max: 20 })
    .withMessage("Invalid password length!")
    .bail()
    .custom(async (password) => {
      if (!schema.validate(password)) {
        throw new Error(
          "Use 8 or more characters with a mix of letters, numbers & symbols"
        );
      }
    }),
  confirmPasswordValidation: check("confirmPassword")
    .trim()
    .custom(async (confirm_password, { req }) => {
      if (confirm_password !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
    }),
};
