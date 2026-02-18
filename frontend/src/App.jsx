import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BrowsePage from './pages/BrowsePage';
import ReportItemPage from './pages/ReportItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import EditItemPage from './pages/EditItemPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const Layout = ({ children, noFooter = false }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!noFooter && <Footer />}
  </>
);

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        {/* Public routes - with layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/browse" element={<Layout><BrowsePage /></Layout>} />
        <Route path="/items/:id" element={<Layout><ItemDetailPage /></Layout>} />

        {/* Auth routes - no footer */}
        <Route path="/login" element={<Layout noFooter><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout noFooter><RegisterPage /></Layout>} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute>
            <Layout><ReportItemPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/items/:id/edit" element={
          <ProtectedRoute>
            <Layout><EditItemPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
