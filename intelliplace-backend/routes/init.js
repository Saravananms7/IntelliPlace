import express from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Initialize database with admin user
router.post('/init-db', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await prisma.admin.findFirst();

    if (!adminExists) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Default admin user created successfully',
        credentials: {
          username: 'admin',
          password: 'admin123'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Database already initialized'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during database initialization'
    });
  }
});

export default router;