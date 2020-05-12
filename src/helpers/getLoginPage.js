module.exports = {
  getLoginPage(
    request,
    response,
    getError,
    validationErrors,
    errorClass,
    statusCode,
    invalidUserError
  ) {
    try {
      response.render(
        "login",
        {
          title: "Login",
          emailErrorMessage: getError(validationErrors, "email"),
          passwordErrorMessage: getError(validationErrors, "password"),
          errorClass,
          invalidUserError,
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
