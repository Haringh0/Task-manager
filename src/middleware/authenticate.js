const jwt = require("jsonwebtoken");

const User = require("../models/users");

const authenticate = async function (request, response, next) {
  try {
    const token = request.get("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    request.user = user;

    request.token = token;

    next();
  } catch (error) {
    // console.log(error);

    response.sendStatus(401);
  }
};

module.exports = authenticate;
