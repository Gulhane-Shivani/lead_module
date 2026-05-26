import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DynamicFormRenderer from '../components/Common/DynamicFormRenderer';
import { 
  Type, 
  Mail, 
  Binary, 
  ChevronDown, 
  CheckSquare, 
  CircleDot, 
  Calendar, 
  AlignLeft, 
  Upload, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Wrench, 
  Save, 
  Settings,
  AlertTriangle
} from 'lucide-react';

export default function FormBuilderPage() {
  const { formFields, saveFormTemplate } = useApp();
  
  // Local state for builder drafts
  const [fields, setFields] = useState([...formFields]);
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'preview'

  // Standard core field IDs (should not be deleted)
  const defaultFieldIds = ['f_name', 'f_email', 'f_phone', 'f_course', 'f_source', 'f_counselor', 'f_status', 'f_notes'];

  // Add field helper
  const handleAddField = (type) => {
    const customId = `custom_${Date.now()}`;
    const newField = {
      id: customId,
      type: type,
      section: 'Custom Section',
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter value`,
      required: false,
      validation: {},
      options: ['Option A', 'Option B', 'Option C'] // default options for selects/radios
    };
    setFields([...fields, newField]);
  };

  // Delete field helper
  const handleDeleteField = (id) => {
    if (defaultFieldIds.includes(id)) return; // Protection
    setFields(fields.filter(f => f.id !== id));
  };

  // Update field field properties
  const handleUpdateField = (id, property, value) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        // Handle nested validation object or basic properties
        if (property.startsWith('validation.')) {
          const valProp = property.split('.')[1];
          return {
            ...f,
            validation: {
              ...f.validation,
              [valProp]: value
            }
          };
        }
        return { ...f, [property]: value };
      }
      return f;
    }));
  };

  // Reordering helpers
  const handleMoveField = (index, direction) => {
    const newFields = [...fields];
    if (direction === 'up' && index > 0) {
      const temp = newFields[index - 1];
      newFields[index - 1] = newFields[index];
      newFields[index] = temp;
    } else if (direction === 'down' && index < newFields.length - 1) {
      const temp = newFields[index + 1];
      newFields[index + 1] = newFields[index];
      newFields[index] = temp;
    }
    setFields(newFields);
  };

  const handleSaveLayout = () => {
    saveFormTemplate(fields);
  };

  const toolboxItems = [
    { type: 'text', label: 'Single Line Text', icon: <Type className="w-4 h-4" /> },
    { type: 'email', label: 'Email Field', icon: <Mail className="w-4 h-4" /> },
    { type: 'number', label: 'Number Field', icon: <Binary className="w-4 h-4" /> },
    { type: 'dropdown', label: 'Select Dropdown', icon: <ChevronDown className="w-4 h-4" /> },
    { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="w-4 h-4" /> },
    { type: 'radio', label: 'Radio Button Group', icon: <CircleDot className="w-4 h-4" /> },
    { type: 'date picker', label: 'Date Picker', icon: <Calendar className="w-4 h-4" /> },
    { type: 'textarea', label: 'Multi-line Notes', icon: <AlignLeft className="w-4 h-4" /> },
    { type: 'file upload', label: 'File Attachment', icon: <Upload className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Inquiry Form Builder</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Customize layout, validations, and sections for student intake forms.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Tabs switch */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex border border-slate-200/50 dark:border-slate-850">
            <button
              onClick={() => setActiveTab('design')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'design' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" /> Designer Canvas
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'preview' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-655 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          <button
            onClick={handleSaveLayout}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-md shadow-indigo-500/10 flex items-center gap-1.5 hover-scale"
          >
            <Save className="w-4 h-4" /> Save Form Schema
          </button>
        </div>
      </div>

      {activeTab === 'design' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left panel: Fields Toolbox */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3.5 uppercase tracking-wider">
                Field Inputs Toolbox
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4 leading-normal">
                Click any control below to append a fresh dynamic custom field onto the canvas.
              </p>
              
              <div className="space-y-2">
                {toolboxItems.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAddField(item.type)}
                    className="w-full p-3 rounded-xl border border-slate-100 hover:border-indigo-500/30 dark:border-slate-800/40 dark:hover:border-indigo-500/20 bg-white/50 dark:bg-slate-900/20 hover:bg-indigo-500/5 dark:hover:bg-indigo-950/10 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-3 transition-all duration-150"
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-500">
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Canvas editor */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Active Intake Fields Canvas
                </h3>
                <span className="text-[10px] text-slate-400">Total Fields: {fields.length}</span>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {fields.map((field, idx) => {
                  const isSystemDefault = defaultFieldIds.includes(field.id);
                  return (
                    <div 
                      key={field.id}
                      className={`p-4 rounded-2xl border ${
                        isSystemDefault 
                          ? 'border-slate-200/60 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/10' 
                          : 'border-indigo-500/20 dark:border-indigo-500/10 bg-indigo-500/5'
                      } space-y-4`}
                    >
                      {/* Top header row */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-indigo-500 uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/20">
                            {field.type}
                          </span>
                          {isSystemDefault && (
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 uppercase">
                              🔒 Core Field
                            </span>
                          )}
                        </div>

                        {/* Order & delete controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveField(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveField(idx, 'down')}
                            disabled={idx === fields.length - 1}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {!isSystemDefault && (
                            <button
                              onClick={() => handleDeleteField(field.id)}
                              className="p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 ml-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Configurations inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {/* Label Edit */}
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field Label</span>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850"
                          />
                        </div>

                        {/* Placeholder Edit (skipped for check/radio) */}
                        {field.type !== 'checkbox' && field.type !== 'radio' && (
                          <div className="space-y-1">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placeholder</span>
                            <input
                              type="text"
                              value={field.placeholder || ''}
                              onChange={(e) => handleUpdateField(field.id, 'placeholder', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850"
                            />
                          </div>
                        )}

                        {/* Form Section Grouping */}
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Form Section</span>
                          <input
                            type="text"
                            value={field.section || 'General Details'}
                            onChange={(e) => handleUpdateField(field.id, 'section', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850"
                          />
                        </div>
                      </div>

                      {/* Dropdown / Radio options configurator */}
                      {(field.type === 'dropdown' || field.type === 'radio') && (
                        <div className="space-y-1.5 text-xs">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Option choices (comma separated)
                          </span>
                          <input
                            type="text"
                            value={(field.options || []).join(', ')}
                            onChange={(e) => handleUpdateField(field.id, 'options', e.target.value.split(',').map(s => s.trim()))}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}

                      {/* Extra configurations: validation requirements */}
                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        <label className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!field.required}
                            onChange={(e) => handleUpdateField(field.id, 'required', e.target.checked)}
                            className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                          />
                          <span>Required/Mandatory field</span>
                        </label>

                        {field.type === 'text' && (
                          <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400">
                            <span>Min Length validation:</span>
                            <input
                              type="number"
                              value={field.validation?.minLength || ''}
                              onChange={(e) => handleUpdateField(field.id, 'validation.minLength', e.target.value)}
                              className="w-12 px-1.5 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded"
                              placeholder="0"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Live Preview tab */
        <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-4xl mx-auto space-y-6">
          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-slate-600 dark:text-slate-400 leading-normal">
              <strong>Form Sandbox Mode:</strong> This renders what the student lead creation/edit page will look like. 
              Clicking the submit button below will trigger a success toast event but will not submit lead data into local storage.
            </div>
          </div>

          <div className="border border-slate-200/50 dark:border-slate-800/40 p-6 sm:p-8 rounded-3xl bg-slate-50/40 dark:bg-slate-900/10">
            <DynamicFormRenderer
              fields={fields}
              onSubmit={(data) => {
                console.log("Mock form submission details:", data);
                alert("Dynamic Form Validated and submitted successfully! (Sandbox check passed)");
              }}
              buttonText="Test Sandbox Submit"
            />
          </div>
        </div>
      )}
    </div>
  );
}
