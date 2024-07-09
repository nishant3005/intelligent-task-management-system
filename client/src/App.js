import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <LandingPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
            </>
          }
        />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

function RequireAuth({ children }) {
  return <SignedIn>{children}</SignedIn>;
}

export default App;
