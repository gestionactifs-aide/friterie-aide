# Friterie-Aide

Application web collaborative pour gérer les commandes de groupe à la friterie "Le Coin Croquant".

## Table des matières

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

## Aperçu

**Friterie-Aide** permet à plusieurs personnes d'ajouter leurs commandes simultanément avant de passer une commande groupée au restaurant. L'application se synchronise en temps réel entre tous les utilisateurs connectés.

**URL de production** : https://gestionactifs-aide.github.io/friterie-aide

---

## Architecture

```
┌─────────────────┐
│  Navigateur Web │
└────────┬────────┘
         │
         │ React 19.2.0
         │
    ┌────▼────────────────────┐
    │   Application React     │
    │   (src/App.jsx)         │
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

## Technologies utilisées

### Frontend
- **React** 19.2.0 - Framework JavaScript
- **Vite** 7.x - Outil de build ultra-rapide
- **CSS Grid** - Layout responsive

### Backend / Base de données
- **Firebase Realtime Database** - Base de données NoSQL en temps réel
- **Firebase SDK** 12.8.0 - Client JavaScript

### Déploiement
- **GitHub Pages** - Hébergement statique
- **gh-pages** 6.1.1 - Outil de déploiement automatique

---

## Structure du projet

```
friterie-aide/
│
├── public/                      # Fichiers statiques
│   ├── AIDE_logo_Col.png       # Logo de l'organisation
│   └── vite.svg                # Icône Vite
│
├── src/                        # Code source React
│   ├── App.jsx                 # Composant principal
│   │                           #    - Gestion des commandes
│   │                           #    - Interface admin
│   │                           #    - Logique de synchronisation
│   │
│   ├── App.css                 # Styles principaux
│   │                           #    - CSS Grid layout
│   │                           #    - Modal admin
│   │                           #    - Responsive design
│   │
│   ├── firebase.js             # Configuration Firebase
│   │                           #    - Initialisation SDK
│   │                           #    - Export database instance
│   │
│   ├── main.jsx                # Point d'entrée React
│   └── index.css               # Styles globaux
│
├── dist/                       # Build de production (généré)
│
├── node_modules/               # Dépendances NPM
│
├── index.html                  # Point d'entrée HTML (Vite)
├── vite.config.js              # Configuration Vite
├── package.json                # Configuration NPM et scripts
├── package-lock.json           # Versions exactes des dépendances
├── .gitignore                  # Fichiers ignorés par Git
└── README.md                   # Ce fichier
```

### Fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/App.jsx` | Logique principale, state management, UI |
| `src/App.css` | Tous les styles de l'application |
| `src/firebase.js` | Configuration et initialisation Firebase |
| `src/main.jsx` | Montage de l'application React dans le DOM |
| `vite.config.js` | Configuration Vite (base URL pour GitHub Pages) |

---

## Firebase - Base de données

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
├── commandes/                          # Objet avec clés uniques Firebase
│   ├── -NxYz123abc/                   # Clé générée par push()
│   │   ├── timestamp: 1729234567890
│   │   ├── nom: "Jean"
│   │   ├── tailleFrite: "Grande"
│   │   ├── sauces: [{nom, prix}, ...]
│   │   ├── snacks: [{nom, prix}, ...]
│   │   └── total: 6.80
│   └── -NxYz456def/
│       └── ...
│
└── menu/                               # Prix des produits
    ├── frites/                         # Tailles et prix
    ├── sauces/                         # Liste des sauces
    └── snacks/                         # Liste des snacks
