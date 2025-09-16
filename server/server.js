require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Nodemailer transporter (for invites). In prod, use SendGrid/Mailgun/SES provider config.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

// helpers
function signToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}
async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId }});
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/* ---------- AUTH ---------- */
// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) return res.status(400).json({ error: 'Email already used' });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, name }});
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
});

/* ---------- FAMILIES ---------- */
// Create family (user becomes owner)
app.post('/api/families', authMiddleware, async (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Missing name or slug' });
  try {
    const f = await prisma.family.create({
      data: {
        name,
        slug,
        members: { create: { userId: req.user.id, role: 'owner' } }
      },
      include: { members: { include: { user: true } } }
    });
    res.json(f);
  } catch (err) {
    res.status(400).json({ error: 'Could not create family', detail: err.message });
  }
});

// Get families for current user
app.get('/api/families', authMiddleware, async (req, res) => {
  const families = await prisma.family.findMany({
    where: { members: { some: { userId: req.user.id } } },
    include: { members: { include: { user: true } } }
  });
  res.json(families);
});

// Invite member to family (sends email with token)
app.post('/api/families/:id/invite', authMiddleware, async (req, res) => {
  const familyId = Number(req.params.id);
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const membership = await prisma.familyMember.findUnique({
    where: { userId_familyId: { userId: req.user.id, familyId } }
  });
  if (!membership) return res.status(403).json({ error: 'Not allowed' });

  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days
  const inv = await prisma.invitation.create({
    data: { email, token, familyId, inviterId: req.user.id, expiresAt }
  });

  const link = `${APP_URL}/accept-invite?token=${token}`;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@example.com',
      to: email,
      subject: `Invitation à rejoindre la famille "${familyId}"`,
      html: `<p>Vous avez été invité à rejoindre la famille. Cliquez : <a href="${link}">${link}</a></p>`
    });
  } catch (e) {
    console.warn('Mail failed', e.message);
  }

  res.json({ ok: true, invitationId: inv.id });
});

// Accept invite (logged user)
app.post('/api/invitations/accept', authMiddleware, async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Missing token' });
  const inv = await prisma.invitation.findUnique({ where: { token } });
  if (!inv || inv.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' });
  if (inv.accepted) return res.status(400).json({ error: 'Already accepted' });

  // add member
  try {
    await prisma.familyMember.create({
      data: { userId: req.user.id, familyId: inv.familyId, role: 'member' }
    });
    await prisma.invitation.update({ where: { id: inv.id }, data: { accepted: true }});
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Could not accept invitation', detail: err.message });
  }
});

/* ---------- EVENTS ---------- */
app.post('/api/families/:id/events', authMiddleware, async (req, res) => {
  const familyId = Number(req.params.id);
  const membership = await prisma.familyMember.findUnique({ where: { userId_familyId: { userId: req.user.id, familyId } }});
  if (!membership) return res.status(403).json({ error: 'Not a member' });
  const { title, description, date, time } = req.body;
  const e = await prisma.event.create({ data: { familyId, title, description, date: new Date(date), time }});
  res.json(e);
});
app.get('/api/families/:id/events', authMiddleware, async (req, res) => {
  const familyId = Number(req.params.id);
  const events = await prisma.event.findMany({ where: { familyId }});
  res.json(events);
});

/* ---------- TASKS ---------- */
app.post('/api/families/:id/tasks', authMiddleware, async (req, res) => {
  const familyId = Number(req.params.id);
  const { title, description, dueDate, priority } = req.body;
  const t = await prisma.task.create({ data: { familyId, title, description, dueDate: dueDate ? new Date(dueDate) : null, priority }});
  res.json(t);
});
app.get('/api/families/:id/tasks', authMiddleware, async (req, res) => {
  const familyId = Number(req.params.id);
  const tasks = await prisma.task.findMany({ where: { familyId }});
  res.json(tasks);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on ${port}`));
