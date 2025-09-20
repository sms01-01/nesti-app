// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Début du peuplement des données de test...');
  
  // Hasher les mots de passe
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Créer des utilisateurs de test
  const user1 = await prisma.user.create({
    data: {
      name: 'Marie Martin',
      email: 'marie@nesti.fr',
      password: hashedPassword,
      familyRole: 'parent'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Pierre Martin',
      email: 'pierre@nesti.fr',
      password: hashedPassword,
      familyRole: 'parent'
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Emma Martin',
      email: 'emma@nesti.fr',
      password: hashedPassword,
      familyRole: 'child'
    }
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Grand-père Jean',
      email: 'jean@nesti.fr',
      password: hashedPassword,
      familyRole: 'grandparent'
    }
  });

  // Créer une famille
  const family = await prisma.family.create({
    data: {
      name: 'Famille Martin',
      code: 'MARTIN',
      createdBy: user1.id
    }
  });

  // Ajouter des membres à la famille
  await prisma.familyMember.createMany({
    data: [
      { userId: user1.id, familyId: family.id, role: 'admin' },
      { userId: user2.id, familyId: family.id, role: 'member' },
      { userId: user3.id, familyId: family.id, role: 'child' },
      { userId: user4.id, familyId: family.id, role: 'grandparent' }
    ]
  });

  // Créer des badges
  const badges = await prisma.badge.createMany({
    data: [
      { name: 'Explorateur', description: 'Première activité complétée', icon: '🏆' },
      { name: 'Chef cuisinier', description: 'Participé à un atelier cuisine', icon: '👨‍🍳' },
      { name: 'Nature lover', description: '5 activités en nature complétées', icon: '🌳' },
      { name: 'Social butterfly', description: '10 activités avec d\'autres familles', icon: '🦋' }
    ]
  });

  // Attribuer des badges aux utilisateurs
  await prisma.userBadge.createMany({
    data: [
      { userId: user1.id, badgeId: 1 },
      { userId: user1.id, badgeId: 2 },
      { userId: user2.id, badgeId: 1 },
      { userId: user3.id, badgeId: 3 },
      { userId: user4.id, badgeId: 4 }
    ]
  });

  // Créer des activités
  const activities = await prisma.activity.createMany({
    data: [
      {
        title: 'Parc naturel',
        description: 'Journée au parc naturel pour découvrir la biodiversité',
        location: 'Parc Naturalia, Paris',
        activityDate: new Date('2023-10-15T10:00:00'),
        duration: 240,
        category: 'Nature',
        accessibilityLevel: 'high',
        createdBy: user1.id,
        familyId: family.id
      },
      {
        title: 'Atelier cuisine inclusive',
        description: 'Apprendre à cuisiner des plats adaptés à tous',
        location: 'Cuisine Partagée, Lyon',
        activityDate: new Date('2023-10-21T14:30:00'),
        duration: 120,
        category: 'Cuisine',
        accessibilityLevel: 'medium',
        createdBy: user2.id,
        familyId: family.id
      },
      {
        title: 'Visite musée accessible',
        description: 'Découverte de l\'exposition sur l\'histoire inclusive',
        location: 'Musée National, Paris',
        activityDate: new Date('2023-10-29T11:00:00'),
        duration: 180,
        category: 'Culture',
        accessibilityLevel: 'high',
        createdBy: user1.id,
        familyId: family.id
      },
      {
        title: 'Randonnée adaptée',
        description: 'Randonnée en montagne avec sentiers accessibles',
        location: 'Massif Central, Auvergne',
        activityDate: new Date('2023-11-05T09:00:00'),
        duration: 360,
        category: 'Sport',
        accessibilityLevel: 'medium',
        createdBy: user4.id,
        familyId: family.id
      }
    ]
  });

  // Ajouter des participants aux activités
  await prisma.activityParticipant.createMany({
    data: [
      // Activité 1 - Parc naturel
      { activityId: 1, userId: user1.id, status: 'accepted', respondedAt: new Date() },
      { activityId: 1, userId: user2.id, status: 'accepted', respondedAt: new Date() },
      { activityId: 1, userId: user3.id, status: 'accepted', respondedAt: new Date() },
      
      // Activité 2 - Atelier cuisine
      { activityId: 2, userId: user1.id, status: 'accepted', respondedAt: new Date() },
      { activityId: 2, userId: user2.id, status: 'accepted', respondedAt: new Date() },
      { activityId: 2, userId: user4.id, status: 'declined', respondedAt: new Date() },
      
      // Activité 3 - Musée
      { activityId: 3, userId: user1.id, status: 'accepted', respondedAt: new Date() },
      { activityId: 3, userId: user3.id, status: 'accepted', respondedAt: new Date() },
      { activityId: 3, userId: user4.id, status: 'accepted', respondedAt: new Date() },
      
      // Activité 4 - Randonnée
      { activityId: 4, userId: user1.id, status: 'pending' },
      { activityId: 4, userId: user2.id, status: 'pending' },
      { activityId: 4, userId: user4.id, status: 'accepted', respondedAt: new Date() }
    ]
  });

  console.log('✅ Données de test créées avec succès!');
  console.log(`👥 ${await prisma.user.count()} utilisateurs créés`);
  console.log(`🏠 ${await prisma.family.count()} familles créées`);
  console.log(`🎯 ${await prisma.activity.count()} activités créées`);
  console.log(`🏆 ${await prisma.badge.count()} badges créés`);
}

main()
  .catch(e => {
    console.error('❌ Erreur lors du peuplement:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
