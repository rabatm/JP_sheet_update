const makeRdvDate = (heuredeb, minuteFin, numDayRdv) => {
  const semDate = getDateCurrentSemestre().dateDebut;
  const formatedDate = new Date(
    semDate.getMonth() +
      1 +
      "/" +
      (semDate.getDate() + numDayRdv) +
      "/" +
      semDate.getFullYear() +
      "-" +
      heuredeb +
      ":" +
      minuteFin +
      ":00"
  );
  return formatedDate;
};

const verifierDatesValides = (dateSem, numDayRdv, hDebut, hFin) => {
  // Fonction pour ajuster la date en fonction des jours à ajouter
  const ajusterDate = (date, jours) => {
    const nouvelleDate = new Date(date);
    nouvelleDate.setDate(date.getDate() + jours);
    return nouvelleDate;
  };

  // Récupérer le jour de la semaine de dateSem[0] (0 = Dimanche, 1 = Lundi, etc.)
  const jourSem = dateSem[0].getDay();

  // Calculer le nombre de jours à ajouter pour atteindre numDayRdv
  let joursAAjouter = numDayRdv - jourSem;

  // Si joursAAjouter est négatif, cela signifie qu'on doit aller à la semaine suivante
  if (joursAAjouter < 0) {
    joursAAjouter += 7; // Ajouter 7 pour passer à la semaine suivante
  }

  // Calculer rdvDeb et rdvFin en fonction de joursAAjouter
  const rdvDeb = ajusterDate(dateSem[0], joursAAjouter);
  const rdvFin = new Date(rdvDeb); // Copier rdvDeb pour rdvFin

  // Ajuster les heures et les minutes
  const [heuresDebut, minutesDebut] = hDebut.split(":").map(Number);
  const [heuresFin, minutesFin] = hFin.split(":").map(Number);
  rdvDeb.setHours(heuresDebut, minutesDebut);
  rdvFin.setHours(heuresFin, minutesFin);

  // Vérification de la validité des dates
  const estDateValide = (date) => !isNaN(date.getTime());

  return {
    rdvDeb,
    rdvFin,
    valide: estDateValide(rdvDeb) && estDateValide(rdvFin),
  };
};

const ajouterDateSemestre = (dateSem, dateDebutSemestre) => {
  const dateSemestre = new Date(dateDebutSemestre); // Récupérer la date

  // Vérifier si la date est inférieure à aujourd'hui
  if (dateSemestre < new Date()) {
    dateSem.push(new Date()); // Ajouter la date d'aujourd'hui si inférieure
  } else {
    dateSem.push(dateSemestre); // Sinon, ajouter la date du semestre
  }
};

const mettreAJourRendezVous = (rdvDeb, rdvFin, numDayRdv) => {
  // Sauvegarder les heures originales
  const heuresDebut = rdvDeb.getHours();
  const minutesDebut = rdvDeb.getMinutes();
  const heuresFin = rdvFin.getHours();
  const minutesFin = rdvFin.getMinutes();

  let calculDuJour = rdvDeb.getDay();
  let aAjouterALaDateDuRdv = 1; // Commencer à 0, pas 1

  while (calculDuJour !== numDayRdv) {
    aAjouterALaDateDuRdv++;
    calculDuJour = (calculDuJour + 1) % 7;
  }

  // Si on est déjà le bon jour, ne rien ajouter
  if (aAjouterALaDateDuRdv > 0) {
    rdvDeb.setDate(rdvDeb.getDate() + aAjouterALaDateDuRdv);
    rdvFin.setDate(rdvFin.getDate() + aAjouterALaDateDuRdv);
  }

  // Réappliquer les heures originales pour éviter les problèmes DST
  rdvDeb.setHours(heuresDebut, minutesDebut, 0, 0);
  rdvFin.setHours(heuresFin, minutesFin, 0, 0);

  return {
    rdvDeb,
    rdvFin,
    aAjouterALaDateDuRdv,
  };
};

const writeStatusWithTimestamp = (
  sheet,
  row,
  column,
  status,
  event = null,
  timeZone = "Europe/Paris"
) => {
  const statusConfig = {
    "✅": {
      color: "#ffffff",
      background: "#2d6a4f",
    },
    "🆕": {
      color: "#ffffff",
      background: "#c85000",
    },
  };

  if (!Object.keys(statusConfig).includes(status)) {
    throw new Error(
      `Le statut doit être l'un des suivants: ${Object.keys(statusConfig).join(
        ", "
      )}`
    );
  }

  const now = new Date();
  const formattedDate = Utilities.formatDate(now, timeZone, "dd-MM-yy HH'h'");
  const message = `${status} ${formattedDate}`;

  const cell = sheet.getRange(row, column);
  cell
    .setValue(message)
    .setBackground(statusConfig[status].background)
    .setFontColor(statusConfig[status].color)
    .setFontWeight("bold");

  if (event) {
    try {
      const calendarId = event.getOriginalCalendarId();
      const splitEventId = event.getId().split("@");
      const eventURL =
        "https://www.google.com/calendar/event?eid=" +
        Utilities.base64Encode(splitEventId[0] + " " + calendarId);
      const linkCell = sheet.getRange(row, 10);
      linkCell
        .setValue("🔗 Calendrier")
        .setFontColor("#1155cc")
        .setFormula(`=HYPERLINK("${eventURL}"; "🔗 Calendrier")`);
    } catch (error) {
      console.error("Impossible de créer le lien vers l'événement:", error);
    }
  }
};
