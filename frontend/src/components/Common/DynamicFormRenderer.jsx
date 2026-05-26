import React from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';

export default function DynamicFormRenderer({ 
  fields = [], 
  onSubmit, 
  defaultValues = {}, 
  buttonText = "Submit Details", 
  isReadOnly = false 
}) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch
  } = useForm({
    defaultValues: defaultValues
  });

  // Group fields by section (fallback to 'General Details' if empty)
  const sections = fields.reduce((acc, field) => {
    const sectionName = field.section || 'General Details';
    if (!acc[sectionName]) acc[sectionName] = [];
    acc[sectionName].push(field);
    return acc;
  }, {});

  const renderField = (field) => {
    const isRequired = field.required;
    const commonInputClass = `
      w-full px-4 py-2.5 rounded-xl border bg-white/70 dark:bg-slate-900/40 text-sm
      border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200
      placeholder-slate-400 dark:placeholder-slate-500
      focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
      disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150
    `;

    // Registration config
    const registerOptions = {
      required: isRequired ? `${field.label} is required` : false
    };

    if (field.type === 'email') {
      registerOptions.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      };
    }

    if (field.validation?.minLength) {
      registerOptions.minLength = {
        value: Number(field.validation.minLength),
        message: `${field.label} must be at least ${field.validation.minLength} characters`
      };
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {field.label} {isRequired && <span className="text-rose-500">*</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder || ''}
              disabled={isReadOnly}
              {...register(field.id, registerOptions)}
              className={commonInputClass}
            />
            {errors[field.id] && (
              <p className="text-[11px] font-bold text-rose-500">{errors[field.id].message}</p>
            )}
          </div>
        );

      case 'date picker':
      case 'date':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {field.label} {isRequired && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="date"
              disabled={isReadOnly}
              {...register(field.id, registerOptions)}
              className={commonInputClass}
            />
            {errors[field.id] && (
              <p className="text-[11px] font-bold text-rose-500">{errors[field.id].message}</p>
            )}
          </div>
        );

      case 'dropdown':
        const optionsList = field.options || [];
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {field.label} {isRequired && <span className="text-rose-500">*</span>}
            </label>
            <select
              disabled={isReadOnly}
              {...register(field.id, registerOptions)}
              className={`${commonInputClass} cursor-pointer appearance-none`}
            >
              <option value="">{field.placeholder || 'Select option'}</option>
              {optionsList.map((opt, i) => (
                <option key={i} value={opt} className="dark:bg-slate-900">{opt}</option>
              ))}
            </select>
            {errors[field.id] && (
              <p className="text-[11px] font-bold text-rose-500">{errors[field.id].message}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {field.label} {isRequired && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder || ''}
              disabled={isReadOnly}
              rows={4}
              {...register(field.id, registerOptions)}
              className={`${commonInputClass} resize-none`}
            />
            {errors[field.id] && (
              <p className="text-[11px] font-bold text-rose-500">{errors[field.id].message}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-start gap-2.5 py-1 md:col-span-2">
            <input
              type="checkbox"
              id={field.id}
              disabled={isReadOnly}
              {...register(field.id, registerOptions)}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900/40 dark:border-slate-800"
            />
            <div className="space-y-0.5">
              <label htmlFor={field.id} className="block text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                {field.label} {isRequired && <span className="text-rose-500">*</span>}
              </label>
              {field.placeholder && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{field.placeholder}</span>
              )}
              {errors[field.id] && (
                <p className="text-[11px] font-bold text-rose-500">{errors[field.id].message}</p>
              )}
            </div>
          </div>
        );

      case 'radio':
        const radioOpts = field.options || [];
        return (
          <div key={field.id} className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {field.label} {isRequired && <span className="text-rose-500">*</span>}
            </label>
            <div className="flex flex-wrap gap-4 pt-1">
              {radioOpts.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="radio"
                    value={opt}
                    disabled={isReadOnly}
                    {...register(field.id, registerOptions)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:bg-slate-900/40 dark:border-slate-800"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {errors[field.id] && (
              <p className="text-[11px] font-bold text-rose-500">{errors[field.id].message}</p>
            )}
          </div>
        );

      case 'file upload':
        return (
          <div key={field.id} className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {field.label} {isRequired && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors duration-150">
              <input
                type="file"
                disabled={isReadOnly}
                {...register(field.id, registerOptions)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {field.placeholder || "Click to upload files or drag here"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, JPG (Max 5MB)</p>
            </div>
            {errors[field.id] && (
              <p className="text-[11px] font-bold text-rose-500">{errors[field.id].message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {Object.keys(sections).map((sectionName) => (
        <div key={sectionName} className="space-y-4">
          <div className="flex items-center gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {sectionName}
            </h4>
            <div className="h-px bg-slate-200/60 dark:bg-slate-800/40 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {sections[sectionName].map((field) => renderField(field))}
          </div>
        </div>
      ))}

      {!isReadOnly && (
        <div className="flex justify-end pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-102 active:scale-98 transition-all duration-150 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : buttonText}
          </button>
        </div>
      )}
    </form>
  );
}
