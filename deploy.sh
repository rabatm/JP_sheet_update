#!/bin/bash

# ============================================ 
# Script de gestion multi-projets pour Calendrier TD
# ============================================ 

# --- Chargement et validation de l'environnement ---

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Fichier .env introuvable!"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé. Veuillez le configurer avant de continuer."
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

# Valider le mode. Défaut sur DEV si non spécifié.
if [ -z "$MODE" ]; then
    echo -e "${YELLOW}⚠️ La variable MODE n'est pas définie dans .env. Passage en mode DEV par défaut.${NC}"
    MODE="DEV"
fi

# --- Logique de sélection de l'environnement ---

if [ "$MODE" = "PROD" ]; then
    # Mapper les variables de Production
    CURRENT_NAME_1=$NAME_1
    CURRENT_NAME_2=$NAME_2
    CURRENT_NAME_3=$NAME_3
    CURRENT_SCRIPT_ID_1=$SCRIPT_ID_1
    CURRENT_SCRIPT_ID_2=$SCRIPT_ID_2
    CURRENT_SCRIPT_ID_3=$SCRIPT_ID_3
    
elif [ "$MODE" = "DEV" ]; then
    # Mapper les variables de Développement
    CURRENT_NAME_1=$NAME_DEV_1
    CURRENT_NAME_2=$NAME_DEV_2
    CURRENT_NAME_3=$NAME_DEV_3
    CURRENT_SCRIPT_ID_1=$SCRIPT_DEV_ID_1
    CURRENT_SCRIPT_ID_2=$SCRIPT_DEV_ID_2
    CURRENT_SCRIPT_ID_3=$SCRIPT_DEV_ID_3
else
    echo -e "${RED}❌ Mode '$MODE' invalide dans le fichier .env. Utilisez 'PROD' ou 'DEV'.${NC}"
    exit 1
fi


# --- Fonctions utilitaires ---

# Fonction pour afficher la configuration
show_config() {
    echo -e "${YELLOW}⚙️  Configuration actuelle ($MODE):${NC}"
    echo ""
    if [ ! -z "$CURRENT_SCRIPT_ID_1" ] && [[ "$CURRENT_SCRIPT_ID_1" != *"YOUR_SCRIPT"* ]]; then
        echo -e "  ${GREEN}✓${NC} Projet 1: $CURRENT_NAME_1"
        echo -e "    ID: ${CURRENT_SCRIPT_ID_1:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet 1: Non configuré"
    fi
    
    if [ ! -z "$CURRENT_SCRIPT_ID_2" ] && [[ "$CURRENT_SCRIPT_ID_2" != *"YOUR_SCRIPT"* ]]; then
        echo -e "  ${GREEN}✓${NC} Projet 2: $CURRENT_NAME_2"
        echo -e "    ID: ${CURRENT_SCRIPT_ID_2:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet 2: Non configuré"
    fi
    
    if [ ! -z "$CURRENT_SCRIPT_ID_3" ] && [[ "$CURRENT_SCRIPT_ID_3" != *"YOUR_SCRIPT"* ]]; then
        echo -e "  ${GREEN}✓${NC} Projet 3: $CURRENT_NAME_3"
        echo -e "    ID: ${CURRENT_SCRIPT_ID_3:0:20}..."
    else
        echo -e "  ${RED}✗${NC} Projet 3: Non configuré"
    fi
    echo ""
}

# Fonction de déploiement
deploy_to_project() {
    local name=$1
    local script_id=$2
    
    if [[ "$script_id" == *"YOUR_SCRIPT"* ]] || [ -z "$script_id" ]; then
        echo -e "${RED}❌ Script ID non configuré pour $name${NC}"
        echo -e "${YELLOW}   Veuillez configurer l'ID dans .env avant de déployer.${NC}"
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
        echo -e "${RED}❌ Erreur lors du déploiement de $name${NC}"
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
    
    if [ -d "src" ] && [ "$(ls -A src/)" ]; then
        echo -e "${YELLOW}📁 Sauvegarde de 'src' dans 'src_backup'...${NC}"
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
    else
        echo -e "${RED}❌ Erreur lors de la récupération${NC}"
    fi
    cd ..
    rm -rf temp_pull
}


# --- Menu principal ---
clear
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     📅 Gestion Calendrier TD - Clasp       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Affichage du bandeau de mode
if [ "$MODE" = "PROD" ]; then
    echo -e "${RED}==================================================="
    echo -e "${RED}     ATTENTION : VOUS ÊTES EN MODE PRODUCTION      "
    echo -e "==================================================="
    echo ""
