import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { Layout } from "./Layout";
import { LotEditPage } from "./pages/LotEditPage";
import { LotCreatePage } from "./pages/LotCreatePage";
import { LotSelectPage } from "./pages/LotSelectPage";
import { DistrictSelectPage } from "./pages/DistrictSelectPage";
import { ReportPage } from "./pages/ReportPage";

function App() {
  return (
    <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/lots/select/:distrito" element={<LotSelectPage />} />
              <Route path="/lots/:id/edit" element={<LotEditPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/lots/new" element={<LotCreatePage />} />
              <Route path="/lots/select" element={<DistrictSelectPage />} />
              <Route path="/reports" element={<ReportPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
    </AuthProvider>
  );
}

export default App;
