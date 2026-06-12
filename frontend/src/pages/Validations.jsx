import { useState, useEffect, useMemo } from "react";
import Header from "../components/Validations/header";
import Insight from "../components/Validations/insight";
import Toolbar from "../components/Validations/ToolbarFilter";
import Main from "../components/Validations/main";
import SuggestionDrawer from "../components/Validations/SuggestionDrawer";
import api from "../services/api";

export default function Validations() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous"); 
  const [sortOption, setSortOption] = useState("Plus récent");

  const fetchSuggestions = () => {
    setLoading(true);
    api
      .get("/admin/suggestions")
      .then((res) => {
        setSuggestions(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const stats = useMemo(() => ({
    total: suggestions.length,
    pending: suggestions.filter((s) =>
      ["waiting_ai_analysis", "ai_approved_pending_review", "waiting_manual_validation"].includes(s.status)
    ).length,
    accepted: suggestions.filter((s) => s.status === "published_to_catalog").length,
    rejected: suggestions.filter((s) => ["ai_rejected", "rejected_by_admin"].includes(s.status)).length,
  }), [suggestions]);

  const handleUpdate = (id, updates) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  return (
    <>
      <Header />
      <Insight {...stats} />
      <Toolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <Main
        suggestions={suggestions}
        loading={loading}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        sortOption={sortOption}
        onView={setSelectedSuggestion}
      />
      {selectedSuggestion && (
        <SuggestionDrawer
          suggestion={selectedSuggestion}
          onClose={() => setSelectedSuggestion(null)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
