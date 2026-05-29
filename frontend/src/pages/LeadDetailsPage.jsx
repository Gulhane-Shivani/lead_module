import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Briefcase, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Plus, 
  Check, 
  Bookmark, 
  UserCheck, 
  Edit,
  ClipboardList
} from 'lucide-react';

export default function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, followups, formFields, counselors, forms, addFollowup, updateLead } = useApp();

  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  
  // Follow-up form state
  const [fupType, setFupType] = useState('Call');
  const [fupNotes, setFupNotes] = useState('');
  const [fupNewStatus, setFupNewStatus] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  // 1. Fetch Lead
  const lead = leads.find(l => String(l.id) === id);
  const leadForm = lead ? (forms || []).find(f => f.id === lead.form_id) : null;
  if (!lead) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Lead Not Found</h3>
        <p className="text-xs text-slate-400">The lead you are trying to view does not exist or has been deleted.</p>
        <Link to="/leads" className="text-xs font-bold text-indigo-500 hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  // Helper to get a field value for any formField (by id first, then by label for core fields)
  const getFormFieldValue = (field) => {
    if (!lead) return null;

    // 1. Try lookup by field_id in field_values
    const byId = (lead.field_values || []).find(v => v.field_id === field.id);
    if (byId !== undefined && byId !== null) return byId.value;

    // 2. Fallback: resolve core fields stored as direct columns on the lead
    const label = (field.label || '').toLowerCase().trim();

    // Identity fields
    if (['full name', 'name', 'student full name', 'student name'].includes(label))
      return lead.full_name;
    if (['email', 'email address', 'student email'].includes(label))
      return lead.email;
    if (['phone', 'mobile', 'phone number', 'contact number', 'mobile number'].includes(label))
      return lead.phone;

    // Status
    if (label === 'status') return lead.status;

    // Assigned Counselor — resolve name from counselors list
    if (label === 'assigned counselor' || label === 'counselor') {
      return getCounselorName(lead.counselor_id);
    }

    return null; // Will display as NA
  };

  // Group all formFields by their section for organised display
  const fieldsBySection = formFields.reduce((acc, field) => {
    const section = field.section || 'General Details';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  // Helper to parse type/notes from note string
  const getFollowupDetails = (fup) => {
    const match = (fup.note || '').match(/^\[(.*?)\] (.*)$/s);
    if (match) {
      return {
        type: match[1],
        notes: match[2]
      };
    }
    return {
      type: 'Call', // default fallback
      notes: fup.note || ''
    };
  };

  // Helper to get counselor name by ID
  const getCounselorName = (counselorId) => {
    const c = counselors.find(item => item.id === counselorId);
    return c ? c.full_name : 'Elena Rostova';
  };

  // 2. Fetch Lead Follow-ups
  const leadFollowups = followups.filter(f => String(f.lead_id) === id)
    .sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

  const mappedFollowups = leadFollowups.map(fup => {
    const details = getFollowupDetails(fup);
    const counselorName = getCounselorName(fup.counselor_id);
    const reminderDateFormatted = fup.scheduled_at ? new Date(fup.scheduled_at).toLocaleDateString() : null;
    return {
      id: fup.id,
      type: details.type,
      notes: details.notes,
      counselor: counselorName,
      reminderDate: reminderDateFormatted,
      date: fup.created_at
    };
  });

  // (custom field config no longer needed — using fieldsBySection above)

  // Handle follow-up submission
  const handleAddFollowup = (e) => {
    e.preventDefault();
    if (!fupNotes.trim()) return;

    // Save formatted type in the note
    const noteContent = `[${fupType}] ${fupNotes}`;

    addFollowup(lead.id, {
      note: noteContent,
      scheduledAt: reminderDate || undefined
    });

    // If a new status is provided, update the lead status
    if (fupNewStatus) {
      updateLead({
        id: lead.id,
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone,
        status: fupNewStatus,
        form_id: lead.form_id,
        counselor_id: lead.counselor_id
      });
    }

    // Reset state & Close
    setFupNotes('');
    setFupNewStatus('');
    setReminderDate('');
    setIsFollowupModalOpen(false);
  };

  const getFollowupIcon = (type) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Meeting':
        return <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <UserCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getFollowupColor = (type) => {
    switch (type) {
      case 'Call': return 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/30';
      case 'Email': return 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30';
      case 'WhatsApp': return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30';
      case 'Meeting': return 'bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30';
      default: return 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back navigation & Actions Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/leads" 
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        {leadForm?.name === "Active Intake Form" && (
          <Link
            to={`/leads/edit/${lead.id}`}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50/50 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Profile
          </Link>
        )}
      </div>

      {/* Student Profile Info Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/10">
              {(lead.full_name || '').split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">{lead.full_name}</h2>
                <StatusBadge status={lead.status} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>
              </p>
            </div>
          </div>
          <div className="text-left md:text-right shrink-0">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Counselor</span>
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{getCounselorName(lead.counselor_id) || 'Unassigned'}</span>
            <span className="block text-[9px] text-slate-400 mt-1">Inquiry Registered: {new Date(lead.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lead & Academic details + Custom field results */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Dynamic Form Fields — grouped by section, all fields from the active form */}
          {Object.keys(fieldsBySection).length === 0 ? (
            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Lead Information
              </h3>
              <p className="text-[11px] text-slate-400 mt-3">No form fields configured.</p>
            </div>
          ) : (
            Object.entries(fieldsBySection).map(([section, fields]) => (
              <div key={section} className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" /> {section}
                </h3>
                <div className="space-y-3.5 text-xs">
                  {fields.map((field) => {
                    const raw = getFormFieldValue(field);
                    let displayValue;
                    if (raw === true) displayValue = 'Yes';
                    else if (raw === false) displayValue = 'No';
                    else if (raw !== null && raw !== undefined && String(raw).trim() !== '') {
                      displayValue = String(raw);
                    } else {
                      displayValue = null; // will show NA
                    }
                    return (
                      <div
                        key={field.id}
                        className="border-b border-slate-100 dark:border-slate-800/40 pb-3 last:border-b-0 last:pb-0"
                      >
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {field.label}
                          {field.required && <span className="text-rose-400 ml-0.5">*</span>}
                        </span>
                        {displayValue ? (
                          <span className="text-slate-800 dark:text-slate-200 font-semibold block mt-1">
                            {displayValue}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic block mt-1 text-[11px]">NA</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Reminders & Schedules panel */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" /> Next Reminder Schedules
            </h3>
            
            {mappedFollowups.filter(f => f.reminderDate).length === 0 ? (
              <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-[10px] text-slate-400">No callbacks scheduled.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {mappedFollowups.filter(f => f.reminderDate).map((fup, i) => (
                  <div key={i} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-amber-700 dark:text-amber-400">Callback Task</span>
                      <span className="block text-[9px] text-slate-400 mt-0.5">{fup.type} Discussion</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                      {fup.reminderDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Follow-up Timeline & log actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Discussion History</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Chronological counselor engagement actions logged</p>
              </div>
              <button
                onClick={() => setIsFollowupModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-1 hover-scale shadow-md shadow-indigo-500/15"
              >
                <Plus className="w-4 h-4" /> Log Conversation
              </button>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-6 relative pl-3.5 border-l-2 border-slate-200/60 dark:border-slate-800/80 ml-2 py-1">
              {mappedFollowups.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-600 text-xs">
                  No communication history has been logged for this student yet. Click "Log Conversation" to add one.
                </div>
              ) : (
                mappedFollowups.map((fup, i) => (
                  <div key={fup.id} className="relative group">
                    {/* Circle timeline pin */}
                    <span className="absolute left-[-22px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 bg-indigo-600 z-10" />

                    <div className={`p-4 rounded-2xl border ${getFollowupColor(fup.type)}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center shadow-xs">
                            {getFollowupIcon(fup.type)}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {fup.type} Contacted
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(fup.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {fup.notes}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-200/30 dark:border-slate-800/20 pt-2.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Counselor: {fup.counselor}
                        </span>
                        {fup.reminderDate && (
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1">
                            ⏰ Reminder scheduled: {fup.reminderDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Log Follow-up Modal */}
      <Modal
        isOpen={isFollowupModalOpen}
        onClose={() => setIsFollowupModalOpen(false)}
        title={`Log Discussion for ${lead.full_name}`}
        size="md"
      >
        <form onSubmit={handleAddFollowup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Follow-up Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Contact Method
              </label>
              <select
                value={fupType}
                onChange={(e) => setFupType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:text-slate-300"
              >
                <option value="Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email Outbox</option>
                <option value="Meeting">Meeting Visit</option>
              </select>
            </div>

            {/* New Lead Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Update Lead Status (Optional)
              </label>
              <select
                value={fupNewStatus}
                onChange={(e) => setFupNewStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:text-slate-300"
              >
                <option value="">Keep current ({lead.status})</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Follow-Up Pending">Follow-Up Pending</option>
                <option value="Admission Confirmed">Admission Confirmed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Discussion Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Discussion Summary Notes *
            </label>
            <textarea
              placeholder="What was discussed? e.g., Requested prospectus, compared pricing, promised weekend slots..."
              required
              rows={3}
              value={fupNotes}
              onChange={(e) => setFupNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:text-slate-300 resize-none"
            />
          </div>

          {/* Callback Reminder Schedule */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Schedule Next Callback Reminder (Optional)
            </label>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:text-slate-300"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <button
              type="button"
              onClick={() => setIsFollowupModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-500/10"
            >
              Log Log & Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
