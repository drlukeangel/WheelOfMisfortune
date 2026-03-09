import { useState } from "react";
import { parseCsv } from "../lib/utils";

export function ImportPage({ addUsersBulk }: any) {
  const [csv, setCsv] = useState("name,email,employeeId,icon,color");

  return (
    <section>
      <h2>Admin / Import</h2>
      <p>CSV format: name,email,employeeId,icon,color</p>
      <textarea rows={8} value={csv} onChange={(e) => setCsv(e.target.value)} />
      <button onClick={() => {
        const rows = parseCsv(csv);
        const [, ...dataRows] = rows;
        addUsersBulk(dataRows.map((r) => ({
          name: r[0] ?? "",
          email: r[1] ?? "",
          employeeId: r[2] ?? "",
          icon: r[3] ?? "",
          color: r[4] ?? ""
        })).filter((u) => u.name));
      }}>Import users</button>
    </section>
  );
}
