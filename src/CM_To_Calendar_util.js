let numDay= [["lundi",0],["mardi",1],["mercredi",2],["jeudi",3],["vendredi",4],["samedi",5],["dimanche",6]];
let englishDay= [["lundi","MONDAY"],["mardi","TUESDAY"],["mercredi","WEDNESDAY"],["jeudi","THURSDAY"],["vendredi","FRIDAY"],["samedi","SATURDAY"],["dimanche","SUNDAY"]];
Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
} 

let getColorGroupe = (groupName) => {
  let color = '#de1f40'
  let groupeFind = false
  let i = 0
  //initialisation de la variable groupe
  do
  {
    if (sheetCM.getRange(i+2,8).getValue()===groupName)
    {
      color=sheetCM.getRange(i+2,9).getBackground()
      groupeFind = true
    }
    i++
  }
  while ((!groupeFind) && !(sheetCM.getRange(i+2,8).getValue()==="") )
  return color;
}

let formatDateDansSheet = (dateFromSheet) => 
{
  let newDate = ''
  if (dateFromSheet.includes('h')) {
    newDate = dateFromSheet.split('h')
  }
  if (dateFromSheet.includes(':')) {
    newDate = dateFromSheet.split(':')
  }
  return [newDate[0],newDate[1]]

}

let getNbDay = (dayLooking) => {
  let i=0;
  while (numDay.length != i) {
    if (dayLooking.toLowerCase()==numDay[i][0].toLowerCase()) {
      return numDay[i][1];
    }
    i=i+1;
  }
}

let getENDay = (dayLooking) => {
  let i=0;
  while ((dayLooking!=englishDay[0] && englishDay.length!=i)) {
    
    if (dayLooking==englishDay[i][0]) {
      return englishDay[i][1];
    }
    i=i+1;
  }
}