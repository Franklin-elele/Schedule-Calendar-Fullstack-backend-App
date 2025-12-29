import { createHash } from "crypto";
import { findOne } from "../models/staff.models.js";

// ---------- Set Staff Password Controller ----------
export async function staffPassword(req, res) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    if (!req.query.token) {
  return res.status(400).json({ error: "Token missing in query" });
}


    const hashedToken = createHash("sha256")
      .update(req.query.token)
      .digest("hex");

    const verifyToken = await findOne({
      inviteToken: hashedToken,
      inviteTokenExpires: { $gt: Date.now() },
    });

    if (!verifyToken) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    verifyToken.password = password;
    verifyToken.isActive = true;
    verifyToken.inviteToken = undefined;
    verifyToken.inviteTokenExpires = undefined;

    await verifyToken.save();
    const refreshToken = await verifyToken.generateRefreshToken();
    const accessToken = await verifyToken.generateAccessToken();
    res
      .status(200)
      .json({ 
        message: "Password set successfully, account activated",
        user: {
        name: verifyToken.name,
        email: verifyToken.email,
        role: verifyToken.role,
      },
      accessToken,
      refreshToken,
    });

  } catch (err) {
    res.status(404).json({ Error: err.message });
  }
}  