elif [ "$MODE" = "DEV" ]; then
    echo -e "${BLUE}==================================================="
    echo -e "${BLUE}          Vous êtes en mode Développement          "
    echo -e "==================================================="
    echo ""
fi

show_config

# --- Affichage du menu et gestion des choix ---

echo -e "${GREEN}═══ Déploiement ($MODE) ═══${NC}"
echo "  1) 🚀 Déployer vers TOUS les projets"
echo "  2) 📤 Déployer vers $CURRENT_NAME_1"
echo "  3) 📤 Déployer vers $CURRENT_NAME_2"
echo "  4) 📤 Déployer vers $CURRENT_NAME_3"
echo ""
echo -e "${BLUE}═══ Récupération ($MODE) ═══${NC}"
echo "  5) 📥 Récupérer depuis $CURRENT_NAME_1"
echo "  6) 📥 Récupérer depuis $CURRENT_NAME_2"
echo "  7) 📥 Récupérer depuis $CURRENT_NAME_3"
echo ""
echo -e "${YELLOW}═══ Outils ═══${NC}"
echo "  e) ✏️  Éditer la configuration (.env)"
echo "  s) 🔄 Changer de mode (PROD/DEV)"
echo ""
echo "  0) ❌ Quitter"
echo ""
read -p "👉 Votre choix: " choice

case $choice in
    1)
        echo -e "\n${YELLOW}⚠️  Déploiement vers tous les projets en mode $MODE${NC}"
        read -p "Confirmer? (o/n): " confirm
        if [ "$confirm" = "o" ]; then
            count=0
            total=0
            
            [[ "$CURRENT_SCRIPT_ID_1" != *"YOUR_SCRIPT"* ]] && ((total++)) && deploy_to_project "$CURRENT_NAME_1" "$CURRENT_SCRIPT_ID_1" && ((count++))
            [[ "$CURRENT_SCRIPT_ID_2" != *"YOUR_SCRIPT"* ]] && ((total++)) && deploy_to_project "$CURRENT_NAME_2" "$CURRENT_SCRIPT_ID_2" && ((count++))
            [[ "$CURRENT_SCRIPT_ID_3" != *"YOUR_SCRIPT"* ]] && ((total++)) && deploy_to_project "$CURRENT_NAME_3" "$CURRENT_SCRIPT_ID_3" && ((count++))
            
            if [ $count -eq $total ] && [ $total -gt 0 ]; then
                echo -e "\n${GREEN}🎉 $count projet(s) déployé(s) avec succès!${NC}"
            elif [ $total -eq 0 ]; then
                 echo -e "\n${YELLOW}Aucun projet n'est configuré pour ce mode.${NC}"
            else
                echo -e "\n${RED}⚠️ $count sur $total projet(s) déployé(s). Des erreurs se sont produites.${NC}"
            fi
        fi
        ;;
    2) deploy_to_project "$CURRENT_NAME_1" "$CURRENT_SCRIPT_ID_1" ;; 
    3) deploy_to_project "$CURRENT_NAME_2" "$CURRENT_SCRIPT_ID_2" ;; 
    4) deploy_to_project "$CURRENT_NAME_3" "$CURRENT_SCRIPT_ID_3" ;; 
    5) pull_from_project "$CURRENT_NAME_1" "$CURRENT_SCRIPT_ID_1" ;; 
    6) pull_from_project "$CURRENT_NAME_2" "$CURRENT_SCRIPT_ID_2" ;; 
    7) pull_from_project "$CURRENT_NAME_3" "$CURRENT_SCRIPT_ID_3" ;; 
    e|E)
        ${EDITOR:-nano} .env
        echo -e "${GREEN}✅ Configuration .env modifiée. Veuillez relancer le script pour voir les changements.${NC}"
        ;; 
    s|S) 
        if [ "$MODE" = "PROD" ]; then
            sed -i.bak 's/MODE=PROD/MODE=DEV/' .env && rm .env.bak
            echo -e "${BLUE}🔄 Passage en mode DEV. Relancez le script.${NC}"
        else
            sed -i.bak 's/MODE=DEV/MODE=PROD/' .env && rm .env.bak
            echo -e "${RED}🔄 Passage en mode PROD. Relancez le script.${NC}"
        fi
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
read -p "Appuyez sur Entrée pour retourner au menu..."
exec "$0"