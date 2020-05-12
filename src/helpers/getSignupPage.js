module.exports = {
  getSignupPage(
    request,
    response,
    getError,
    validationErrors,
    errorClass,
    statusCode
  ) {
    try {
      response.render(
        "signup",
        {
          title: "Sign Up",
          firstNameErrorMessage: getError(validationErrors, "firstName"),
          lastNameErrorMessage: getError(validationErrors, "lastName"),
          ageErrorMessage: getError(validationErrors, "age"),
          emailErrorMessage: getError(validationErrors, "email"),
          passwordErrorMessage: getError(validationErrors, "password"),
          confirmPasswordErrorMessage: getError(validationErrors, "password"),
          errorClass,
        },
        function (error, html) {
          if (!error) {
            return response.status(statusCode).send(html);
          }
        }
      );
    } catch (error) {
      response.sendStatus(500);
    }
  },
};
