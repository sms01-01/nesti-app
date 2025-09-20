import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Routes d'authentification
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address, familyRole } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        address,
        familyRole
      }
    });

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        familyRole: user.familyRole
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        familyRole: user.familyRole
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les familles
router.get('/families', authenticateToken, async (req, res) => {
  try {
    const families = await prisma.family.findMany({
      where: {
        members: {
          some: {
            userId: req.user.userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });
    res.json(families);
  } catch (error) {
    console.error('Erreur lors de la récupération des familles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/families', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Générer un code unique
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const family = await prisma.family.create({
      data: {
        name,
        code,
        createdBy: req.user.userId,
        members: {
          create: {
            userId: req.user.userId,
            role: 'admin'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    res.json(family);
  } catch (error) {
    console.error('Erreur lors de la création de la famille:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les membres de famille
router.post('/families/:familyId/members', authenticateToken, async (req, res) => {
  try {
    const { familyId } = req.params;
    const { firstName, lastName, role, avatar, isMinor, location } = req.body;

    // Vérifier que l'utilisateur fait partie de la famille
    const userMembership = await prisma.familyMember.findFirst({
      where: {
        familyId: parseInt(familyId),
        userId: req.user.userId
      }
    });

    if (!userMembership) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const member = await prisma.familyMember.create({
      data: {
        firstName,
        lastName,
        role,
        avatar,
        isMinor,
        location,
        familyId: parseInt(familyId),
        userId: req.user.userId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(member);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/families/:familyId/members', authenticateToken, async (req, res) => {
  try {
    const { familyId } = req.params;

    // Vérifier que l'utilisateur fait partie de la famille
    const userMembership = await prisma.familyMember.findFirst({
      where: {
        familyId: parseInt(familyId),
        userId: req.user.userId
      }
    });

    if (!userMembership) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const members = await prisma.familyMember.findMany({
      where: {
        familyId: parseInt(familyId)
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(members);
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les activités
router.get('/families/:familyId/activities', authenticateToken, async (req, res) => {
  try {
    const { familyId } = req.params;

    const activities = await prisma.activity.findMany({
      where: {
        familyId: parseInt(familyId)
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        activityDate: 'asc'
      }
    });

    res.json(activities);
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/families/:familyId/activities', authenticateToken, async (req, res) => {
  try {
    const { familyId } = req.params;
    const { title, description, location, activityDate, duration, category, accessibilityLevel } = req.body;

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        location,
        activityDate: new Date(activityDate),
        duration: duration ? parseInt(duration) : null,
        category,
        accessibilityLevel,
        createdBy: req.user.userId,
        familyId: parseInt(familyId)
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json(activity);
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
