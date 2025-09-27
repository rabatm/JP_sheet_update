let createTriggerUpdater = (fonctionAExecuter) =>
{
  
  ScriptApp.newTrigger(fonctionAExecuter)
    .timeBased()
    .after(60*1000)
    .create()
}
let deleteAllTriggers = (fonctionASupprimer) => {
  let triggersDuProjet = ScriptApp.getProjectTriggers()

  triggersDuProjet.map((trigger) =>{
      if (trigger.getHandlerFunction()===fonctionASupprimer) {
        ScriptApp.deleteTrigger(trigger);
        Utilities.sleep(1000);
      }
    })
}