import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { Layout } from "./Layout";

function App() {
  return (
    <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
    </AuthProvider>
  );
}

export default App;
