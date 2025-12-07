const StaffModel = require("../models/staff.models");
const sendEmail = require("../utils/sendEmail");

// ---------- Admin Controller ----------
exports.createStaff = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Missing required staff fields" });
    }
    console.log("Step 1: Reached start");

    const staffCreation = new StaffModel({
      name,
      email,
      isActive: false,
    });
    console.log("Step 2: Created staff object");

    const inviteToken = staffCreation.generateInviteToken();
    console.log("Step 3: Token generated");

    await staffCreation.save();
    console.log("Step 3: Token generated");

    const invitelink = `http://localhost:5173/setup-account?token=${inviteToken}`;

    await sendEmail({
      to: staffCreation.email,
      subject: "You're Invited to Join as Staff",
      text: `Hello ${staffCreation.name},\n\nYou have been invited to join as a staff. Please use the following link to set up your account:\n\n${invitelink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nAdmin Team`,
    });

    console.log("Step 5: Email sent");

    res
      .status(200)
      .json({ message: "Staff created successfully", staffCreation });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

// ---------- Get All Staff Accounts ---------
exports.getStaffAccounts = async (req, res) => {
  try {
    const staffAccounts = await StaffModel.find().select(
      "-password -inviteToken -inviteTokenExpires"
    );
    res.status(200).json({ staffAccounts });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

// ---------- Delete Staff Account ----------
exports.deleteStaffAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteStaff = await StaffModel.findByIdAndDelete(id);
    if (!deleteStaff) {
      return res.status(404).json({ message: "Staff account not found" });
    }
    res.status(200).json({ message: "Staff account deleted successfully" });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

// ---------- Update Invite Token ----------
exports.updateToken = async (req, res) => {
  try {
    const { id } = req.params;
    const updateToken = await StaffModel.findById(id);

    if (!updateToken || updateToken.role !== "staff") {
      return res.status(404).json({ message: "Staff account not found" });
    }

    const newInviteToken = updateToken.generateInviteToken();
    await updateToken.save();

    const invitelink = `http://localhost:5173/setup-account?token=${newInviteToken}`;
    await sendEmail({
      to: updateToken.email,
      subject: "Your Invite Token has been Resent",
      text: `Hello ${updateToken.name},\n\nYour invite token has been updated. Please use the following link to set up your account:\n\n${invitelink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nAdmin Team`,
    });

    res
      .status(200)
      .json({ message: "Invite token updated and emailed successfully" });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};
