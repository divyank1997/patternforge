import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';

// Remote MFE components — loaded at runtime from their own servers
const LoginPage     = lazy(() => import('mfe_auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage  = lazy(() => import('mfe_auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('mfe_auth/DashboardPage').then(m => ({ default: m.DashboardPage })));
const EditorPage    = lazy(() => import('mfe_editor/EditorPage').then(m => ({ default: m.EditorPage })));

export function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Routes>
        {/* Editor gets full screen — no navbar */}
        <Route path="/editor" element={
          <Suspense fallback={<LoadingScreen label="Loading editor..." />}>
            <EditorPage />
          </Suspense>
        } />

        {/* All other routes get the navbar */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/"          element={<LandingPage />} />
              <Route path="/login"     element={<Suspense fallback={<LoadingScreen label="Loading..." />}><LoginPage /></Suspense>} />
              <Route path="/register"  element={<Suspense fallback={<LoadingScreen label="Loading..." />}><RegisterPage /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><DashboardPage /></Suspense>} />
              <Route path="*"          element={<Navigate to="/" replace />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
}
