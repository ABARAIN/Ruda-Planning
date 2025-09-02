const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class UserModel {
  static async createUserTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
    `;
    
    try {
      await pool.query(sql);
      console.log("✅ Users table created/verified successfully");
    } catch (error) {
      console.error("❌ Error creating users table:", error);
      throw error;
    }
  }

  static async createUser(userData) {
    const { name, email, phone, username, password } = userData;
    
    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const sql = `
        INSERT INTO public.users (name, email, phone, username, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, username, created_at
      `;
      
      const values = [name, email, phone, username, hashedPassword];
      const result = await pool.query(sql, values);
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        if (error.constraint === 'users_username_key') {
          throw new Error('Username already exists');
        } else if (error.constraint === 'users_email_key') {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const sql = `
        SELECT id, name, email, phone, username, password, created_at
        FROM public.users
        WHERE username = $1
      `;
      
      const result = await pool.query(sql, [username]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const sql = `
        SELECT id, name, email, phone, username, password, created_at
        FROM public.users
        WHERE email = $1
      `;
      
      const result = await pool.query(sql, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const sql = `
        SELECT id, name, email, phone, username, created_at
        FROM public.users
        WHERE id = $1
      `;
      
      const result = await pool.query(sql, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const sql = `
        SELECT id, name, email, phone, username, created_at
        FROM public.users
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(sql);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, userData) {
    const { name, email, phone } = userData;
    
    try {
      const sql = `
        UPDATE public.users
        SET name = $1, email = $2, phone = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id, name, email, phone, username, created_at, updated_at
      `;
      
      const values = [name, email, phone, id];
      const result = await pool.query(sql, values);
      
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const sql = `
        DELETE FROM public.users
        WHERE id = $1
        RETURNING id
      `;
      
      const result = await pool.query(sql, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
