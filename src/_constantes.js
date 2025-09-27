const VILLE = "AIX";
const API_URL = 'https://api.surikwat.com/licence'
const IDSHEET = SpreadsheetApp.getActive().getId();
const PARAMTAB = 'PARAMETRES_COMMUN';
const CMTAB = "CM";


const ss = SpreadsheetApp.openById(IDSHEET);
const sheetCM = ss.getSheetByName(CMTAB);
const sheetPARAM=ss.getSheetByName(PARAMTAB)
const sheetRep=ss.getSheetByName("REPONSES")