// const db = require("../../config/database");
const db = require("../config/database");

const bcrypt = require("bcryptjs");

class User {
  constructor(userData) {
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
  }

  // Create new user
  async save() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    const query = `
            INSERT INTO users (username, email, password, first_name, last_name)
            VALUES (?, ?, ?, ?, ?)
        `;

    const [result] = await db.execute(query, [
      this.username,
      this.email,
      hashedPassword,
      this.first_name,
      this.last_name,
    ]);

    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const query =
      "SELECT id, username, email, first_name, last_name, created_at FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Get all users
  static async findAll() {
    const query =
      "SELECT id, username, email, first_name, last_name, created_at FROM users";
    const [rows] = await db.execute(query);
    return rows;
  }

  // Update user
  static async update(id, userData) {
    const query = `
            UPDATE users 
            SET username = ?, email = ?, first_name = ?, last_name = ?
            WHERE id = ?
        `;

    const [result] = await db.execute(query, [
      userData.username,
      userData.email,
      userData.first_name,
      userData.last_name,
      id,
    ]);

    return result.affectedRows > 0;
  }

  // Delete user
  static async delete(id) {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
