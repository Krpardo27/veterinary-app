type CsvValue = string | number | boolean | null | undefined;
type CsvRow = Record<string, CsvValue>;

function escapeCsvValue(value: CsvValue) {
  const normalizedValue = value ?? "";
  const text = String(normalizedValue);

  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: CsvRow[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];

  return lines.join("\n");
}

export function downloadCsv(filename: string, rows: CsvRow[]) {
  const csv = `\uFEFF${rowsToCsv(rows)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}