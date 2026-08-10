import { Routes, Route, Navigate } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import { checkAuth } from './authSlice';

import { useLocation } from 'react-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import ProblemPage from './pages/ProblemPage';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import CheckEmail from './pages/CheckEmail';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

import CreateProblem from './components/admin/CreateProblem';
import UpdateProblem from './components/admin/UpdateProblem';
import UpdateProblemList from './components/admin/UpdateProblemList';
import DeleteProblem from './components/admin/DeleteProblem';
import UploadVideoSolution from './components/admin/UploadVideoSolution';
import ManageVideoSolutions from './components/admin/ManageVideoSolutions';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

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

  function RouteProgress() {
    const location = useLocation();

    useEffect(() => {
      NProgress.start();
      const t = setTimeout(() => NProgress.done(), 300);
      return () => {
        clearTimeout(t);
        NProgress.done();
      };
    }, [location.pathname]);

    return null;
  }

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/problems" /> : <LandingPage />} />

      <Route path="/problems" element={isAuthenticated ? <Homepage /> : <Navigate to="/" />} />

      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />

      <Route path="/check-email" element={isAuthenticated ? <Navigate to="/" /> : <CheckEmail />} />

      <Route
        path="/verify-email/:token"
        element={isAuthenticated ? <Navigate to="/" /> : <VerifyEmail />}
      />

      <Route path="/resend-verification" element={<ResendVerification />} />

      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />}
      />

      <Route
        path="/change-password"
        element={isAuthenticated ? <ChangePassword /> : <Navigate to="/login" />}
      />

      <Route
        path="/problem/:slug"
        element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
      />

      <Route path="/admin" element={isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/" />} />

      <Route
        path="/admin/create"
        element={isAuthenticated && isAdmin ? <CreateProblem /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/delete"
        element={isAuthenticated && isAdmin ? <DeleteProblem /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/update-list"
        element={isAuthenticated && isAdmin ? <UpdateProblemList /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/video"
        element={isAuthenticated && isAdmin ? <ManageVideoSolutions /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/upload/:problemId"
        element={isAuthenticated && isAdmin ? <UploadVideoSolution /> : <Navigate to="/" />}
      />

      <Route
        path="/admin/update/:id"
        element={isAuthenticated && isAdmin ? <UpdateProblem /> : <Navigate to="/" />}
      />

      <Route path="/profile/:username" element={<Profile />} />

      <Route path="/profile/edit" element={<EditProfile />} />
    </Routes>
  );
}

export default App;
