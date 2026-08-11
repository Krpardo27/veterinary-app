import Swal from "sweetalert2";

type SummaryRow = {
  label: string;
  value: string | number | null | undefined;
};

type AlertIcon = "success" | "error" | "warning" | "info" | "question";

export function escapeSwalHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function swalMessageHtml(message: string) {
  return `
    <div style="margin-top:0.5rem;border:1px solid #DCE8E2;background:#F7FAF9;padding:0.9rem 1rem;text-align:left;">
      <p style="margin:0;color:#1D3A35;font-size:0.95rem;line-height:1.5;">${escapeSwalHtml(message)}</p>
    </div>
  `;
}

export function swalSummaryHtml(rows: SummaryRow[], total?: SummaryRow) {
  const rowHtml = rows
    .filter((row) => row.value !== null && row.value !== undefined && String(row.value).trim() !== "")
    .map((row) => `
      <div style="display:grid;grid-template-columns:7.25rem 1fr;gap:0.75rem;padding:0.65rem 0;border-bottom:1px solid #E7EFEB;text-align:left;">
        <span style="color:#6F817A;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">${escapeSwalHtml(row.label)}</span>
        <span style="color:#1D3A35;font-size:0.92rem;font-weight:600;line-height:1.35;">${escapeSwalHtml(String(row.value))}</span>
      </div>
    `)
    .join("");

  const totalHtml = total
    ? `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-top:0.85rem;text-align:left;">
        <span style="color:#0F766E;font-size:0.78rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">${escapeSwalHtml(total.label)}</span>
        <span style="color:#0F766E;font-size:1.15rem;font-weight:800;">${escapeSwalHtml(String(total.value ?? "-"))}</span>
      </div>
    `
    : "";

  return `
    <div style="margin-top:0.5rem;border:1px solid #DCE8E2;background:#F7FAF9;padding:0.9rem 1rem;">
      ${rowHtml}
      ${totalHtml}
    </div>
  `;
}

export function confirmSwal({
  title,
  message,
  html,
  icon = "question",
  confirmButtonText,
  cancelButtonText = "Volver",
  confirmButtonColor = "#2A6A5D",
}: {
  title: string;
  message?: string;
  html?: string;
  icon?: AlertIcon;
  confirmButtonText: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
}) {
  return Swal.fire({
    title,
    html: html ?? (message ? swalMessageHtml(message) : undefined),
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor: "#6b7280",
    background: "#ffffff",
    color: "#1D3A35",
  });
}

export function feedbackSwal({
  title,
  message,
  icon,
  confirmButtonText = "Entendido",
  confirmButtonColor = "#2A6A5D",
}: {
  title: string;
  message: string;
  icon: AlertIcon;
  confirmButtonText?: string;
  confirmButtonColor?: string;
}) {
  return Swal.fire({
    title,
    html: swalMessageHtml(message),
    icon,
    confirmButtonText,
    confirmButtonColor,
    background: "#ffffff",
    color: "#1D3A35",
  });
}