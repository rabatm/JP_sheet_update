const getResponse = (responses) => {
  let nb_exec_max = 30; // Nombre maximum d'exécutions par exécution
  let processed = 0;
  let lignesRestantes = false; // Variable pour indiquer s'il reste des lignes à traiter
  // Parcourir les réponses en ne dépassant pas la limite de nb_exec_max
  for (let i = 0; i < responses.length && processed < nb_exec_max; i++) {
    if (responses[i][8] != "OK") {
      try {
        // Mettre à jour le calendrier avec les réponses
        updateCalendrierTD(responses[i]);
        // Marquer la réponse comme "OK"
        sheetRep.getRange(i + 2, 9).setValue("OK");
        processed++; // Incrémenter seulement si une ligne est traitée
        // Si on atteint la limite de traitement ou la fin du tableau, on sort de la boucle
        if (processed >= nb_exec_max || i + 1 >= responses.length) {
          break;
        }
      } catch (e) {
        console.error("ERREUR :" + e);
        MailApp.sendEmail({
          name: "Juris'Perform ERROR",
          to: "martin.rabat@gmail.com",
          subject: "ERREUR MAJ ALLRESPONSE",
          htmlBody: "ERREUR :" + e,
        });
      }
    }
  }
  return processed;
};
