const getSemestreDateDebut = () => {
  //date début s1 dans colone C2, date début s2 dans colonne C5
  const infoSemestre = sheetPARAM.getRange("B1:B6").getValues();
  return [infoSemestre[1], infoSemestre[4]];
};

const getSemestreDateFin = () => {
  //date début s1 dans colone C2, date début s2 dans colonne C5
  const infoSemestre = sheetPARAM.getRange("B1:B6").getValues();
  return [infoSemestre[2], infoSemestre[5]];
};

function getDateCurrentSemestre() {
  let dateSem = { dateDebut: "", dateFin: "" };
  if (currentSemestre === "S1") {
    dateSem.dateDebut = new Date(getSemestreDateDebut()[0]);
    dateSem.dateFin = new Date(getSemestreDateFin()[0]);
  } else {
    dateSem.dateDebut = new Date(getSemestreDateDebut()[1]);
    dateSem.dateFin = new Date(getSemestreDateFin()[1]);
  }
  return dateSem;
}

function getEndSemestre() {
  if (currentSemestre === "S1") return getSemestreDateFin()[0];
  else return getSemestreDateFin()[1];
}

const getCurrentSemestre = () => {
  return sheetPARAM.getRange("B8:B8").getValue();
};

const currentSemestre = getCurrentSemestre();
