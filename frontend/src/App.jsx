import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import AdminUpdate from "./components/AdminUpdate";
import AdminUpdateList from "./components/AdminUpdateList";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Homepage /> : <Navigate to="/signup" />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />

        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />

        <Route
          path="/admin"
          element={isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/" />}
        />

        <Route
          path="/admin/create"
          element={
            isAuthenticated && isAdmin ? <AdminPanel /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/delete"
          element={
            isAuthenticated && isAdmin ? <AdminDelete /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/update-list"
          element={
            isAuthenticated && isAdmin ? (
              <AdminUpdateList />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/problem/:problemId" element={<ProblemPage />} />

        <Route
          path="/admin/video"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminVideo />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/upload/:problemId"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/update/:id"
          element={
            isAuthenticated && isAdmin ? <AdminUpdate /> : <Navigate to="/" />
          }
        />

        
      </Routes>
    </>
  );
}

export default App;
