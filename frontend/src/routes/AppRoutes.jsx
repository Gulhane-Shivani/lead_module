import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Pages
import DashboardPage from '../pages/DashboardPage';
import LeadListPage from '../pages/LeadListPage';
import LeadDetailsPage from '../pages/LeadDetailsPage';
import AddEditLeadPage from '../pages/AddEditLeadPage';
import FormBuilderPage from '../pages/FormBuilderPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import LoginPage from '../pages/LoginPage';

import Toast from '../components/Common/Toast';
import AppProvider from '../context/AppContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <AppProvider>
      {children}
      <Toast />
    </AppProvider>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />
          
          {/* Leads Management */}
          <Route path="leads" element={<LeadListPage />} />
          <Route path="leads/add" element={<AddEditLeadPage />} />
          <Route path="leads/:id" element={<LeadDetailsPage />} />
          <Route path="leads/edit/:id" element={<AddEditLeadPage />} />
          
          {/* Dynamic Form Builder - Admin Only */}
          <Route path="form-builder" element={
            <ProtectedRoute adminOnly={true}>
              <FormBuilderPage />
            </ProtectedRoute>
          } />
          
          {/* Full Analytics Page */}
          <Route path="analytics" element={<AnalyticsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
