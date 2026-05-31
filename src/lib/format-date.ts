export function formatDate(date: number | string) {
  const d = new Date(date);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const year = d.getFullYear();
  return { weekday, day, month, year };
}
