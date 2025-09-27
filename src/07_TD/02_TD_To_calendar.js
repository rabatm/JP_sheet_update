const updateAllNewResponse = () => {
  const responses = sheetRep.getRange("A2:AE").getValues();
  const processed = getResponse(responses);

  // Vérification si toutes les lignes ont été traitées
  let encoreDesLignesATraiter = false;
  for (let i = 0; i < responses.length; i++) {
    if (responses[i][8] != "OK" && responses[i][8] != "ERREUR") {
      encoreDesLignesATraiter = true;
      break;
    }
    // Si des lignes restent à traiter, on crée un déclencheur pour relancer la fonction
    if (encoreDesLignesATraiter) {
      createTrigger("updateAllNewResponse", 1 * 60 * 1000); // Relancer après 1 minute
    } else {
      deleteAllTriggers("updateAllNewResponse"); // Supprime les déclencheurs une fois terminé
    }
  }
};
