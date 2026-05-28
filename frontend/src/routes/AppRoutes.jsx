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

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  return isAuthenticated ? (
    <AppProvider>
      {children}
      <Toast />
    </AppProvider>
  ) : <Navigate to="/login" replace />;
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
          
          {/* Dynamic Form Builder */}
          <Route path="form-builder" element={<FormBuilderPage />} />
          
          {/* Full Analytics Page */}
          <Route path="analytics" element={<AnalyticsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
