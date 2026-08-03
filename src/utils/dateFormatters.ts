const CHILE_LOCALE = "es-CL";
const SANTIAGO_TIME_ZONE = "America/Santiago";

const shortDateFormatter = new Intl.DateTimeFormat(CHILE_LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: SANTIAGO_TIME_ZONE,
});

const longDateFormatter = new Intl.DateTimeFormat(CHILE_LOCALE, {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: SANTIAGO_TIME_ZONE,
});

const displayTimeFormatter = new Intl.DateTimeFormat(CHILE_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: SANTIAGO_TIME_ZONE,
});

const twentyFourHourTimeFormatter = new Intl.DateTimeFormat(CHILE_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: SANTIAGO_TIME_ZONE,
});

export function formatShortDate(date: Date) {
  return shortDateFormatter.format(date);
}

export function formatLongDate(date: Date) {
  return longDateFormatter.format(date);
}

export function formatDisplayTime(date: Date) {
  return displayTimeFormatter.format(date);
}

export function formatTwentyFourHourTime(date: Date) {
  return twentyFourHourTimeFormatter.format(date);
}

export function formatAppointmentDateTime(date: Date) {
  return `${formatShortDate(date)} a las ${formatTwentyFourHourTime(date)}`;
}

const weekdayDateTimePartsFormatter = new Intl.DateTimeFormat(CHILE_LOCALE, {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: SANTIAGO_TIME_ZONE,
});

export function formatDayMonthYearDateTime(date: Date) {
  const parts = weekdayDateTimePartsFormatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";

  return `${weekday}, ${day} de ${month} de ${year}, ${hour}:${minute}`;
}