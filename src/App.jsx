import { Route, Routes } from "react-router-dom";

// Layout
import DashboardLayout from "./layout/DashboardLayout";

// Pages
import Home from "./pages/Personnels/HomePage";
import PersonnelList from "./pages/Personnels/PersonnelListPage";
import PersonnelDetail from "./pages/Personnels/PersonnelDetailPage";
import PersonnelStatistics from "./pages/Personnels/PersonnelStatisticsPage";
import PersonnelArchivesList from "./pages/Personnels/PersonnelArchivesListPage";

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