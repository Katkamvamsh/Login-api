const jwt = require("jsonwebtoken");

const protectedRoute = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  // Check if the Authorization header is present
  if (!authorization) {
    return res.status(401).send({
      success: false,
      status: 401,
      message: "Access denied. No token provided.",
    });
  }

  // Split the Authorization header to get the token
  const token = authorization.split(" ")[1];

  // Check if token exists after split
  if (!token) {
    return res.status(401).send({
      success: false,
      status: 401,
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify the token using your secret key from environment variable
    const decoded = jwt.verify(token, process.env.jwt_key); // JWT_SECRET_KEY should be in .env file

    // Attach the decoded token to the request object (for use in other routes)
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging

    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protectedRoute;
