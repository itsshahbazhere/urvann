import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AddPlant from "./pages/AddPlant";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import NotFound from './pages/NotFound';

// Wrapper to check token and redirect from /admin to /plant if token exists
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  const location = useLocation();
  if (token) {
    // If logged in (token exists), redirect to /plant
    return <Navigate to="/plant" state={{ from: location }} replace />;
  }
  return children;
};

// Wrapper to protect /plant route, only accessible if token exists
const ProtectedPlantRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  const location = useLocation();
  if (!token) {
    // If not logged in, redirect to /admin
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/plant"
          element={
            <ProtectedPlantRoute>
              <AddPlant />
            </ProtectedPlantRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;