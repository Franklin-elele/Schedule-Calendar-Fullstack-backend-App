import StaffModel from "../models/staff.models.js";
import Signup from "../models/signup.models.js";
import jwt from "jsonwebtoken";
const { verify } = jwt;


export default async function verifyToken(req, res, next) {
  // const authHeader = req.headers.athorization  ;
  

  try {
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ error: "No token provided" });
    // }

    const token = req.cookies.accessToken;
     if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    let user;
    if (decoded.role === 'staff') {
      user = await StaffModel.findById(decoded._id).select("-password");
    } else {
      user = await Signup.findById(decoded._id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    // next steps: read header, verify token, attach user to req.user
    
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: err.message });
  }
};  
