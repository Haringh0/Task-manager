const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/users");
const authenticate = require("../middleware/authenticate");
const { welcomeEmail, cancelEmail } = require("../emails/emails");

const router = express.Router();

// Signup User
router.post("/user/signup", async (request, response) => {
  const user = new User(request.body);

  try {
    const token = await user.generateToken();

    welcomeEmail(user.email, user.name);

    response.status(201).send({ user, token });
  } catch (error) {
    response.status(400).send(error);
  }
});

// Login user.
router.post("/user/login", async (request, response) => {
  try {
    const user = await User.findByCredentials(
      request.body.email,
      request.body.password
    );
    const token = await user.generateToken();

    response.status(200).send({ user, token });
  } catch (error) {
    response.sendStatus(400);
  }
});

// Logout user
router.post("/user/logout", authenticate, async (request, response) => {
  try {
    request.user.tokens = request.user.tokens.filter((token) => {
      return token.token !== request.token;
    });

    await request.user.save();

    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(500);
  }
});

// Log user out of all devices
router.post("/user/logoutAll", authenticate, async (request, response) => {
  try {
    request.user.tokens = [];

    await request.user.save();

    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(500);
  }
});

// Update user
router.patch("/user/update", authenticate, async (request, response) => {
  try {
    const updates = Object.keys(request.body);
    const allowedUpdates = ["name", "age", "email", "password"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return response.status(400).send("Invalid Updates!");
    }

    updates.forEach((update) => (request.user[update] = request.body[update]));

    await request.user.save();

    response.status(200).send(request.user);
  } catch (error) {
    response.sendStatus(400);

    console.log(error);
  }
});

// Delete a user
router.delete("/user/delete", authenticate, async (request, response) => {
  try {
    await request.user.remove();

    cancelEmail(request.user.email, request.user.name);

    response.status(200).send();
  } catch (error) {
    response.sendStatus(500);
  }
});

const upload = multer({
  limits: {
    fileSize: 1_000_000,
  },
  fileFilter(request, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error("Image file should be jpg, jpeg or png file."));
    }

    cb(null, true);
  },
}).single("profile_picture");

// Upload user Profile Picture
router.post("/user/profile_picture", authenticate, (request, response) => {
  upload(request, response, async function (error) {
    if (error || error instanceof multer.MulterError) {
      return response.status(400).send({ error: error.message });
    }

    const buffer = await sharp(request.file.buffer)
      .resize({
        width: 300,
        height: 300,
      })
      .png()
      .toBuffer();

    request.user.profile_picture = buffer;

    await request.user.save();

    response.sendStatus(200);
  });
});

//Delete user profile picture

router.delete(
  "/user/delete/profile_picture",
  authenticate,
  async (request, response) => {
    try {
      request.user.set("profile_picture", null);

      await request.user.save();

      response.sendStatus(200);
    } catch (error) {
      console.log(error);

      response.sendStatus(500);
    }
  }
);

router.get("/user/profile_picture", authenticate, async (request, response) => {
  try {
    if (!request.user) {
      throw new Error("Invalid User!");
    } else if (!request.user.profile_picture) {
      throw new Error("No Profile Picture!");
    }

    response.set("Content-Type", "image/png");

    response.send(request.user.profile_picture);
  } catch (error) {
    response.sendStatus(404);
  }
});

module.exports = router;
