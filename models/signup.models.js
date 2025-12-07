const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ---------- Schema Rules ----------
const signupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    password: {
      type: String,
      required: function () {
        return this.isActive;
      },
      minlength: 6,
      select: false,
      validate: {
        validator: function (valid) {
          return !valid || valid.length >= 6;
        },
        message: "Password must be at least 6 characters long",
      },
    },
    refreshToken: {
      type: String,
      select: false,
      default: null,
    },
    
  },
  { timestamps: true }
);

// ---------- Password Hashing ----------
signupSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  // Not saving confirm password in DB
  this.confirmPassword = undefined;

  next();
});

// ------------ RefreshToken Generation ------------
signupSchema.methods.generateRefreshToken = async function () {
  const jsonRefreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  this.refreshToken = jsonRefreshToken;
  await this.save();

  return jsonRefreshToken;
};

// ------------ AccessToken Generation ------------
signupSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};




// ----------- Model Export ----------

const Signup = mongoose.model("Signup", signupSchema);

module.exports = Signup;
