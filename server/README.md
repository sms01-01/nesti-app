# Nesti - Backend (Express + Prisma)

Prérequis:
- Node.js (>=18)
- PostgreSQL (local ou service cloud)

Installation rapide:
1. Copier .env.example -> .env et renseigner DATABASE_URL, JWT_SECRET, SMTP_*
2. Installer dépendances:
   cd server
   npm install
3. Générer Prisma client:
   npx prisma generate
4. Lancer la migration initiale:
   npx prisma migrate dev --name init
   (ou, si tu préfères, `npx prisma db push` en dev)
5. Démarrer:
   npm run dev

Endpoints principaux:
- POST /api/auth/register { email, password, name }
- POST /api/auth/login { email, password }
- POST /api/families { name, slug } (requires Authorization Bearer)
- GET /api/families (requires Authorization)
- POST /api/families/:id/invite { email } (requires Authorization)
- POST /api/invitations/accept { token } (requires Authorization)
- CRUD events & tasks under /api/families/:id/events and /api/families/:id/tasks

Notes de sécurité:
- Ne laisse jamais JWT_SECRET ou credentials en clair sur GitHub.
- Utilise un provider d'email pour la production (SendGrid, Mailgun, SES).
