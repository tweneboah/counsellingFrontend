import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { JournalList, JournalEditor } from "../../components/journal";

const Journal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    navigate(`/journal/${entry._id}`);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<JournalList onSelectEntry={handleSelectEntry} />}
      />
      <Route
        path="/new"
        element={
          <JournalEditor
            isEditing={true}
            onCancel={() => navigate("/journal")}
            onSave={() => navigate("/journal")}
          />
        }
      />
      <Route
        path="/:entryId"
        element={
          <JournalEditor
            isEditing={false}
            onCancel={() => navigate("/journal")}
            onSave={() => navigate("/journal")}
          />
        }
      />
      <Route
        path="/:entryId/edit"
        element={
          <JournalEditor
            isEditing={true}
            onCancel={() => navigate("/journal")}
            onSave={() => navigate("/journal")}
          />
        }
      />
    </Routes>
  );
};

export default Journal;
