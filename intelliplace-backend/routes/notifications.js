import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware: only students can access notifications
const authorizeStudent = (req, res, next) => {
  if (!req.user || req.user.userType !== 'student') return res.status(403).json({ success: false, message: 'Student access required' });
  next();
};

// Get notifications for current student
router.get('/', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error in notifications:', dbError);
      if (dbError.code === 'P1001') {
        return res.status(503).json({
          success: false,
          message: 'Database connection failed. Please check:',
          error: {
            code: dbError.code,
            details: [
              '1. Verify your DATABASE_URL in .env file',
              '2. Check if Neon database is active (it may be paused)',
              '3. Visit Neon Console (https://console.neon.tech/) to wake up the database',
              '4. Verify network connectivity',
              '5. Check if database credentials are correct'
            ],
            host: dbError.meta?.database_host || 'unknown'
          }
        });
      }
      throw dbError;
    }

    const studentId = req.user.id;
    const notifications = await prisma.notification.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: { job: true, application: true }
    });
    res.json({ success: true, data: { notifications } });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Mark a single notification as read
router.patch('/:id/read', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const studentId = req.user.id;
    const id = parseInt(req.params.id);
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.studentId !== studentId) return res.status(404).json({ success: false, message: 'Notification not found or access denied' });

    await prisma.notification.update({ where: { id }, data: { read: true } });
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ success: false, message: 'Server error marking notification' });
  }
});

// Mark all notifications as read
router.post('/mark-all-read', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const studentId = req.user.id;
    await prisma.notification.updateMany({ where: { studentId, read: false }, data: { read: true } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    res.status(500).json({ success: false, message: 'Server error marking notifications' });
  }
});

// Open a notification: mark as read and return linked resource (application or job) so client can navigate
router.get('/:id/open', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const studentId = req.user.id;
    const id = parseInt(req.params.id);
    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.studentId !== studentId) return res.status(404).json({ success: false, message: 'Notification not found or access denied' });

    // Mark as read if not already
    if (!notif.read) {
      await prisma.notification.update({ where: { id }, data: { read: true } });
    }

    // If notification references an application, return it (with job/company)
    if (notif.applicationId) {
      const application = await prisma.application.findUnique({
        where: { id: notif.applicationId },
        include: { job: { include: { company: true } }, student: true }
      });
      return res.json({ success: true, data: { notification: notif, application } });
    }

    // If it references a job, return the job
    if (notif.jobId) {
      const job = await prisma.job.findUnique({ where: { id: notif.jobId }, include: { company: true } });
      return res.json({ success: true, data: { notification: notif, job } });
    }

    // Default: return the notification only
    return res.json({ success: true, data: { notification: notif } });
  } catch (error) {
    console.error('Error opening notification:', error);
    res.status(500).json({ success: false, message: 'Server error opening notification' });
  }
});

export default router;
