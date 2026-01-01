const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  // 🕵️‍♂️ DEBUG LOGS (Check your VS Code Terminal when you hit Send!)
    console.log("------------------------------------------------");
    console.log("🛡️ AUTH GUARD ACTIVATED");
    console.log("📩 Received Header:", token);
    // 👇 ADD THIS LINE to see everything the server received
    console.log("👀 ALL HEADERS RECEIVED:", req.headers);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided" });
  }

  try {
    const tokenString = token.replace("Bearer", "");
    console.log("🔑 Clean Token:", tokenString);
    const decoded = jwt.verify(tokenString, "secret123");
    console.log("✅ Token Valid! User ID:", decoded.id);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};
