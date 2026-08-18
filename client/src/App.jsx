import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLoader } from './components/ui/Loaders';

// Route-level code splitting for faster first paint.
const Home = lazy(() => import('./pages/Home'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Compare = lazy(() => import('./pages/Compare'));
const Favorites = lazy(() => import('./pages/Favorites'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ParticleBackground />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/analytics/:owner/:repo"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <Compare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
