// date formatting - could be better
// 2020-09-20T07:41:59+00:00
export const formatDate = (rawDate: string) => {
  const date = String(rawDate)
    .split("-")
    .join(",")
    .split("T")
    .join(",")
    .split("+")
    .join(",")
    .split(",");

  return `${date[2]}. ${date[1]}. ${date[0]}`;
};
