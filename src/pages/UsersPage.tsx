import { useMemo, useState } from "react";
import { readFileDataUrl } from "../lib/utils";

const userIcons = ["🙂", "😎", "🤓", "🧠", "🎯", "🚀", "🦄", "🐙", "🔥", "⭐"];

export function UsersPage({ data, addUser, deleteUser }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    icon: "🙂",
    color: "#7c3aed",
    photoDataUrl: ""
  });

  const normalizedEmail = useMemo(() => form.email.trim().toLowerCase(), [form.email]);
  const normalizedEmployeeId = useMemo(() => form.employeeId.trim(), [form.employeeId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name is required");

    if (
      normalizedEmail &&
      data.users.some((u: any) => String(u.email ?? "").trim().toLowerCase() === normalizedEmail)
    ) {
      return alert("Email must be unique");
    }

    if (
      normalizedEmployeeId &&
      data.users.some((u: any) => String(u.employeeId ?? "").trim() === normalizedEmployeeId)
    ) {
      return alert("Employee ID must be unique");
    }

    addUser({
      ...form,
      email: form.email.trim(),
      employeeId: normalizedEmployeeId,
      name: form.name.trim()
    });

    setForm({ name: "", email: "", employeeId: "", icon: "🙂", color: "#7c3aed", photoDataUrl: "" });
  };

  return (
    <section>
      <h2>Admin / Users</h2>
      <form onSubmit={submit} className="grid">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
        />

        <div>
          <p className="field-label">Pick icon</p>
          <div className="icon-grid">
            {userIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`icon-btn ${form.icon === icon ? "selected" : ""}`}
                onClick={() => setForm({ ...form, icon })}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <label>
          Color
          <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </label>

        <label>
          Picture
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const photoDataUrl = await readFileDataUrl(file);
              setForm((prev) => ({ ...prev, photoDataUrl }));
            }}
          />
        </label>

        <button type="submit">Add User</button>
      </form>

      <ul>
        {data.users.map((u: any) => (
          <li key={u.id}>
            <span style={{ color: u.color }}>
              {u.icon ?? "🙂"} {u.name} ({u.employeeId || "no id"})
            </span>
            <button onClick={() => deleteUser(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
