// Fonction pour créer un déclencheur pour relancer la fonction dans 1 minute
const createTrigger = (functionName, time) => {
  time = time || 1 * 60 * 1000; // Défaut à 1 minute si non spécifié
  ScriptApp.newTrigger(functionName).timeBased().after(time).create();
};

// Fonction pour supprimer tous les déclencheurs associés à une fonction spécifique
let deleteAllTriggers = (fonctionASupprimer) => {
  let triggersDuProjet = ScriptApp.getProjectTriggers();

  triggersDuProjet.map((trigger) => {
    if (trigger.getHandlerFunction() === fonctionASupprimer) {
      ScriptApp.deleteTrigger(trigger);
      Utilities.sleep(1000);
    }
  });
};
