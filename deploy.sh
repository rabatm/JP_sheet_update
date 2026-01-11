#!/bin/bash

# ============================================
# Script de gestion multi-projets pour Calendrier TD
# ============================================

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Fichier .env introuvable!"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé. Veuillez le modifier avec vos IDs:"
        echo "   nano .env"
        exit 1
    fi
fi

# Charger les variables d'environnement
export $(cat .env | grep -v '^#' | xargs)

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Fonction pour afficher les fichiers du projet
show_files() {
    echo -e "${CYAN}📂 Fichiers du projet:${NC}"
    echo -e "${BLUE}Configuration:${NC}"
    echo "  - appsscript.json"
    echo -e "${BLUE}Code principal:${NC}"
    echo "  - Code.js"
    echo "  - menu.js"
    echo "  - trigger.js"
    echo -e "${BLUE}Gestion Calendrier:${NC}"
    echo "  - CM_TO_Calendar.js"
    echo "  - TD_To_calendar.js"
    echo "  - Calendar_utils.js"
    echo -e "${BLUE}Utilitaires:${NC}"
    echo "  - _constantes.js"
    echo "  - ft_util.js"
    echo "  - timeutil.js"
    echo "  - SEMESTRE_util.js"
    echo -e "${BLUE}CM Utils:${NC}"
    echo "  - CM_To_Calendar_util.js"
    echo "  - CM_To_Calendar_util2.js"
    echo -e "${BLUE}API & Checks:${NC}"
    echo "  - cmtoapi.js"
    echo "  - check.js"
    echo ""
}

# Fonction pour afficher la configuration
show_config() {
    echo -e "${YELLOW}⚙️  Configuration actuelle:${NC}"
    echo ""
    if [ ! -z "$SCRIPT_ID_1" ] && [ "$SCRIPT_ID_1" != "YOUR_SCRIPT_ID_HERE" ]; then
        echo -e "  ${GREEN}✓${NC} Projet 1: $NAME_1"
        echo -e "    ID: ${SCRIPT_ID_1:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet 1: Non configuré"
    fi
    
    if [ ! -z "$SCRIPT_ID_2" ] && [ "$SCRIPT_ID_2" != "YOUR_SCRIPT_ID_HERE" ]; then
        echo -e "  ${GREEN}✓${NC} Projet 2: $NAME_2"
        echo -e "    ID: ${SCRIPT_ID_2:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet 2: Non configuré"
    fi
    
    if [ ! -z "$SCRIPT_ID_3" ] && [ "$SCRIPT_ID_3" != "YOUR_SCRIPT_ID_HERE" ]; then
        echo -e "  ${GREEN}✓${NC} Projet 3: $NAME_3"
        echo -e "    ID: ${SCRIPT_ID_3:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet 3: Non configuré"
    fi
    echo ""
}

# Fonction pour afficher la configuration DEV
show_dev_config() {
    echo -e "${YELLOW}⚙️  Configuration DEV:${NC}"
    echo ""
    if [ ! -z "$SCRIPT_DEV_ID_1" ] && [ "$SCRIPT_DEV_ID_1" != "YOUR_SCRIPT_DEV_ID_1" ]; then
        echo -e "  ${GREEN}✓${NC} Projet DEV 1: $NAME_DEV_1"
        echo -e "    ID: ${SCRIPT_DEV_ID_1:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet DEV 1: Non configuré"
    fi
    
    if [ ! -z "$SCRIPT_DEV_ID_2" ] && [ "$SCRIPT_DEV_ID_2" != "YOUR_SCRIPT_DEV_ID_2" ]; then
        echo -e "  ${GREEN}✓${NC} Projet DEV 2: $NAME_DEV_2"
        echo -e "    ID: ${SCRIPT_DEV_ID_2:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet DEV 2: Non configuré"
    fi
    
    if [ ! -z "$SCRIPT_DEV_ID_3" ] && [ "$SCRIPT_DEV_ID_3" != "YOUR_SCRIPT_DEV_ID_3" ]; then
        echo -e "  ${GREEN}✓${NC} Projet DEV 3: $NAME_DEV_3"
        echo -e "    ID: ${SCRIPT_DEV_ID_3:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet DEV 3: Non configuré"
    fi
    echo ""
}

