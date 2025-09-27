const initRdvValues = (datasFromSheet, rdvType) =>
{
  if (checkValue(datasFromSheet,0,5))
  {
  const groupe = datasFromSheet[2];
  const matiereRdv = datasFromSheet[0];
  const heureDeb = formatDateDansSheet(datasFromSheet[4]);
  const heureFin = formatDateDansSheet(datasFromSheet[5]);
  const numDayRdv=getNbDay(datasFromSheet[3].toLowerCase().replace(/\s/g, ''));
  return ({
    titre : `${rdvType} ` + matiereRdv + " " + groupe,
    groupe,
    calendarName : groupe + ` - ${rdvType}`,
    rdvDeb : makeRdvDate(heureDeb[0], heureDeb[1], numDayRdv),
    rdvFin : makeRdvDate(heureFin[0], heureFin[1], numDayRdv),
    dayEN : getENDay(datasFromSheet[3].toLowerCase().replace(/\s/g, '')),
    isvalid : true
  });
  }
  else 
  {
    return ({
      isvalid : false
    });
  }
}
let updateCM = () => { 
  const IDSHEET = PropertiesService.getScriptProperties().getProperty('IDSHEET');
  let nextStartCM = parseInt(PropertiesService.getScriptProperties().getProperty('nextStartCM'));
  if (!nextStartCM) {
    nextStartCM = 1;
  }
  const timeZone = "Europe/Paris";
  const cmDataFromSheet = sheetCM.getRange("A:I");
  const lastSheetRow = sheetCM.getLastRow();
  let lastRow = nextStartCM + 30;
  if (lastSheetRow < lastRow) lastRow = lastSheetRow;
  for (let i = nextStartCM ; i < lastRow; i++)
  {
    const sheet_datas= cmDataFromSheet.getValues()[i];
    const rdvDatas = initRdvValues(sheet_datas, "CM")
    if (!rdvDatas.isvalid)  continue;
    let currentCalendar = CalendarApp.getCalendarsByName(rdvDatas.calendarName);
    let flag = false;
    //si l'agenda n'hésite pas on le crée.
    if (currentCalendar.length === 0) {
        currentCalendar = CalendarApp.createCalendar(rdvDatas.calendarName,{
        color:getColorGroupe(rdvDatas.groupe),
        timeZone
      });
    }
    eventGet = CalendarApp.getCalendarsByName(rdvDatas.calendarName)[0].getEvents(new Date(rdvDatas.rdvDeb),new Date(rdvDatas.rdvFin));
    eventGet.map((ev) => {
      if (ev.getTitle() === rdvDatas.titre) {
        flag=true;
        writeStatusWithTimestamp(sheetCM, i + 1, 7, '✅', ev);
      }
    })
   if (!flag)
   { 
    let newEvent = CalendarApp.getCalendarsByName(rdvDatas.calendarName)[0].createEventSeries(rdvDatas.titre,
      rdvDatas.rdvDeb,
      rdvDatas.rdvFin,
      CalendarApp.newRecurrence().addWeeklyRule()
        .onlyOnWeekday(CalendarApp.Weekday[rdvDatas.dayEN])
        .until(new Date(getEndSemestre())));
    update_CM_TO_API(sheet_datas,newEvent.getId())
    writeStatusWithTimestamp(sheetCM, i + 1, 7, '🆕', newEvent);
    }
  }
  if (lastSheetRow < lastRow + 1) 
  { lastRow = 0  
    deleteAllTriggers('updateCM');
    　MailApp.sendEmail({
        name: "Juris'Perform",
        to: 'secretariat@juris-perform.fr',
        to: 'martin.dev@ik.me',
        subject: 'CM Mis à Jour',
        htmlBody: 'mise à jour des cms terminés'
    }
    );
  }
  else createTrigger('updateCM');
  PropertiesService.getScriptProperties().setProperty('nextStartCM', lastRow);
}
