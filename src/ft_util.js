const checkValue = (tabForCheck, start, end) =>
{
  let   infosValide = true;
  for (let i = start; i <= end; i ++)
    if(tabForCheck[i] == '') infosValide = false;
  return infosValide;
}

cleanEmailsUtils = (emailColumn) =>
{
  var sheetName = 'ETUDIANTS';
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var range = sheet.getRange(emailColumn + ':' + emailColumn);
  var values = range.getValues();

  for (var i = 0; i < values.length; i++) {
    if (values[i][0]) {
      // Supprimer les retours à la ligne
      var cleanedEmail = values[i][0].replace(/[\n\r]/g, '');
      // Mettre à jour la cellule avec l'e-mail nettoyé
      sheet.getRange(emailColumn + (i + 1)).setValue(cleanedEmail);
    }
  }
}

function cleanEmails() {
  cleanEmailsUtils('C');
  cleanEmailsUtils('D');
}