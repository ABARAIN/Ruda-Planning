const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, phone, username, password } = req.body;

      // Validation
      if (!name || !email || !phone || !username || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      // Phone validation
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number"
        });
      }

      // Username validation
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters long"
        });
      }

      // Password validation
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long"
        });
      }

      // Create user
      const user = await UserModel.createUser({
        name,
        email,
        phone,
        username,
        password
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          username: user.username
        }
      });

    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.message === 'Username already exists' || error.message === 'Email already exists') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
      }

      // Find user
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }

      // Validate password
      const isValidPassword = await UserModel.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          username: user.username
        }
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, email, phone } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and phone are required"
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      const updatedUser = await UserModel.updateUser(userId, {
        name,
        email,
        phone
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
      });

    } catch (error) {
      console.error("Update profile error:", error);
      
      if (error.message === 'Email already exists') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
}

module.exports = AuthController;
