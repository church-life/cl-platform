const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const extractDateOnly = (date: Date) => {
  const formatPart = dateFormatter.formatToParts(date);

  const year = formatPart.find((p) => p.type === "year")?.value;
  const month = formatPart.find((p) => p.type === "month")?.value;
  const day = formatPart.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
};
