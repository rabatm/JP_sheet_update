# 📅 Jurisperform - gestion des Google sheet de chaque villes - Apps Script

Systeme de 

## 📁 Structure des fichiers

- **Code principal**
  - `Code.js` - Point d'entrée principal
  - `menu.js` - Menu personnalisé dans Google Sheets
  - `trigger.js` - Gestion des déclencheurs automatiques

- **Gestion Calendrier**
  - `CM_TO_Calendar.js` - Synchronisation des CM vers calendrier
  - `TD_To_calendar.js` - Synchronisation des TD vers calendrier
  - `Calendar_utils.js` - Fonctions utilitaires pour les calendriers

- **Utilitaires**
  - `_constantes.js` - Constantes du projet
  - `ft_util.js` - Fonctions utilitaires générales
  - `timeutil.js` - Gestion des dates et heures
  - `SEMESTRE_util.js` - Gestion des semestres

- **API & Vérifications**
  - `cmtoapi.js` - Interface API
  - `check.js` - Vérifications et validations

## 🚀 Installation

1. Cloner le projet
2. Copier `.env.example` vers `.env`
3. Ajouter vos IDs de scripts dans `.env`
4. Lancer `./deploy.sh`

## 📝 Utilisation
```bash
# Déployer vers tous les projets
./deploy.sh → Option 1

# Récupérer le code d'un projet
./deploy.sh → Option 5, 6 ou 7

# Créer un backup
./deploy.sh → Option b
```
