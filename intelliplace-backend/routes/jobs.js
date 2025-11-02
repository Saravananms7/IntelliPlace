import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for CV uploads (memory storage so we can save bytes to DB)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper role checks
const authorizeCompany = (req, res, next) => {
  if (!req.user || req.user.userType !== 'company') return res.status(403).json({ success: false, message: 'Company access required' });
  next();
};

const authorizeStudent = (req, res, next) => {
  if (!req.user || req.user.userType !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
  next();
};

// Create a new job (company only)
router.post('/', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const { title, description, location, type, salary, requiredSkills, minCgpa, allowBacklog } = req.body;

    if (!title || !description || !type) return res.status(400).json({ success: false, message: 'Title, description and type are required' });

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location: location || null,
        type,
        salary: salary || null,
        requiredSkills: requiredSkills ? (Array.isArray(requiredSkills) ? requiredSkills.join(',') : String(requiredSkills)) : null,
        minCgpa: minCgpa ? parseFloat(minCgpa) : null,
        allowBacklog: allowBacklog === 'true' || allowBacklog === true ? true : false,
        companyId: companyId
      }
    });

    res.status(201).json({ success: true, message: 'Job created', data: job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, message: 'Server error creating job' });
  }
});

// List jobs (public) with simple filters
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' }, include: { company: true } }),
      prisma.job.count({ where })
    ]);

    res.json({ success: true, data: { jobs, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) } } });
  } catch (error) {
    console.error('Error listing jobs:', error);
    res.status(500).json({ success: false, message: 'Server error listing jobs' });
  }
});

// Student apply to a job with optional CV upload
router.post('/:jobId/apply', authenticateToken, authorizeStudent, upload.single('cv'), async (req, res) => {
  try {
    const studentId = req.user.id;
    const jobId = parseInt(req.params.jobId);
    const file = req.file;

    // Applicant-provided fields (optional)
    const { skills, cgpa, backlog } = req.body;

    // Verify job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Check existing application
    const existing = await prisma.application.findFirst({ where: { studentId, jobId } });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });

    // If CV uploaded, get buffer and save bytes to DB (application and optionally student profile)
    let cvBuffer = null;
    if (file && file.buffer) {
      cvBuffer = file.buffer;
      // Save CV bytes on student profile as well
      await prisma.student.update({ where: { id: studentId }, data: { cvData: cvBuffer } });
    }

    // Create application with optional applicant details (store CV bytes in DB)
    const application = await prisma.application.create({
      data: {
        studentId,
        jobId,
        skills: skills ? (Array.isArray(skills) ? skills.join(',') : String(skills)) : null,
        cgpa: cgpa ? parseFloat(cgpa) : null,
        backlog: backlog ? parseInt(backlog) : null,
        cvData: cvBuffer || null,
      }
    });

    res.status(201).json({ success: true, message: 'Applied successfully', data: { application } });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ success: false, message: 'Server error applying to job' });
  }
});

// Company: list applicants for a job (include student details and cv)
router.get('/:jobId/applicants', authenticateToken, authorizeCompany, async (req, res) => {
  try {
    const companyId = req.user.id;
    const jobId = parseInt(req.params.jobId);

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.companyId !== companyId) return res.status(404).json({ success: false, message: 'Job not found or access denied' });

    const applications = await prisma.application.findMany({ where: { jobId }, include: { student: true } });

    // Map to include both application-level fields and student profile
    const result = applications.map(app => ({
      id: app.id,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      skills: app.skills,
      cgpa: app.cgpa,
      backlog: app.backlog,
      cvBase64: app.cvData ? app.cvData.toString('base64') : (app.student && app.student.cvData ? app.student.cvData.toString('base64') : null),
      student: app.student ? {
        id: app.student.id,
        name: app.student.name,
        email: app.student.email,
        rollNumber: app.student.rollNumber,
        phone: app.student.phone,
        cgpa: app.student.cgpa,
        backlog: app.student.backlog,
      } : null,
    }));

    res.json({ success: true, data: { applications: result } });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ success: false, message: 'Server error fetching applicants' });
  }
});

export default router;
