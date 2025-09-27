const VILLE = PropertiesService.getScriptProperties().getProperty("VILLE");
const API_URL = PropertiesService.getScriptProperties().getProperty("API_URL");
const IDSHEET = SpreadsheetApp.getActive().getId();
const PARAMTAB = "PARAMETRES_COMMUN";
const CMTAB = "CM";
const ss = SpreadsheetApp.openById(IDSHEET);
const sheetCM = ss.getSheetByName(CMTAB);
const sheetPARAM = ss.getSheetByName(PARAMTAB);
const sheetRep = ss.getSheetByName("REPONSES");

let numDay = [
  ["lundi", 0],
  ["mardi", 1],
  ["mercredi", 2],
  ["jeudi", 3],
  ["vendredi", 4],
  ["samedi", 5],
  ["dimanche", 6],
];
let englishDay = [
  ["lundi", "MONDAY"],
  ["mardi", "TUESDAY"],
  ["mercredi", "WEDNESDAY"],
  ["jeudi", "THURSDAY"],
  ["vendredi", "FRIDAY"],
  ["samedi", "SATURDAY"],
  ["dimanche", "SUNDAY"],
];
