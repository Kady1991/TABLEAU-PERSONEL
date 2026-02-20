import { Route, Routes } from "react-router-dom";

// Layout
import DashboardLayout from "./layout/DashboardLayout";

// Pages
import Home from "./pages/personnels/HomePage";
import PersonnelList from "./pages/personnels/PersonnelListPage";
import PersonnelDetail from "./pages/personnels/PersonnelDetailPage";
import PersonnelStatistics from "./pages/personnels/PersonnelStatisticsPage";
import PersonnelArchivesList from "./pages/personnels/PersonnelArchivesListPage";

export default function App() {
  return (
    <Routes>
      {/* Toutes les pages à l'intérieur du layout (sidebar + header) */}
      <Route element={<DashboardLayout />}>
        {/* Home = page par défaut */}
        <Route path="/" element={<Home />} />

        {/* PERSONNELS */}
        <Route path="/personnels" element={<PersonnelList />} />

        {/*  IMPORTANT : on rend la même page pour ouvrir la modal via l’URL */}
        <Route path="/personnels/new" element={<PersonnelList />} />

        <Route path="/personnels/archives" element={<PersonnelArchivesList />} />
        <Route path="/personnels/statistics" element={<PersonnelStatistics />} />

        {/* Détail */}
        <Route path="/personnels/:id" element={<PersonnelDetail />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}
