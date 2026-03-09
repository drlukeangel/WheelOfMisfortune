import { useState } from "react";
import { parseCsv } from "../lib/utils";

export function ImportPage({ data, addUsersBulk }: any) {
  const [csv, setCsv] = useState("name,email,employeeId,icon,color");
  const [message, setMessage] = useState("");

  const onImport = () => {
    const rows = parseCsv(csv);
    const [, ...dataRows] = rows;

    const existingEmails = new Set(
      data.users
        .map((u: any) => String(u.email ?? "").trim().toLowerCase())
        .filter(Boolean)
    );
    const existingEmployeeIds = new Set(
      data.users
        .map((u: any) => String(u.employeeId ?? "").trim())
        .filter(Boolean)
    );

    const seenEmails = new Set<string>();
    const seenEmployeeIds = new Set<string>();

    const accepted = [] as Array<{ name: string; email: string; employeeId: string; icon?: string; color?: string }>;
    let skipped = 0;

    for (const r of dataRows) {
      const name = String(r[0] ?? "").trim();
      const email = String(r[1] ?? "").trim();
      const emailKey = email.toLowerCase();
      const employeeId = String(r[2] ?? "").trim();
      const icon = String(r[3] ?? "").trim();
      const color = String(r[4] ?? "").trim();

      if (!name) {
        skipped += 1;
        continue;
      }

      if (emailKey && (existingEmails.has(emailKey) || seenEmails.has(emailKey))) {
        skipped += 1;
        continue;
      }

      if (employeeId && (existingEmployeeIds.has(employeeId) || seenEmployeeIds.has(employeeId))) {
        skipped += 1;
        continue;
      }

      if (emailKey) seenEmails.add(emailKey);
      if (employeeId) seenEmployeeIds.add(employeeId);
      accepted.push({ name, email, employeeId, icon, color });
    }

    if (accepted.length > 0) {
      addUsersBulk(accepted);
    }

    setMessage(`Imported ${accepted.length} users. Skipped ${skipped} invalid/duplicate rows.`);
  };

  return (
    <section>
      <h2>Admin / Import</h2>
      <p>CSV format: name,email,employeeId,icon,color</p>
      <textarea rows={8} value={csv} onChange={(e) => setCsv(e.target.value)} />
      <button onClick={onImport}>Import users</button>
      {message && <p>{message}</p>}
    </section>
  );
}
