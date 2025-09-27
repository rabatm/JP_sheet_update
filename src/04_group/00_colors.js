let getColorGroupe = (groupName) => {
  let color = "#de1f40";
  let groupeFind = false;
  let i = 0;
  //initialisation de la variable groupe
  do {
    if (sheetCM.getRange(i + 2, 8).getValue() === groupName) {
      color = sheetCM.getRange(i + 2, 9).getBackground();
      groupeFind = true;
    }
    i++;
  } while (!groupeFind && !(sheetCM.getRange(i + 2, 8).getValue() === ""));
  return color;
};
