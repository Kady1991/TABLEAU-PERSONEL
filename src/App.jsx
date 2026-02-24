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
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/personnels" element={<PersonnelList />} />
        <Route path="/personnels/new" element={<PersonnelList />} />

        <Route path="/personnels/archives" element={<PersonnelArchivesList />} />
        <Route path="/personnels/statistics" element={<PersonnelStatistics />} />

        <Route path="/personnels/:id" element={<PersonnelDetail />} />
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}