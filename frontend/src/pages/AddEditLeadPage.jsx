import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DynamicFormRenderer from '../components/Common/DynamicFormRenderer';
import { ArrowLeft, UserPlus, ClipboardEdit } from 'lucide-react';

export default function AddEditLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, formFields, addLead, updateLead } = useApp();

  const isEditMode = !!id;
  const leadToEdit = isEditMode ? leads.find(l => l.id === id) : null;

  // Render error state if edit ID specified but lead not found
  if (isEditMode && !leadToEdit) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Lead Record Not Found</h3>
        <p className="text-xs text-slate-400">The lead you are trying to edit does not exist or was deleted.</p>
        <Link to="/leads" className="text-xs font-bold text-indigo-500 hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  // Prep initial form values
  const getInitialValues = () => {
    if (!isEditMode) return {
      name: '',
      email: '',
      phone: '',
      course: '',
      source: '',
      counselor: '',
      status: 'New',
      notes: ''
    };

    // Combine standard fields and customFields responses for hook-form
    return {
      f_name: leadToEdit.name,
      f_email: leadToEdit.email,
      f_phone: leadToEdit.phone,
      f_course: leadToEdit.course,
      f_source: leadToEdit.source,
      f_counselor: leadToEdit.counselor,
      f_status: leadToEdit.status,
      f_notes: leadToEdit.notes,
      ...leadToEdit.customFields // Load custom fields inputs
    };
  };

  const handleFormSubmit = (data) => {
    // Map values back to lead schema
    // 1. Extract core defaults
    const coreFields = {
      name: data.f_name,
      email: data.f_email,
      phone: data.f_phone,
      course: data.f_course,
      source: data.f_source,
      counselor: data.f_counselor,
      status: data.f_status,
      notes: data.f_notes
    };

    // 2. Anything else is a custom field response
    const defaultFieldIds = ['f_name', 'f_email', 'f_phone', 'f_course', 'f_source', 'f_counselor', 'f_status', 'f_notes'];
    const customFields = {};
    Object.keys(data).forEach((key) => {
      if (!defaultFieldIds.includes(key)) {
        customFields[key] = data[key];
      }
    });

    if (isEditMode) {
      updateLead({
        ...leadToEdit,
        ...coreFields,
        customFields
      });
      navigate(`/leads/${leadToEdit.id}`);
    } else {
      const created = addLead({
        ...coreFields,
        customFields
      });
      navigate('/leads');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link 
          to={isEditMode ? `/leads/${leadToEdit.id}` : "/leads"}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Go Back
        </Link>
      </div>

      {/* Page Title Panel */}
      <div className="glass-panel p-6 rounded-3xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
          {isEditMode ? <ClipboardEdit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-800 dark:text-slate-100">
            {isEditMode ? `Modify Details: ${leadToEdit.name}` : 'Register New Student Lead'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEditMode ? 'Make adjustments to lead status or custom fields answers below.' : 'Populate details to assign counselor and course preferences.'}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
        <DynamicFormRenderer
          fields={formFields}
          defaultValues={getInitialValues()}
          onSubmit={handleFormSubmit}
          buttonText={isEditMode ? "Save Changes" : "Create Lead"}
        />
      </div>
    </div>
  );
}
