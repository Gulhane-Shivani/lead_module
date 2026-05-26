import { 
  INITIAL_LEADS, 
  INITIAL_FOLLOWUPS, 
  DEFAULT_FORM_FIELDS,
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

const KEYS = {
  LEADS: 'edulead_crm_leads',
  FOLLOWUPS: 'edulead_crm_followups',
  FORM_FIELDS: 'edulead_crm_form_fields',
  NOTIFICATIONS: 'edulead_crm_notifications',
};

export const db = {
  init() {
    try {
      if (!localStorage.getItem(KEYS.LEADS)) {
        localStorage.setItem(KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
      }
      if (!localStorage.getItem(KEYS.FOLLOWUPS)) {
        localStorage.setItem(KEYS.FOLLOWUPS, JSON.stringify(INITIAL_FOLLOWUPS));
      }
      if (!localStorage.getItem(KEYS.FORM_FIELDS)) {
        localStorage.setItem(KEYS.FORM_FIELDS, JSON.stringify(DEFAULT_FORM_FIELDS));
      }
      if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
    } catch (e) {
      console.error('Failed to initialize local storage database:', e);
    }
  },

  getLeads() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(KEYS.LEADS)) || [];
    } catch {
      return INITIAL_LEADS;
    }
  },

  saveLeads(leads) {
    try {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  },

  getFollowups() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(KEYS.FOLLOWUPS)) || [];
    } catch {
      return INITIAL_FOLLOWUPS;
    }
  },

  saveFollowups(followups) {
    try {
      localStorage.setItem(KEYS.FOLLOWUPS, JSON.stringify(followups));
    } catch (e) {
      console.error(e);
    }
  },

  getFormFields() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(KEYS.FORM_FIELDS)) || [];
    } catch {
      return DEFAULT_FORM_FIELDS;
    }
  },

  saveFormFields(fields) {
    try {
      localStorage.setItem(KEYS.FORM_FIELDS, JSON.stringify(fields));
    } catch (e) {
      console.error(e);
    }
  },

  getNotifications() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [];
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifications) {
    try {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }
};
export default db;
