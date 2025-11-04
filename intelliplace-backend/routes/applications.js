import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/applications/:id - get application detail
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid application id' });

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { include: { company: true } },
        student: true
      }
    });

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    // Authorization: students can view their own applications; companies can view applications for their jobs; admins can view all
    const user = req.user;
    if (user.userType === 'student') {
      if (application.studentId !== user.id) return res.status(403).json({ success: false, message: 'Access denied' });
    } else if (user.userType === 'company') {
      if (!application.job || application.job.companyId !== user.id) return res.status(403).json({ success: false, message: 'Access denied' });
    } else if (user.userType === 'admin') {
      // allow
    } else {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { application } });
  } catch (error) {
    console.error('Error fetching application detail:', error);
    res.status(500).json({ success: false, message: 'Server error fetching application' });
  }
});

export default router;
