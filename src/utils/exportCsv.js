/**
 * Export an array of objects to a CSV file and trigger a browser download.
 *
 * @param {Array<Object>} rows - Data rows to export
 * @param {string} filename - Desired filename (without or with .csv)
 * @param {Array<{ key: string, label: string, format?: (val: any, row: Object) => string }>} columns
 */
export function exportToCsv(rows, filename = "export.csv", columns) {
  if (!rows || rows.length === 0) {
    alert("No data available to export");
    return;
  }

  const effectiveColumns =
    columns ||
    Object.keys(rows[0]).map((key) => ({
      key,
      label: key.toUpperCase().replace(/_/g, " "),
    }));

  const headers = effectiveColumns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(",");

  const csvRows = rows.map((row) => {
    return effectiveColumns
      .map((col) => {
        let val = row[col.key];
        if (col.format) {
          val = col.format(val, row);
        }
        if (val === null || val === undefined) {
          val = "";
        }
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(",");
  });

  const csvContent = "\uFEFF" + [headers, ...csvRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    filename.endsWith(".csv") ? filename : `${filename}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