# Fonction de déploiement
deploy_to_project() {
    local name=$1
    local script_id=$2
    
    if [[ "$script_id" == *"YOUR_SCRIPT"* ]] || [ -z "$script_id" ]; then
        echo -e "${RED}❌ Script ID non configuré pour $name${NC}"
        echo -e "${YELLOW}   Éditez .env pour ajouter l'ID${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📦 Déploiement vers $name...${NC}"
    
    mkdir -p temp_deploy
    cp -r src/* temp_deploy/
    echo "{\"scriptId\":\"$script_id\",\"rootDir\":\".\"}" > temp_deploy/.clasp.json
    
    cd temp_deploy
    if clasp push --force; then
        echo -e "${GREEN}✅ $name déployé avec succès!${NC}"
        cd ..
        rm -rf temp_deploy
        return 0
    else
        echo -e "${RED}❌ Erreur lors du déploiement${NC}"
        cd ..
        rm -rf temp_deploy
        return 1
    fi
}

# Fonction de récupération
pull_from_project() {
    local name=$1
    local script_id=$2
    
    if [[ "$script_id" == *"YOUR_SCRIPT"* ]] || [ -z "$script_id" ]; then
        echo -e "${RED}❌ Script ID non configuré pour $name${NC}"
        return 1
    fi
    
    echo -e "${BLUE}⬇️  Récupération depuis $name...${NC}"
    
    # Backup si nécessaire
    if [ -d "src" ] && [ "$(ls -A src/)" ]; then
        echo -e "${YELLOW}📁 Sauvegarde dans src_backup...${NC}"
        rm -rf src_backup
        cp -r src src_backup
    fi
    
    mkdir -p src temp_pull
    cd temp_pull
    
    echo "{\"scriptId\":\"$script_id\",\"rootDir\":\".\"}" > .clasp.json
    
    if clasp pull; then
        cp *.js ../src/ 2>/dev/null
        cp *.json ../src/
        echo -e "${GREEN}✅ Code récupéré dans src/${NC}"
        cd ..
        rm -rf temp_pull
        return 0
    else
        echo -e "${RED}❌ Erreur lors de la récupération${NC}"
        cd ..
        rm -rf temp_pull
        return 1
    fi
}

# Menu principal
clear
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     📅 Gestion Calendrier TD - Clasp       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

show_config
show_dev_config

echo -e "${GREEN}═══ Déploiement ═══${NC}"
echo "  1) 🚀 Déployer vers TOUS les projets configurés"
echo "  2) 📤 Déployer vers $NAME_1"
echo "  3) 📤 Déployer vers $NAME_2"
echo "  4) 📤 Déployer vers $NAME_3"
echo ""
echo -e "${YELLOW}═══ Déploiement DEV ═══${NC}"
echo "  d) 🚀 Déployer vers TOUS les projets DEV"
echo "  d1) 📤 Déployer vers $NAME_DEV_1"
echo "  d2) 📤 Déployer vers $NAME_DEV_2"
echo "  d3) 📤 Déployer vers $NAME_DEV_3"
echo ""
echo -e "${BLUE}═══ Récupération ═══${NC}"
echo "  5) 📥 Récupérer depuis $NAME_1"
echo "  6) 📥 Récupérer depuis $NAME_2"
echo "  7) 📥 Récupérer depuis $NAME_3"
echo ""
echo -e "${YELLOW}═══ Outils ═══${NC}"
echo "  f) 📁 Voir les fichiers du projet"
echo "  l) 📜 Voir les logs du dernier déploiement"
echo "  o) 🌐 Ouvrir un projet dans le navigateur"
echo "  e) ✏️  Éditer la configuration (.env)"
echo "  b) 💾 Créer un backup complet"
echo ""
echo "  0) ❌ Quitter"
echo ""
read -p "👉 Votre choix: " choice

case $choice in
    1)
        echo -e "\n${YELLOW}⚠️  Déploiement vers tous les projets configurés${NC}"
        read -p "Confirmer? (o/n): " confirm
        if [ "$confirm" = "o" ]; then
            count=0
            [ "$SCRIPT_ID_1" != "YOUR_SCRIPT_ID_HERE" ] && [ ! -z "$SCRIPT_ID_1" ] && [ "$SCRIPT_ID_1" != "VOTRE_ID_SCRIPT_1" ] && deploy_to_project "$NAME_1" "$SCRIPT_ID_1" && ((count++))
            [ "$SCRIPT_ID_2" != "YOUR_SCRIPT_ID_HERE" ] && [ ! -z "$SCRIPT_ID_2" ] && [ "$SCRIPT_ID_2" != "VOTRE_ID_SCRIPT_2" ] && deploy_to_project "$NAME_2" "$SCRIPT_ID_2" && ((count++))
            [ "$SCRIPT_ID_3" != "YOUR_SCRIPT_ID_HERE" ] && [ ! -z "$SCRIPT_ID_3" ] && [ "$SCRIPT_ID_3" != "VOTRE_ID_SCRIPT_3" ] && deploy_to_project "$NAME_3" "$SCRIPT_ID_3" && ((count++))
            echo -e "\n${GREEN}🎉 $count projet(s) déployé(s) avec succès!${NC}"
        fi
        ;;
    2) deploy_to_project "$NAME_1" "$SCRIPT_ID_1" ;;
    3) deploy_to_project "$NAME_2" "$SCRIPT_ID_2" ;;
    4) deploy_to_project "$NAME_3" "$SCRIPT_ID_3" ;;
    d|D)
        echo -e "\n${YELLOW}⚠️  Déploiement vers tous les projets DEV configurés${NC}"
        read -p "Confirmer? (o/n): " confirm
        if [ "$confirm" = "o" ]; then
            count=0
            for i in 1 2 3; do
                script_id_var="SCRIPT_DEV_ID_$i"
                name_var="NAME_DEV_$i"
                script_id="${!script_id_var}"
                name="${!name_var}"
                
                if [ ! -z "$script_id" ] && [ "$script_id" != "YOUR_SCRIPT_DEV_ID_$i" ]; then
                    if deploy_to_project "$name" "$script_id"; then
                        ((count++))
                    fi
                fi
            done
            echo -e "\n${GREEN}🎉 $count projet(s) DEV déployé(s) avec succès!${NC}"
        fi
        ;;
    d1) deploy_to_project "$NAME_DEV_1" "$SCRIPT_DEV_ID_1" ;;
    d2) deploy_to_project "$NAME_DEV_2" "$SCRIPT_DEV_ID_2" ;;
    d3) deploy_to_project "$NAME_DEV_3" "$SCRIPT_DEV_ID_3" ;;
    5) pull_from_project "$NAME_1" "$SCRIPT_ID_1" ;;
    6) pull_from_project "$NAME_2" "$SCRIPT_ID_2" ;;
    7) pull_from_project "$NAME_3" "$SCRIPT_ID_3" ;;
    f|F)
        show_files
        read -p "Appuyez sur Entrée pour continuer..."
        ;;
    l|L)
        echo -e "${CYAN}📜 Logs récents:${NC}"
        if [ -f "deploy.log" ]; then
            tail -20 deploy.log
        else
            echo "Aucun log disponible"
        fi
        read -p "Appuyez sur Entrée pour continuer..."
        ;;
    o|O)
        echo "Quel projet ouvrir?"
        echo "1) $NAME_1"
        echo "2) $NAME_2"  
        echo "3) $NAME_3"
        read -p "Choix: " open_choice
        case $open_choice in
            1) xdg-open "https://script.google.com/d/$SCRIPT_ID_1/edit" 2>/dev/null || open "https://script.google.com/d/$SCRIPT_ID_1/edit" ;;
            2) xdg-open "https://script.google.com/d/$SCRIPT_ID_2/edit" 2>/dev/null || open "https://script.google.com/d/$SCRIPT_ID_2/edit" ;;
            3) xdg-open "https://script.google.com/d/$SCRIPT_ID_3/edit" 2>/dev/null || open "https://script.google.com/d/$SCRIPT_ID_3/edit" ;;
        esac
        ;;
    e|E)
        ${EDITOR:-nano} .env
        echo -e "${GREEN}✅ Configuration mise à jour${NC}"
        ;;
    b|B)
        backup_name="backup_$(date +%Y%m%d_%H%M%S)"
        mkdir -p backups/$backup_name
        cp -r src/* backups/$backup_name/
        cp .env backups/$backup_name/
        echo -e "${GREEN}✅ Backup créé: backups/$backup_name${NC}"
        ;;
    0)
        echo -e "${GREEN}👋 Au revoir!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Option invalide${NC}"
        ;;
esac

echo ""
read -p "Retourner au menu? (o/n): " continue_choice
[ "$continue_choice" = "o" ] && exec "$0"
