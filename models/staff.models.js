const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ---------- Schema Rules ----------

const staffSchema = new Schema(
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
            default: "staff",
        },
        inviteToken: {
            type: String,
            select: false,
            default: null
        },
        inviteTokenExpires: {
            type: Date,
            select: false,
            default: null
        },
        refreshToken: {
            type: String,
            default: null,
            select: false,
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
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// ---------- Password Hashing ----------
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  // Not saving confirm password in DB
  this.confirmPassword = undefined;

  next();
});

// ----------- Invite Token Generation -----------
staffSchema.methods.generateInviteToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.inviteToken = crypto.createHash('sha256').update(token).digest('hex');
    this.inviteTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    return token;
}


// ------------ RefreshToken Generation ------------
staffSchema.methods.generateRefreshToken = async function () {
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
staffSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// ----------- Model Export ----------

const StaffModel = mongoose.model("StaffModel", staffSchema);

module.exports = StaffModel;