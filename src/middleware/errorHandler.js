// middlewares/errorHandler.js
// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(err.statusCode || 400).json({ errors: err.messages });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map((e) => {
      if (e.path === "username") return "Username is already taken";
      if (e.path === "email") return "Email is already registered";
      return `${e.path} must be unique`;
    });
    return res.status(400).json({ errors: messages });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Something went wrong" });
};

module.exports = errorHandler;
