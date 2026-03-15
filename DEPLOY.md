# Guide de déploiement — GameChanger

## Prérequis

- Compte [Supabase](https://supabase.com) (plan gratuit suffisant)
- Compte [Vercel](https://vercel.com) (plan gratuit suffisant)
- Repository GitHub contenant ce projet
- Node.js 18+ installé localement

---

## Étape 1 — Configurer Supabase

### 1.1 Créer un projet Supabase

1. Connectez-vous sur [supabase.com](https://supabase.com)
2. Cliquez sur **New project**
3. Choisissez un nom (ex: `gamechanger`) et un mot de passe de base de données fort
4. Sélectionnez la région la plus proche

### 1.2 Récupérer les variables de connexion

Depuis le tableau de bord Supabase → **Settings** → **Database** :

- **DATABASE_URL** (mode pooling, port 6543) :
  ```
  postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

- **DIRECT_URL** (connexion directe, port 5432) :
  ```
  postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
  ```

Depuis **Settings** → **API** :

- **NEXT_PUBLIC_SUPABASE_URL** : l'URL de votre projet (ex: `https://abcdefgh.supabase.co`)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** : la clé `anon public`
- **SUPABASE_SERVICE_ROLE_KEY** : la clé `service_role` (⚠️ gardez-la secrète)

### 1.3 Créer le bucket de stockage

1. Dans Supabase → **Storage**
2. Cliquez sur **New bucket**
3. Nom : `board-games`
4. Cochez **Public bucket** ✓
5. Cliquez sur **Save**

---

## Étape 2 — Générer le secret NextAuth

Dans votre terminal :

```bash
openssl rand -base64 32
```

Copiez la valeur générée → ce sera votre `NEXTAUTH_SECRET`.

---

## Étape 3 — Générer les mots de passe admin hashés

Les variables `ADMIN_PASSWORD` et `TEAM_PASSWORD` doivent contenir des **hachages bcrypt**, pas les mots de passe en clair.

Pour générer un hachage bcrypt :

```bash
node -e "const b=require('bcryptjs'); b.hash('votre_mot_de_passe', 12).then(h => console.log(h))"
```

Exemple :
```bash
# Pour le compte admin
node -e "const b=require('bcryptjs'); b.hash('MonMotDePasse123!', 12).then(h => console.log(h))"

# Pour le compte team
node -e "const b=require('bcryptjs'); b.hash('AutreMotDePasse456!', 12).then(h => console.log(h))"
```

**Notez précieusement vos mots de passe** — les hachages ne sont pas réversibles.

---

## Étape 4 — Lancer les migrations Prisma

Clonez le repository localement et créez un fichier `.env` avec toutes vos variables :

```bash
cp .env.example .env
# Remplissez le fichier .env avec vos vraies valeurs
```

Installez les dépendances et lancez les migrations :

```bash
npm install
npx prisma migrate deploy
```

Cela crée les tables dans votre base de données Supabase.

---

## Étape 5 — Déployer sur Vercel

### 5.1 Connecter le repository

1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Cliquez sur **Add New Project**
3. Importez votre repository GitHub `gamechanger`
4. Framework détecté : **Next.js** ✓

### 5.2 Configurer les variables d'environnement

Dans la section **Environment Variables** de Vercel, ajoutez :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | URL pooling Supabase (port 6543) |
| `DIRECT_URL` | URL directe Supabase (port 5432) |
| `NEXTAUTH_SECRET` | Valeur générée à l'étape 2 |
| `NEXTAUTH_URL` | URL de votre app Vercel (ex: `https://gamechanger.vercel.app`) |
| `ADMIN_PASSWORD` | Hachage bcrypt du compte admin |
| `TEAM_PASSWORD` | Hachage bcrypt du compte team |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase |

### 5.3 Déployer

Cliquez sur **Deploy**. Vercel build et déploie automatiquement.

---

## Étape 6 — Post-déploiement

### Mettre à jour NEXTAUTH_URL

Une fois votre URL Vercel connue (ex: `https://gamechanger-xyz.vercel.app`), mettez à jour la variable `NEXTAUTH_URL` dans les settings Vercel → **Redéployez**.

### Vérifier le bucket Supabase

Assurez-vous que le bucket `board-games` dans Supabase Storage est bien en mode **Public** pour que les images soient accessibles.

---

## Accès admin

Une fois déployé, l'interface d'administration est accessible à :
```
https://votre-app.vercel.app/admin
```

Identifiants :
- Compte 1 : `admin` + mot de passe défini lors de l'étape 3
- Compte 2 : `team` + mot de passe défini lors de l'étape 3

---

## Mises à jour

Pour déployer une mise à jour, poussez simplement sur la branche `main` — Vercel redéploie automatiquement.

Si vous modifiez le schéma Prisma, relancez localement :
```bash
npx prisma migrate deploy
```
