function onOpen() {

    let ui = SpreadsheetApp.getUi();
    ui.createMenu(`📔 JurisMenu`)
      .addItem('🔄 Mise à Jour CM', 'cm')
      .addItem('📕 UpdateTD', 'updateResponse')
      .addItem('🧹 Clean trigger', 'deleteTriggerMenu')
      .addItem('👀 check td', 'checkTD')
      .addToUi();

  }

  function create_onOpen(){
    ScriptApp.newTrigger('onOpen')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onOpen()
    .create();
}

function checkTD()
{
    deleteAllTriggers('updateAllNewResponse');
    deleteAllTriggers('verifyAllEntriesHaveAppointments');
    verifyAllEntriesHaveAppointments();
}

function cm() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      updateCM('cm')
}

function updateResponse()
{
SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  deleteAllTriggers('updateAllNewResponse');
  deleteAllTriggers('verifyAllEntriesHaveAppointments');
  updateAllNewResponse();      
}

function deleteTriggerMenu()
{
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  deleteAllTriggers('updateAllNewResponse');
}
