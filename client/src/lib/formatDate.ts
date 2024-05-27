import { toZonedTime } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";

export function formatBuiltDate(dateToFormat: string): string {
  //Date is in format YYYY-MM-DD HH:MM:SS
  const date = dateToFormat.split(" ")[0] as string;
  const year = date.split("-")[0];

  const nowToday = new Date();
  const nowTodayYear = nowToday.getUTCFullYear();

  //If the year provided is before 1900 or more than 2 years into the future
  //then we return the year 1970 as default
  if (!year || Number(year) < 1900 || Number(year) > nowTodayYear + 2) {
    return "1970";
  } else {
    return year;
  }
}

export function formatListedAtDate(dateToFormat: string): string {
  //Date is in format YYYY-MM-DD HH:MM:SS
  const dateInUTC = toZonedTime(dateToFormat, "UTC");

  const formattedDate = formatDistanceToNow(dateInUTC);
  return formattedDate;
}
