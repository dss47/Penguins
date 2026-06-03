import { useState } from "react";
import Header from "../components/Validations/header";
import Insight from "../components/Validations/insight";
import Toolbar from "../components/Validations/ToolbarFilter";
import Main from "../components/Validations/main";

function Validations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous"); 
  const [sortOption, setSortOption] = useState("Plus récent");

  return (
    <>
      <Header />
      <Insight />
      <Toolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <Main 
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        sortOption={sortOption}
      />
    </>
  );
}
export default Validations;
