# 🦄 Sheet Ville Étudiant GAS

Projet Google Apps Script pour automatiser l’insertion d’événements depuis un Google Sheet vers Google Calendar, avec gestion multi-projets et connexion à une API externe pour diverses mises à jour.

---

## 🧩 Fonctionnalités

- **Insertion automatique d’événements** (TD/CM) depuis un Google Sheet vers Google Calendar
- **Connexion à une API externe** pour synchronisation et mises à jour complémentaires
- **Gestion multi-projets Apps Script** (déploiement sur plusieurs calendriers)
- **Organisation modulaire du code** (calendrier, API, utilitaires, triggers…)
- **Gestion sécurisée des secrets et de la configuration**
- **Script de déploiement automatisé** (`deploy.sh`)
- **Support des propriétés de script** pour stocker les secrets sensibles côté serveur

---

## 🗃️ Structure du projet

```
src/
  00_utils.js                # Fonctions utilitaires globales
  01_config/
    _constantes.js           # Constantes et accès PropertiesService
    secrets.js               # Secrets locaux (non versionné sur Git)
  02_calendar/
    CM_TO_Calendar.js        # Insertion CM → Calendar
    TD_To_Calendar.js        # Insertion TD → Calendar
    Calendar_utils.js        # Fonctions utilitaires Calendar
    CM_To_Calendar_util.js   # Fonctions CM spécifiques
    CM_To_Calendar_util2.js  # Fonctions CM complémentaires
  03_api/
    cmtoapi.js               # Connexion et synchronisation avec l’API externe
  04_utils/
    ft_util.js
    timeutil.js
    SEMESTRE_util.js
    check.js
  05_triggers/
    trigger.js               # Gestion des triggers Apps Script
  06_responses/
    REPONSES.js              # Gestion des réponses (si besoin)
  Code.js                    # Point d’entrée principal (menu, triggers)
  appsscript.json            # Configuration Apps Script (timezone, etc.)
deploy.sh                    # Script de gestion multi-projets
.env                         # Configuration des IDs et noms de projets (non versionné)
.env.example                 # Exemple de configuration
```

---

## 🛠️ Configuration

1. **Copie `.env.example` en `.env`**  
   Renseigne tes IDs de scripts Apps Script et les noms de projets.

2. **Gestion des secrets**
   - Mets tes secrets dans `src/01_config/secrets.js` (non versionné sur Git)
   - Ou utilise `PropertiesService` dans Apps Script pour plus de sécurité

3. **Personnalise le fuseau horaire dans `src/appsscript.json`**  
   Exemple : `"timeZone": "Europe/Paris"`

---

## 🚚 Déploiement

Utilise le script `deploy.sh` pour :
- Déployer le code sur tous les projets configurés
- Récupérer le code depuis un projet
- Voir les fichiers, logs, ouvrir dans le navigateur, éditer la config, backup…

```bash
./deploy.sh
```

---

## 🛡️ Bonnes pratiques

- **Ne versionne jamais tes secrets sur Git** (`.gitignore`)
- **Utilise des préfixes numériques** pour contrôler l’ordre de chargement des fichiers
- **Centralise la configuration** dans `01_config/`
- **Documente tes fonctions et modules**

---

## 📧 Notifications

Configure l’email de notification d’erreur dans `.env` :

```
ERROR_EMAIL=ton.email@exemple.com
```

---

## 🧑‍🚀 Auteur

Martin Rabat
Contact : martin.rabat@gmail.com

---

## 🕹️ Pour commencer

1. Clone le repo
2. Configure `.env`
3. Installe `clasp` si besoin (`npm install -g @google/clasp`)
4. Lance `./deploy.sh`