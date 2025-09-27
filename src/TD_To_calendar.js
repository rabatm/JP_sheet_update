const updateAllNewResponse = () => {
  const responses = sheetRep.getRange("A2:AE").getValues();
  let nb_exec_max = 30; // Nombre maximum d'exécutions par exécution
  let processed = 0;
  let lignesRestantes = false; // Variable pour indiquer s'il reste des lignes à traiter
  // Parcourir les réponses en ne dépassant pas la limite de nb_exec_max
  for (let i = 0; i < responses.length && processed < nb_exec_max; i++) {
    if (responses[i][8] != 'OK') {
      try {
        // Mettre à jour le calendrier avec les réponses
        updateCalendrierFromTrigger(responses[i]);
        // Marquer la réponse comme "OK"
        sheetRep.getRange(i + 2, 9).setValue("OK");
        processed++; // Incrémenter seulement si une ligne est traitée
        // Si on atteint la limite de traitement ou la fin du tableau, on sort de la boucle
        if (processed >= nb_exec_max || (i + 1) >= responses.length) {
          break;
        }
      } catch (e) {
        console.error('ERREUR :' + e);
        MailApp.sendEmail({
          name: "Juris'Perform ERROR",
          to: "martin.rabat@gmail.com",
          subject: "ERREUR MAJ ALLRESPONSE",
          htmlBody: 'ERREUR :' + e
        });
      }
    }
  }

  // Vérification si toutes les lignes ont été traitées
  if (processed < responses.length) {
    lignesRestantes = true; // Il reste des lignes à traiter
  }

  // Si des lignes restent à traiter, on crée un déclencheur pour relancer la fonction
  if (lignesRestantes) {
    createTrigger();
  } else {
    deleteAllTriggers('updateAllNewResponse'); // Supprime les déclencheurs une fois terminé
  }
};

// Fonction pour créer un déclencheur pour relancer la fonction dans 1 minute
const createTrigger = () => {
  ScriptApp.newTrigger('updateAllNewResponse')
    .timeBased()
    .after(1 * 60 * 1000) // Relancer après 1 minute
    .create();
};

const updateCalendrierFromTrigger = (newDeclare) =>
{
  let dateSem =[];
  const aujourdHui = new Date();
  const currentSemestre = getCurrentSemestre()
  if (currentSemestre == 'S1' ) {
  ajouterDateSemestre(dateSem,getSemestreDateDebut()[0]);
  dateSem.push(new Date(getSemestreDateFin()[0]));
  }
  else
  {
  ajouterDateSemestre(dateSem,getSemestreDateDebut()[1]);
  dateSem.push(new Date(getSemestreDateFin()[1])); 
  }
  const groupe = newDeclare[4];
  const user = newDeclare[2];
  for(let i=9; i < newDeclare.length; i++)
    {
        flag = false;
        const cutTD = newDeclare[i].split('_');
        if (cutTD != '')
        {
          const tdNAme = cutTD[0];
          const hDebut = cutTD[2];
          const hFin = cutTD[3];
          const jour = cutTD[1];
          const numDayRdv=getNbDay(jour);
          const dayEN=getENDay(jour.toLowerCase());
          const titre=tdNAme + " " + groupe;
          const {rdvDeb, rdvFin, valide}= verifierDatesValides(dateSem, numDayRdv, hDebut, hFin);
          if (!valide)
            throw new Error("Les dates ne sont pas valides.");
          const calendarName=groupe + " - TD";
          const result = mettreAJourRendezVous(rdvDeb, rdvFin, numDayRdv);
          updateDescriptionEventSerie(titre,result.rdvDeb,result.rdvFin,user,calendarName,groupe,dayEN,dateSem[1])
        }
    }
}
const updateCalendrier = (tds,groupe,user) =>
{
  let dateSem =[]
  const currentSemestre = getCurrentSemestre()
  
  if (currentSemestre == 'S1' ) {
  dateSem.push(new Date(getSemestreDateDebut()[0]));
  dateSem.push(new Date(getSemestreDateFin()[0]));
  }
  else
  {
  dateSem.push(new Date(getSemestreDateDebut()[1]));
  dateSem.push(new Date(getSemestreDateFin()[1])); 
  }
  
  tds.map((td) => {
        let flag =false

        if (td)  {
          const reponse = td
          if (reponse.assiste)
          {
            const numDayRdv=getNbDay(reponse.jour);
            const dayEN=getENDay(reponse.jour.toLowerCase());
            const titre=reponse.td + " " + groupe;
            const rdvDeb = new Date( (dateSem[0].getMonth()+1) + "/" + (dateSem[0].getDate()+numDayRdv) + "/"+ dateSem[0].getFullYear() + "-" + reponse.hDebut);
            const rdvFin = new Date( (dateSem[0].getMonth()+1) + "/" + (dateSem[0].getDate()+numDayRdv) + "/"+ dateSem[0].getFullYear() + "-" + reponse.hFin);
            const calendarName=groupe + " - TD";

            let aAjouterALaDateDuRdv = 1
            let calculDuJour=rdvDeb.getDay()

            while (calculDuJour !== numDayRdv)
            { 
              aAjouterALaDateDuRdv++
              if (calculDuJour===6) calculDuJour=0
              else calculDuJour++
            }
            
            rdvDeb.setDate(rdvDeb.getDate() + aAjouterALaDateDuRdv)
            rdvFin.setDate(rdvFin.getDate() + aAjouterALaDateDuRdv)
            updateDescriptionEventSerie(titre,rdvDeb,rdvFin,user,calendarName,groupe,dayEN,dateSem[1])
          }
        }
        
      })
}

