const { check } = require("express-validator");

module.exports = {
  loginEmailValidation: check("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email!")
    .bail(),
  loginPasswordValidation: check("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty!"),
};
