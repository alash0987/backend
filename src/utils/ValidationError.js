// utils/ValidationError.js
class ValidationError extends Error {
  constructor(messages = []) {
    super();
    this.name = "ValidationError";
    this.messages = messages;
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
