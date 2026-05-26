import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Pages
import DashboardPage from '../pages/DashboardPage';
import LeadListPage from '../pages/LeadListPage';
import LeadDetailsPage from '../pages/LeadDetailsPage';
import AddEditLeadPage from '../pages/AddEditLeadPage';
import FormBuilderPage from '../pages/FormBuilderPage';
import AnalyticsPage from '../pages/AnalyticsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
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
  );
}
