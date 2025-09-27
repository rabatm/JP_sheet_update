const verifyAllEntriesHaveAppointments = () => {
  let nextStartCheck = parseInt(
    PropertiesService.getScriptProperties().getProperty("nextStartCheck")
  );
  if (!nextStartCheck) {
    nextStartCheck = 267;
  }

  const responses = sheetRep.getRange("A2:AE").getValues();
  let nb_exec_max = 30;
  let processed = 0; // Réinitialiser processed
  let missingAppointments = [];
  console.log(responses.length);
  console.log(nextStartCheck, "next");

  console.log(
    `Starting loop with nextStartCheck = ${nextStartCheck} and responses.length = ${responses.length}`
  );
  console.log(`nb_exec_max = ${nb_exec_max}`);

  for (let i = nextStartCheck; i < responses.length; i++) {
    try {
      console.log(`Processing index ${i}`);
      const appointmentExists = checkAppointmentExists(responses[i]);
      if (appointmentExists) {
        sheetRep.getRange(i + 2, 9).setValue("OK");
      } else {
        missingAppointments.push({
          ligne: i + 2,
          groupe: responses[i][4],
          user: responses[i][2],
          details: responses[i].slice(9).join(", "),
        });
      }
      processed++;
      console.log(`Processed index ${i}`);
      console.log(
        `processed = ${processed}, nb_exec_max = ${nb_exec_max}, (i + 1) = ${
          i + 1
        }, responses.length = ${responses.length}`
      );

      // Si on atteint la limite de traitement ou la fin du tableau, on sort de la boucle
      if (processed >= nb_exec_max || i + 1 >= responses.length) {
        console.log(`Breaking loop at index ${i}`);
        nextStartCheck = i + 1; // Mettre à jour nextStartCheck pour la prochaine exécution
        PropertiesService.getScriptProperties().setProperty(
          "nextStartCheck",
          nextStartCheck
        ); // Sauvegarder nextStartCheck
        break;
      }
    } catch (e) {
      console.error("ERREUR :" + e);
      MailApp.sendEmail({
        name: "Juris'Perform",
        to: "martin.rabat@gmail.com",
        subject: "ERREUR VERIFICATION RDV",
        htmlBody: "ERREUR :" + e,
      });
    }
  }

  let lignesRestantes = false;
  // Vérification si toutes les lignes ont été traitées
  if (nextStartCheck < responses.length) {
    lignesRestantes = true; // Il reste des lignes à traiter
    PropertiesService.getScriptProperties().setProperty(
      "nextStartCheck",
      nextStartCheck
    );
  }

  // Si des lignes restent à traiter, on crée un déclencheur pour relancer la fonction
  if (lignesRestantes) {
    createTriggerForCheck();
  } else {
    deleteAllTriggers("verifyAllEntriesHaveAppointments"); // Supprime les déclencheurs une fois terminé
    PropertiesService.getScriptProperties().setProperty("nextStartCheck", 0);
  }

  // Envoyer un email avec les rendez-vous manquants
  if (missingAppointments.length > 0) {
    let emailBody = "Les rendez-vous suivants sont manquants :<br><ul>";
    missingAppointments.forEach((appointment) => {
      emailBody += `<li>Ligne ${appointment.ligne} : Groupe ${appointment.groupe}, Utilisateur ${appointment.user}, Détails ${appointment.details}</li>`;
    });
    emailBody += "</ul>";
    MailApp.sendEmail({
      name: "Juris'Perform",
      to: "martin.rabat@gmail.com",
      subject: "Rendez-vous manquants",
      htmlBody: emailBody,
    });
  }
};

// Fonction pour créer un déclencheur pour relancer la fonction dans 1 minute
const createTriggerForCheck = () => {
  ScriptApp.newTrigger("verifyAllEntriesHaveAppointments")
    .timeBased()
    .after(1 * 60 * 1000) // Relancer après 1 minute
    .create();
};

const checkAppointmentExists = (newDeclare) => {
  let dateSem = [];
  const aujourdHui = new Date();
  const currentSemestre = getCurrentSemestre();
  if (currentSemestre == "S1") {
    ajouterDateSemestre(dateSem, getSemestreDateDebut()[0]);
    dateSem.push(new Date(getSemestreDateFin()[0]));
  } else {
    ajouterDateSemestre(dateSem, getSemestreDateDebut()[1]);
    dateSem.push(new Date(getSemestreDateFin()[1]));
  }
  const groupe = newDeclare[4];
  const user = newDeclare[2];
  for (let i = 9; i < newDeclare.length; i++) {
    let flag = false;
    const cutTD = newDeclare[i].split("_");
    if (cutTD != "") {
      const tdNAme = cutTD[0];
      const hDebut = cutTD[2];
      const hFin = cutTD[3];
      const jour = cutTD[1];
      const numDayRdv = getNbDay(jour);
      const dayEN = getENDay(jour.toLowerCase());
      const titre = tdNAme + " " + groupe;
      const { rdvDeb, rdvFin, valide } = verifierDatesValides(
        dateSem,
        numDayRdv,
        hDebut,
        hFin
      );
      if (!valide) return false;
      const calendarName = groupe + " - TD";
      const events = CalendarApp.getCalendarsByName(calendarName)[0].getEvents(
        rdvDeb,
        rdvFin
      );
      for (let event of events) {
        if (
          event.getTitle() === titre &&
          event.getStartTime().getHours() === rdvDeb.getHours() &&
          event.getEndTime().getHours() === rdvFin.getHours() &&
          event.getStartTime().getMinutes() === rdvDeb.getMinutes() &&
          event.getEndTime().getMinutes() === rdvFin.getMinutes()
        ) {
          let description = event.getDescription();
          if (description.includes(user)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};
