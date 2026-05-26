import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../services/db';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [leads, setLeads] = useState(() => db.getLeads());
  const [followups, setFollowups] = useState(() => db.getFollowups());
  const [formFields, setFormFields] = useState(() => db.getFormFields());
  const [notifications, setNotifications] = useState(() => db.getNotifications());
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
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      db.saveNotifications(updated);
      return updated;
    });
  };

  const addLead = (newLead) => {
    const leadRecord = {
      ...newLead,
      id: `lead_${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0],
      customFields: newLead.customFields || {}
    };
    setLeads(prev => {
      const updated = [leadRecord, ...prev];
      db.saveLeads(updated);
      return updated;
    });
    
    showToast(`Lead created for ${leadRecord.name}`, 'success');

    // Create system notification
    addNotification({
      title: 'New Lead Created',
      message: `${leadRecord.name} registered for ${leadRecord.course || 'a course'}.`,
      type: 'assignment'
    });

    return leadRecord;
  };

  const updateLead = (updatedLead) => {
    setLeads(prev => {
      const updated = prev.map(l => (l.id === updatedLead.id ? updatedLead : l));
      db.saveLeads(updated);
      return updated;
    });
    showToast(`Lead for ${updatedLead.name} updated`, 'success');
  };

  const deleteLead = (leadId) => {
    let leadName = '';
    setLeads(prev => {
      const target = prev.find(l => l.id === leadId);
      leadName = target ? target.name : '';
      const updated = prev.filter(l => l.id !== leadId);
      db.saveLeads(updated);
      return updated;
    });
    
    // Clean up follow-ups
    setFollowups(prev => {
      const updatedFups = prev.filter(f => f.leadId !== leadId);
      db.saveFollowups(updatedFups);
      return updatedFups;
    });

    showToast(`Lead ${leadName} deleted successfully`, 'info');
  };

  const addFollowup = (leadId, fupData) => {
    const newFup = {
      ...fupData,
      id: `fup_${Date.now()}`,
      leadId,
      date: new Date().toISOString(),
    };
    
    setFollowups(prev => {
      const updatedFups = [newFup, ...prev];
      db.saveFollowups(updatedFups);
      return updatedFups;
    });

    // Update lead status if specified
    if (fupData.newStatus) {
      setLeads(prev => {
        const updatedLeads = prev.map(l => {
          if (l.id === leadId) {
            return { ...l, status: fupData.newStatus };
          }
          return l;
        });
        db.saveLeads(updatedLeads);
        return updatedLeads;
      });
    }

    showToast(`Follow-up log created (${fupData.type})`, 'success');
  };

  const saveFormTemplate = (fields) => {
    setFormFields(fields);
    db.saveFormFields(fields);
    showToast('Lead Form Fields saved successfully!', 'success');
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      db.saveNotifications(updated);
      return updated;
    });
    showToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider value={{
      leads,
      followups,
      formFields,
      notifications,
      theme,
      toast,
      setToast,
      toggleTheme,
      showToast,
      addLead,
      updateLead,
      deleteLead,
      addFollowup,
      saveFormTemplate,
      markAllNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
