const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./tasks");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) throw new Error("Invalid Email!");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate: (value) => {
        if (value.toLowerCase().includes("password"))
          throw new Error("Please enter a secure password.");
      },
    },
    profile_picture: {
      type: Buffer,
    },
    tokens: [
      {
        __id: {
          type: mongoose.Types.ObjectId,
        },

        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("full_name").get(function () {
  return this.first_name + " " + this.last_name;
});

userSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "authorID",
});

userSchema.set("toJSON", {
  transform: function (userDocument, userObject, options) {
    delete userObject._id;

    delete userObject.tokens;

    delete userObject.password;

    delete userObject.__v;

    delete userObject.profile_picture;

    delete userObject.createdAt;

    delete userObject.updatedAt;

    return userObject;
  },
});

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.TOKEN_KEY, {
    expiresIn: "1h",
  });

  this.tokens.push({ token });

  await this.save();

  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login!");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

//Hash the password before saving in database
userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 8);

  next();
});

//Remove the user tasks before deleting user.
userSchema.pre("remove", async function (next) {
  await Task.deleteMany({ authorID: this._id });

  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
