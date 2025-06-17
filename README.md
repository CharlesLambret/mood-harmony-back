# Mood Harmony Backend

Ce projet correspond à l'API backend du projet Mood Harmony, développée avec [NestJS](https://nestjs.com/) et [Prisma](https://www.prisma.io/) pour la gestion de la base de données.

## Présentation

Le backend expose une API REST sécurisée permettant la gestion des utilisateurs, des émotions, des genres musicaux, des préférences et la génération de sessions musicales personnalisées.  
La documentation interactive de l'API est disponible via Swagger.

## Scripts disponibles

Voici la liste des scripts définis dans le `package.json` :

## Lancer le projet

1. Installer les dépendances :

   ```bash
   pnpm install
   ```

2. Configurer la base de données dans le fichier `.env` (voir la variable `DATABASE_URL`).

3. Appliquer les migrations et générer le client Prisma :

   ```bash
   pnpm db:migrate
   pnpm db:generate
   ```

4. (Optionnel) Remplir la base de données avec des données de test :

   ```bash
   pnpm db:seed
   ```

5. Démarrer le serveur en développement :

   ```bash
   pnpm start:dev
   ```

## Accéder à la documentation Swagger

Une fois le serveur lancé, la documentation Swagger est accessible à l'adresse :

```
http://localhost:3000/api
```

Vous pouvez y explorer et tester toutes les routes de l'API.

---

**Technos principales :** NestJS, Prisma, PostgreSQL/MySQL/SQLite, Swagger, Docker (optionnel)