# Friterie-Aide

Application web collaborative pour gérer les commandes de groupe à la friterie "Le Coin Croquant".

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Firebase - Base de données](#firebase---base-de-données)
- [GitHub - Déploiement](#github---déploiement)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)

---

## 📱 Aperçu

**Friterie-Aide** permet à plusieurs personnes d'ajouter leurs commandes simultanément avant de passer une commande groupée au restaurant. L'application se synchronise en temps réel entre tous les utilisateurs connectés.

**URL de production** : https://gestionactifs-aide.github.io/friterie-aide

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Navigateur Web │
└────────┬────────┘
         │
         │ React 19.2.0
         │
    ┌────▼────────────────────┐
    │   Application React     │
    │   (src/App.js)          │
    │                         │
    │  - Gestion état (hooks) │
    │  - UI Components        │
    │  - Logique métier       │
    └────┬────────────────┬───┘
         │                │
         │                │
    ┌────▼────┐      ┌────▼─────────┐
    │ GitHub  │      │   Firebase    │
    │  Pages  │      │   Realtime    │
    │         │      │   Database    │
    │ Hosting │      │  (EU-West-1)  │
    └─────────┘      └───────────────┘
```

---

## 🛠️ Technologies utilisées

### Frontend
- **React** 19.2.0 - Framework JavaScript
- **Create React App** 5.0.1 - Outil de build
- **CSS Grid** - Layout responsive

### Backend / Base de données
- **Firebase Realtime Database** - Base de données NoSQL en temps réel
- **Firebase SDK** 12.3.0 - Client JavaScript

### Déploiement
- **GitHub Pages** - Hébergement statique
- **gh-pages** 6.3.0 - Outil de déploiement automatique

---

## 📁 Structure du projet

```
friterie-aide/
│
├── public/                      # Fichiers statiques
│   ├── index.html              # Point d'entrée HTML
│   ├── AIDE_logo_Col.png       # Logo de l'organisation
│   ├── favicon.ico             # Icône du site
│   ├── manifest.json           # Configuration PWA
│   └── robots.txt              # Instructions pour les moteurs de recherche
│
├── src/                        # Code source React
│   ├── App.js                  # ⭐ Composant principal (572 lignes)
│   │                           #    - Gestion des commandes
│   │                           #    - Interface admin
│   │                           #    - Logique de synchronisation
│   │
│   ├── App.css                 # Styles principaux (453 lignes)
│   │                           #    - CSS Grid layout
│   │                           #    - Modal admin
│   │                           #    - Responsive design
│   │
│   ├── firebase.js             # ⭐ Configuration Firebase (16 lignes)
│   │                           #    - Initialisation SDK
│   │                           #    - Export database instance
│   │
│   ├── index.js                # Point d'entrée React
│   ├── index.css               # Styles globaux
│   └── [autres fichiers]      # Tests, setup, utilitaires
│
├── build/                      # 📦 Build de production (généré)
│
├── node_modules/               # Dépendances NPM
│
├── package.json                # Configuration NPM et scripts
├── package-lock.json           # Versions exactes des dépendances
├── .gitignore                  # Fichiers ignorés par Git
└── README.md                   # 📖 Ce fichier
```

### Fichiers clés

| Fichier | Rôle | Lignes |
|---------|------|--------|
| `src/App.js` | Logique principale, state management, UI | 572 |
| `src/App.css` | Tous les styles de l'application | 453 |
| `src/firebase.js` | Configuration et initialisation Firebase | 16 |
| `src/index.js` | Montage de l'application React dans le DOM | 15 |

---

## 🔥 Firebase - Base de données

### Configuration (`src/firebase.js`)

```javascript
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  projectId: "friterie-aide",
  databaseURL: "https://friterie-aide-default-rtdb.europe-west1.firebasedatabase.app",
  // ... autres clés
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
```

### Structure de la base de données

```
friterie-aide-default-rtdb/
│
├── commandes/                          # Array des commandes du jour
│   └── [
│         {
│           id: 1729234567890,         # Timestamp unique
│           nom: "Jean",                # Nom du client
│           tailleFrite: "Grande",      # Taille choisie
│           sauces: [                   # Array de sauces
│             {nom: "Ketchup", prix: 0.90},
│             {nom: "Mayonnaise", prix: 0.90}
│           ],
│           snacks: [                   # Array de snacks
│             {nom: "Fricadelle", prix: 1.50}
│           ],
│           total: 6.80                 # Prix total calculé
│         },
│         ...
│       ]
│
├── lastDate/                           # Date de dernière utilisation
│   └── "Sat Oct 18 2025"              # Format toDateString()
│
└── menu/                               # Prix des produits
    ├── frites/                         # Tailles et prix
    │   └── [
    │         {nom: "Mini", prix: 2.00},
    │         {nom: "Petite", prix: 2.50},
    │         {nom: "Moyenne", prix: 3.00},
    │         {nom: "Grande", prix: 3.50},
    │         {nom: "Spéciale (+1.50€)", prix: 4.50}
    │       ]
    │
    ├── sauces/                         # Liste des sauces
    │   └── [
    │         {nom: "Ketchup", prix: 0.90},
    │         {nom: "Mayonnaise", prix: 0.90},
    │         ... (16 sauces)
    │       ]
    │
    └── snacks/                         # Liste des snacks
        └── [
              {nom: "Fricadelle", prix: 1.50},
              {nom: "Hamburger", prix: 3.50},
              ... (35 snacks)
            ]
```

### Opérations Firebase

#### 1. Écoute en temps réel (`src/App.js:66-85`)

```javascript
useEffect(() => {
  const commandesRef = ref(database, 'commandes');
  const unsubscribe = onValue(commandesRef, (snapshot) => {
    setCommandes(snapshot.val() || []);
  });
  return () => unsubscribe();
}, []);
```

**Fonctionnement** :
- `onValue()` crée un listener qui s'active à chaque modification
- Synchronisation instantanée entre tous les clients connectés
- Le listener est nettoyé au démontage du composant

#### 2. Ajout de commande (`src/App.js:155`)

```javascript
const ajouterCommande = () => {
  const nouvelleCommande = {
    id: Date.now(),
    nom: nom,
    tailleFrite: tailleFrite,
    sauces: saucesSelectionnees,
    snacks: snacksSelectionnes,
    total: calculerTotal()
  };

  set(ref(database, 'commandes'), [...commandes, nouvelleCommande]);
};
```

#### 3. Suppression de commande (`src/App.js:179`)

```javascript
const supprimerCommande = (id) => {
  const nouvellesCommandes = commandes.filter(cmd => cmd.id !== id);
  set(ref(database, 'commandes'), nouvellesCommandes);
};
```

#### 4. Mise à jour des prix (Admin) (`src/App.js:335`)

```javascript
const sauvegarderPrix = () => {
  set(ref(database, 'menu/frites'), tempFrites);
  set(ref(database, 'menu/sauces'), tempSauces);
  set(ref(database, 'menu/snacks'), tempSnacks);
};
```

#### 5. Réinitialisation quotidienne (`src/App.js:87-133`)

```javascript
useEffect(() => {
  const checkDate = async () => {
    const snapshot = await get(ref(database, 'lastDate'));
    const lastDate = snapshot.val();
    const today = new Date().toDateString();

    if (lastDate !== today) {
      // Nouvelle journée détectée
      await set(ref(database, 'lastDate'), today);
      await set(ref(database, 'commandes'), []);
    }
  };

  // Délai de 500ms pour éviter les conflits multi-instances
  setTimeout(() => {
    if (!isInitialized.current) {
      checkDate();
      isInitialized.current = true;
    }
  }, 500);
}, []);
```

**Fonctionnement** :
- À chaque chargement de l'app, vérifie la date stockée
- Si la date a changé → réinitialise toutes les commandes
- Le délai de 500ms évite les écritures simultanées si plusieurs utilisateurs se connectent en même temps
- `isInitialized.current` empêche les réinitialisations multiples

---

## 🐙 GitHub - Déploiement

### Configuration du dépôt

```bash
Remote: https://github.com/gestionactifs-aide/friterie-aide
Branche principale: main
Branche de déploiement: gh-pages
```

### Scripts de déploiement (`package.json`)

```json
{
  "homepage": "https://gestionactifs-aide.github.io/friterie-aide",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Processus de déploiement

1. **Développement local** :
   ```bash
   npm start
   # → Lance le serveur de développement sur localhost:3000
   ```

2. **Build de production** :
   ```bash
   npm run build
   # → Compile l'application dans le dossier /build
   # → Minifie le code, optimise les assets
   ```

3. **Déploiement sur GitHub Pages** :
   ```bash
   npm run deploy
   # → Exécute automatiquement "predeploy" (npm run build)
   # → Pousse le contenu de /build sur la branche gh-pages
   # → GitHub Pages sert automatiquement cette branche
   ```

### Workflow complet

```
┌──────────────────┐
│  git add .       │
│  git commit -m   │  Versionner le code source
│  git push        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  npm run deploy  │  Déploiement automatique
└────────┬─────────┘
         │
         ├──► npm run build (predeploy)
         │    └──► Crée /build optimisé
         │
         └──► gh-pages -d build
              └──► Pousse /build vers branche gh-pages
                   └──► GitHub Pages met à jour le site
```

### Commits récents

```
c620174 - Fix Firebase date verification and command persistence
46985f4 - Add order summary and move admin access to logo
0faf69c - Add admin interface for price management
615c17c - Update Spéciale fries label to show supplement
3aac485 - Update menu prices and add date display
```

---

## 🚀 Installation

### Prérequis

- Node.js (version 14+)
- npm ou yarn
- Compte Firebase (base de données déjà configurée)
- Compte GitHub (pour le déploiement)

### Étapes

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/gestionactifs-aide/friterie-aide.git
   cd friterie-aide
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer en mode développement** :
   ```bash
   npm start
   ```
   → Ouvre automatiquement http://localhost:3000

4. **Builder pour la production** :
   ```bash
   npm run build
   ```

5. **Déployer sur GitHub Pages** :
   ```bash
   npm run deploy
   ```

---

## 💡 Utilisation

### Mode utilisateur

1. **Ajouter une commande** :
   - Entrez votre nom
   - Choisissez la taille de frites
   - Sélectionnez vos sauces (checkboxes)
   - Ajoutez des snacks si souhaité
   - Cliquez sur "Ajouter la commande"

2. **Voir les commandes** :
   - Liste affichée en temps réel à droite
   - Chaque commande montre : nom, détails, prix total
   - Bouton "Supprimer" pour retirer une commande

3. **Générer le résumé** :
   - Cliquez sur "Afficher le résumé"
   - Vue groupée : quantités de chaque produit
   - Vue détaillée : commandes par personne
   - Bouton "Copier" pour partager le résumé

### Mode administrateur

1. **Accès** :
   - Cliquez sur le logo AIDE en haut à gauche
   - Entrez le mot de passe : `AIDE2025`

2. **Modifier les prix** :
   - Onglets : Frites / Sauces / Snacks
   - Modifiez les prix dans les champs
   - Cliquez sur "Sauvegarder"
   - Les changements se propagent instantanément à tous les utilisateurs

---

## ✨ Fonctionnalités

### 🔄 Synchronisation en temps réel
- Tous les utilisateurs voient les mêmes données instantanément
- Ajouts, suppressions, modifications synchronisés
- Fonctionne sur plusieurs appareils simultanément

### 🌙 Réinitialisation automatique
- Chaque jour à minuit, les commandes sont effacées
- Détection basée sur `new Date().toDateString()`
- Protection contre les conflits multi-instances

### 🔐 Interface admin protégée
- Modification des prix en temps réel
- Mot de passe : `AIDE2025` (à changer en production)
- Sauvegarde instantanée dans Firebase

### 📊 Génération de résumé
- Résumé groupé par produit (ex: "3x Grande frites")
- Détails par personne
- Calcul du total général
- Copie en un clic pour envoi à la friterie

### 📞 Intégration restaurant
- Bouton d'appel direct : `tel:+3243368999`
- Localisation Google Maps
- Affichage des informations pratiques

### 📱 Responsive Design
- Layout adaptatif (CSS Grid)
- Deux colonnes sur desktop
- Empilement sur mobile
- Interface tactile optimisée

---

## 🔒 Sécurité

### ⚠️ Points d'attention actuels

1. **Clés Firebase exposées** :
   - Les credentials sont dans `src/firebase.js`
   - Normal pour une app client-side
   - Sécurité à gérer via Firebase Rules

2. **Pas d'authentification utilisateur** :
   - Accès public à la base de données
   - Convient pour un usage interne/confiance

3. **Mot de passe admin hardcodé** :
   - `AIDE2025` dans le code source
   - Visible par tous les utilisateurs
   - À améliorer pour un usage production

### 🛡️ Recommandations

Pour un environnement de production plus sécurisé :

1. Configurer les Firebase Security Rules :
   ```json
   {
     "rules": {
       "commandes": {
         ".read": true,
         ".write": true
       },
       "menu": {
         ".read": true,
         ".write": "auth != null"
       }
     }
   }
   ```

2. Implémenter Firebase Authentication
3. Utiliser des variables d'environnement pour les secrets
4. Ajouter un système de rôles (admin vs utilisateur)

---

## 📈 Évolutions possibles

- [ ] Historique des commandes (par jour/semaine)
- [ ] Export PDF du résumé
- [ ] Notifications push pour les nouveaux ajouts
- [ ] Mode hors-ligne (PWA + cache)
- [ ] Interface multilingue (FR/NL)
- [ ] Statistiques de consommation
- [ ] Intégration paiement en ligne
- [ ] Mode sombre

---

## 📞 Contact

**Organisation** : AIDE
**Email** : gestionactifs.aide@gmail.com
**Dépôt** : https://github.com/gestionactifs-aide/friterie-aide

---

## 📄 Licence

Ce projet est utilisé en interne par l'organisation AIDE.

---

**Dernière mise à jour** : Octobre 2025
