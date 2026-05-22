import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect, useState } from "react";
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

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      await dispatch(checkAuth());
      setAuthChecked(true);
    };

    verifyAuth();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div style={{ minHeight: "100vh", background: "#080c14" }} />
  //   );
  // }

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
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
        path="/problem/:problemId"
        element={
          isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/admin"
        element={
          isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/" />
        }
      />

      <Route
        path="/admin/create"
        element={
          isAuthenticated && isAdmin ? (
            <AdminPanel />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/delete"
        element={
          isAuthenticated && isAdmin ? (
            <AdminDelete />
          ) : (
            <Navigate to="/" />
          )
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

      <Route
        path="/admin/video"
        element={
          isAuthenticated && isAdmin ? (
            <AdminVideo />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/upload/:problemId"
        element={
          isAuthenticated && isAdmin ? (
            <AdminUpload />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/update/:id"
        element={
          isAuthenticated && isAdmin ? (
            <AdminUpdate />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;