```

### Opérations Firebase (v2.0 - Corrigé)

#### 1. Écoute en temps réel

```javascript
useEffect(() => {
  const commandesRef = ref(database, 'commandes');
  const unsubscribe = onValue(commandesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Convertir l'objet Firebase en tableau
      const commandesArray = Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key
      }));
      setCommandes(commandesArray);
    } else {
      setCommandes([]);
    }
  });
  return () => unsubscribe();
}, []);
```

#### 2. Ajout de commande (CORRIGÉ - push au lieu de set)

```javascript
const ajouterCommande = () => {
  const nouvelleCommande = {
    timestamp: Date.now(),
    nom: nom,
    tailleFrite: tailleFrite,
    sauces: saucesSelectionnees,
    snacks: snacksSelectionnes,
    total: calculerTotal()
  };

  // push() crée une clé unique - PAS DE RACE CONDITION
  push(ref(database, 'commandes'), nouvelleCommande);
};
```

#### 3. Suppression de commande (CORRIGÉ - remove au lieu de set)

```javascript
const supprimerCommande = (id) => {
  // Supprime uniquement cette commande par sa clé
  remove(ref(database, `commandes/${id}`));
};
```

### Correction du bug v2.0

**Problème v1.x** : Les commandes disparaissaient quand plusieurs utilisateurs se connectaient simultanément.

**Cause** : Race condition avec `set()` qui écrasait toutes les commandes.

```javascript
// ANCIEN CODE (BUGUÉ)
const nouvellesCommandes = [...commandes, nouvelleCommande];
set(commandesRef, nouvellesCommandes);  // Écrase tout !
```

**Solution v2.0** : Utiliser `push()` et `remove()` pour des opérations atomiques.

```javascript
// NOUVEAU CODE (CORRIGÉ)
push(commandesRef, nouvelleCommande);  // Ajoute sans écraser
remove(ref(database, `commandes/${id}`));  // Supprime une seule entrée
```

---

## GitHub - Déploiement

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
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Processus de déploiement

1. **Développement local** :
   ```bash
   npm run dev
   # → Lance le serveur Vite sur localhost:5173
   # → Hot Module Replacement instantané
   ```

2. **Build de production** :
   ```bash
   npm run build
   # → Compile l'application dans le dossier /dist
   # → Minifie le code, optimise les assets
   ```

3. **Déploiement sur GitHub Pages** :
   ```bash
   npm run deploy
   # → Exécute automatiquement "predeploy" (npm run build)
   # → Pousse le contenu de /dist sur la branche gh-pages
   # → GitHub Pages sert automatiquement cette branche
   ```

---

## Installation

### Prérequis

- Node.js (version 18+)
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
   npm run dev
   ```
   → Ouvre http://localhost:5173

4. **Builder pour la production** :
   ```bash
   npm run build
   ```

5. **Déployer sur GitHub Pages** :
   ```bash
   npm run deploy
   ```

---

## Utilisation

### Mode utilisateur

1. **Ajouter une commande** :
   - Entrez votre nom
   - Choisissez la taille de frites (optionnel)
   - Sélectionnez vos sauces (checkboxes)
   - Ajoutez des snacks avec les boutons +/-
   - Cliquez sur "Ajouter la commande"

2. **Voir les commandes** :
   - Liste affichée en temps réel à droite
   - Chaque commande montre : nom, détails, prix total
   - Total général en bas

3. **Actions** :
   - "Copier la commande" : copie le résumé pour l'envoyer
   - "Appeler" : appel direct à la friterie
   - "Voir l'itinéraire" : ouvre Google Maps
   - "Page Facebook" : accès au menu photo

### Mode administrateur

1. **Accès** :
   - Cliquez sur le logo AIDE en haut
   - Entrez le mot de passe : `AIDE2025`

2. **Fonctions admin** :
   - Supprimer des commandes individuelles (bouton X)
   - Effacer toutes les commandes
   - Modifier les noms et prix des produits

---

## Fonctionnalités

### Synchronisation en temps réel
- Tous les utilisateurs voient les mêmes données instantanément
- Ajouts et suppressions synchronisés sans conflit
- Fonctionne sur plusieurs appareils simultanément

### Gestion robuste des commandes (v2.0)
- Pas de perte de données avec connexions simultanées
- Chaque commande a une clé Firebase unique
- Opérations atomiques (push/remove)

### Interface admin protégée
- Modification des prix en temps réel
- Suppression sélective ou totale des commandes
- Mot de passe requis

### Génération de résumé
- Résumé groupé par produit
- Détails par personne
- Calcul du total général
- Copie en un clic

### Responsive Design
- Layout adaptatif (CSS Grid)
- Deux colonnes sur desktop
- Empilement sur mobile
- Interface tactile optimisée

---

## Historique des versions

### v2.0.0 (Janvier 2025)
- Migration de Create React App vers Vite
- Correction du bug critique de race condition
- Utilisation de push()/remove() au lieu de set()
- Build plus rapide, HMR instantané

### v1.x (Octobre 2024)
- Version initiale avec Create React App
- Fonctionnalités de base

---

## Contact

**Organisation** : AIDE
**Dépôt** : https://github.com/gestionactifs-aide/friterie-aide

---

**Dernière mise à jour** : Janvier 2025
