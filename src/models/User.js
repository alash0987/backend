const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database"); // Sequelize instance

class User extends Model {
  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Find by email
  static async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  // Find by ID
  static async findById(id) {
    return await User.findByPk(id, {
      attributes: [
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "created_at",
      ],
    });
  }

  // Find all users
  static async findAllUsers() {
    return await User.findAll({
      attributes: [
        "id",
        // "username",
        // "email",
        // "first_name",
        // "last_name",
        // "createdAt",
      ],
    });
  }

  // Update user
  static async updateUser(id, userData) {
    const [affectedRows] = await User.update(
      {
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
      {
        where: { id },
      }
    );
    return affectedRows > 0;
  }

  // Delete user
  static async deleteUser(id) {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

module.exports = User;
