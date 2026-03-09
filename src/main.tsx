import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./components/Layout";
import { useAppStore } from "./lib/store";
import { GroupsPage } from "./pages/GroupsPage";
import { ImportPage } from "./pages/ImportPage";
import { LeaderboardsPage } from "./pages/LeaderboardsPage";
import { PlayPage } from "./pages/PlayPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UsersPage } from "./pages/UsersPage";
import "./styles.css";

function App() {
  const [page, setPage] = useState("play");
  const store = useAppStore();

  return (
    <Layout page={page} onPageChange={setPage}>
      {page === "play" && <PlayPage data={store.data} playRun={store.playRun} />}
      {page === "leaderboards" && <LeaderboardsPage data={store.data} />}
      {page === "admin-users" && <UsersPage data={store.data} addUser={store.addUser} deleteUser={store.deleteUser} />}
      {page === "admin-groups" && (
        <GroupsPage
          data={store.data}
          addGroup={store.addGroup}
          deleteGroup={store.deleteGroup}
          setGroupMembers={store.setGroupMembers}
        />
      )}
      {page === "admin-import" && <ImportPage addUsersBulk={store.addUsersBulk} />}
      {page === "settings" && (
        <SettingsPage data={store.data} updateSettings={store.updateSettings} resetAll={store.resetAll} />
      )}
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
