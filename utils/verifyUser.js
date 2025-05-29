import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.token 
// console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
      success: false,
    });
  }

  try {
    const decodedToken = jwt.verify(token, "&%$#!!(^@#@!"); // don't use await here — jwt.verify is synchronous
    req.user = decodedToken;
// console.log(req.user);

    // ✅ Move to next middleware or route
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token.",
      success: false,
    });
  }
};
