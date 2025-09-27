const update_CM_TO_API = (sheet_datas, event_id) => {
  if (!event_id) return;
  var url = API_URL + "/api/cours-magistraux/update-cours-magistraux/";
  var data = {
    matiere: sheet_datas[0],
    professeur: sheet_datas[1],
    heure_debut: convertToTimeFormat(sheet_datas[4]),
    heure_fin: convertToTimeFormat(sheet_datas[5]),
    jours: sheet_datas[3],
    groupes: sheet_datas[2],
    semestre: currentSemestre,
    ville: VILLE,
    id_event: event_id,
  };

  var options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(data),
    muteHttpExceptions: true,
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
  } catch (e) {
    Logger.log("Erreur lors de la requête : " + e.message);
  }
};
