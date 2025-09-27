Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

let formatDateDansSheet = (dateFromSheet) => {
  let newDate = "";
  if (dateFromSheet.includes("h")) {
    newDate = dateFromSheet.split("h");
  }
  if (dateFromSheet.includes(":")) {
    newDate = dateFromSheet.split(":");
  }
  return [newDate[0], newDate[1]];
};

let getNbDay = (dayLooking) => {
  let i = 0;
  while (numDay.length != i) {
    if (dayLooking.toLowerCase() == numDay[i][0].toLowerCase()) {
      return numDay[i][1];
    }
    i = i + 1;
  }
};

let getENDay = (dayLooking) => {
  let i = 0;
  while (dayLooking != englishDay[0] && englishDay.length != i) {
    if (dayLooking == englishDay[i][0]) {
      return englishDay[i][1];
    }
    i = i + 1;
  }
};
