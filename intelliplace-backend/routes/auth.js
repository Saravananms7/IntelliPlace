import express from 'express';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register Student
router.post('/register/student', async (req, res) => {
  try {
  const { name, email, password, rollNumber, phone, cgpa, backlog } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const student = await prisma.student.create({
      data: {
        name,
        email,
        password, // saved directly (not hashed) - note: plain-text storage
        rollNumber: rollNumber || null,
        phone: phone || null,
        cgpa: cgpa ? parseFloat(cgpa) : null,
        backlog: backlog ? parseInt(backlog) : null,
      },
    });

    const token = jwt.sign(
      { id: student.id, email: student.email, userType: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        phone: student.phone,
        userType: 'student',
      },
      token,
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Register Company
router.post('/register/company', async (req, res) => {
  try {
    const { companyName, email, password, industry, website, phone } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Company name, email, and password are required' });
    }

    const existingCompany = await prisma.company.findUnique({
      where: { email },
    });

    if (existingCompany) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const company = await prisma.company.create({
      data: {
        companyName,
        email,
        password, // plain text
        industry: industry || null,
        website: website || null,
        phone: phone || null,
      },
    });

    const token = jwt.sign(
      { id: company.id, email: company.email, userType: 'company' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      user: {
        id: company.id,
        companyName: company.companyName,
        name: company.companyName,
        email: company.email,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        userType: 'company',
      },
      token,
    });
  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login Student
router.post('/login/student', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student || student.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email, userType: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        phone: student.phone,
        userType: 'student',
      },
      token,
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Login Company
router.post('/login/company', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const company = await prisma.company.findUnique({
      where: { email },
    });

    if (!company || company.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: company.id, email: company.email, userType: 'company' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: company.id,
        companyName: company.companyName,
        name: company.companyName,
        email: company.email,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        userType: 'company',
      },
      token,
    });
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Login Admin
router.post('/login/admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const admin = await prisma.admin.findFirst({
      where: { username },
    });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, userType: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: admin.id,
        username: admin.username,
        name: 'Admin',
        userType: 'admin',
      },
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

export default router;
