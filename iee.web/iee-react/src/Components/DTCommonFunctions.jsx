export const createTimeString = (seconds) => {
  var date = new Date(seconds * 1000);
  var hh = date.getUTCHours();
  var mm = date.getUTCMinutes();

  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  if (hh >= 12) {
    if (hh > 12) hh = hh - 12;
    return hh + ":" + mm + " pm";
  }
  return hh + ":" + mm + " am";
};

export const dayIdToString = (day) => {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "N/A";
  }
};
