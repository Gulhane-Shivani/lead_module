import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [forms, setForms] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('edulead_theme') || 'light');
  const [toast, setToast] = useState(null);

  // Sync theme with HTML DOM class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('edulead_theme', theme);
  }, [theme]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('edulead_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [leadsRes, formsRes, usersRes, followupsRes] = await Promise.all([
          api.get('/leads/'),
          api.get('/forms/'),
          api.get('/users/'),
          api.get('/followups/')
        ]);
        setLeads(leadsRes.data);
        setCounselors(usersRes.data || []);
        setFollowups(followupsRes.data || []);
        
        const fetchedForms = formsRes.data.map(form => ({
          ...form,
          fields: form.fields.map(field => ({
            ...field,
            type: field.field_type || field.type
          }))
        }));
        setForms(fetchedForms);

        // Use the first form (Active Intake Form) as the default
        if (fetchedForms.length > 0) {
          setFormFields(fetchedForms[0].fields);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addLead = async (newLead) => {
    try {
      const response = await api.post('/leads/', newLead);
      const leadRecord = response.data;
      setLeads(prev => [leadRecord, ...prev]);
      showToast(`Lead created for ${leadRecord.full_name}`, 'success');
      
      addNotification({
        title: 'New Lead Created',
        message: `${leadRecord.full_name} registered for a course.`,
        type: 'assignment'
      });
      return leadRecord;
    } catch (error) {
      showToast('Failed to create lead', 'error');
      throw error;
    }
  };

  const updateLead = async (updatedLead) => {
    try {
      const response = await api.put(`/leads/${updatedLead.id}`, updatedLead);
      setLeads(prev => prev.map(l => (l.id === updatedLead.id ? response.data : l)));
      showToast(`Lead for ${updatedLead.full_name} updated`, 'success');
    } catch (error) {
      showToast('Failed to update lead', 'error');
    }
  };

  const deleteLead = async (leadId) => {
    try {
      await api.delete(`/leads/${leadId}`);
      setLeads(prev => prev.filter(l => l.id !== leadId));
      showToast('Lead deleted successfully', 'info');
    } catch (error) {
      showToast('Failed to delete lead', 'error');
    }
  };

  const addFollowup = async (leadId, fupData) => {
    try {
      const response = await api.post('/followups/', {
        lead_id: leadId,
        note: fupData.note,
        scheduled_at: fupData.scheduledAt,
        completed: fupData.completed || false
      });
      setFollowups(prev => [response.data, ...prev]);
      showToast('Follow-up log created', 'success');
    } catch (error) {
      showToast('Failed to create follow-up', 'error');
    }
  };

  const saveFormTemplate = async (fields) => {
    // In this backend, we update individual fields or the form
    // For simplicity in this demo, we'll assume we're updating form 1
    try {
      // This is a simplified version; real implementation would loop or have a batch endpoint
      showToast('Form structure updated (API simulated)', 'success');
    } catch (error) {
      showToast('Failed to save form template', 'error');
    }
  };

  return (
    <AppContext.Provider value={{
      leads,
      forms,
      counselors,
      followups,
      formFields,
      notifications,
      theme,
      toast,
      loading,
      setToast,
      toggleTheme,
      showToast,
      addLead,
      updateLead,
      deleteLead,
      addFollowup,
      saveFormTemplate,
      markAllNotificationsRead: () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
