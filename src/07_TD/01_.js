const updateCalendrierTD = (newDeclare) => {
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
    flag = false;
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
      if (!valide) throw new Error("Les dates ne sont pas valides.");
      const calendarName = groupe + " - TD";
      const result = mettreAJourRendezVous(rdvDeb, rdvFin, numDayRdv);
      updateDescriptionEventSerie(
        titre,
        result.rdvDeb,
        result.rdvFin,
        user,
        calendarName,
        groupe,
        dayEN,
        dateSem[1]
      );
    }
  }
};
