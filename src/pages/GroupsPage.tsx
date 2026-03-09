import { useMemo, useState } from "react";

const groupIcons = ["👥", "🧩", "🏴", "🎮", "🎤", "⚙️", "📣", "🛡️"];

export function GroupsPage({ data, addGroup, deleteGroup, setGroupMembers }: any) {
  const [form, setForm] = useState({ name: "", description: "", icon: "👥", color: "#0ea5e9" });

  const membersByGroup = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const membership of data.memberships) {
      if (!map.has(membership.groupId)) map.set(membership.groupId, new Set());
      map.get(membership.groupId)?.add(membership.userId);
    }
    return map;
  }, [data.memberships]);

  const toggleMembership = (groupId: string, userId: string, checked: boolean) => {
    const currentMembers = [...(membersByGroup.get(groupId) ?? new Set<string>())];
    const nextMembers = checked
      ? Array.from(new Set([...currentMembers, userId]))
      : currentMembers.filter((id) => id !== userId);
    setGroupMembers(groupId, nextMembers);
  };

  return (
    <section>
      <h2>Admin / Groups</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) return alert("Group name is required");
          addGroup({ ...form, name: form.name.trim() });
          setForm({ name: "", description: "", icon: "👥", color: "#0ea5e9" });
        }}
        className="grid"
      >
        <input placeholder="Group name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div>
          <p className="field-label">Pick icon</p>
          <div className="icon-grid">
            {groupIcons.map((icon) => (
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
        <button type="submit">Add Group</button>
      </form>

      <h3>Group Mapping Table (Users ↔ Groups)</h3>
      {data.groups.length === 0 || data.users.length === 0 ? (
        <p>Add at least one user and one group to map memberships.</p>
      ) : (
        <div className="mapping-table-wrap">
          <table className="mapping-table">
            <thead>
              <tr>
                <th>User</th>
                {data.groups.map((g: any) => (
                  <th key={g.id} style={{ color: g.color }}>
                    {g.icon ?? "👥"} {g.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users.map((u: any) => (
                <tr key={u.id}>
                  <td>
                    {u.icon ?? "🙂"} {u.name}
                  </td>
                  {data.groups.map((g: any) => {
                    const checked = membersByGroup.get(g.id)?.has(u.id) ?? false;
                    return (
                      <td key={`${u.id}-${g.id}`}>
                        <input
                          aria-label={`Map ${u.name} to ${g.name}`}
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => toggleMembership(g.id, u.id, e.target.checked)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ul>
        {data.groups.map((g: any) => (
          <li key={g.id}>
            <span style={{ color: g.color }}>
              {g.icon ?? "👥"} {g.name}
            </span>
            <button onClick={() => deleteGroup(g.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
