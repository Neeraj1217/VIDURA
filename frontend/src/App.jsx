import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { InboxPage } from "./pages/InboxPage";
import { PriorityPage } from "./pages/PriorityPage";
import { ReplyGeneratorPage } from "./pages/ReplyGeneratorPage";

const ProtectedRoute = ({ children }) => {
  const { userId } = useAuth();
  const hasIncomingUserId =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("userId");
  return userId || hasIncomingUserId ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <Layout>
              <InboxPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/priority"
        element={
          <ProtectedRoute>
            <Layout>
              <PriorityPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reply"
        element={
          <ProtectedRoute>
            <Layout>
              <ReplyGeneratorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/inbox" replace />} />
    </Routes>
  );
};

export default App;
