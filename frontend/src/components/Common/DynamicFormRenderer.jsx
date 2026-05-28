import React from 'react';
import { useForm } from 'react-hook-form';

export default function DynamicFormRenderer({ fields, defaultValues, onSubmit, buttonText }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  });

  const renderField = (field) => {
    const commonClasses = "w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";
    
    switch (field.field_type) {
      case 'dropdown':
        return (
          <select {...register(String(field.id), { required: field.required })} className={commonClasses}>
            <option value="">{field.placeholder || 'Select...'}</option>
            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="flex gap-4">
            {field.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" {...register(String(field.id), { required: field.required })} value={opt} />
                {opt}
              </label>
            ))}
          </div>
        );
      case 'textarea':
        return <textarea {...register(String(field.id), { required: field.required })} placeholder={field.placeholder} className={commonClasses} />;
      default:
        return (
          <input 
            type={field.field_type} 
            {...register(String(field.id), { required: field.required })} 
            placeholder={field.placeholder} 
            className={commonClasses} 
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map(field => (
        <div key={field.id} className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </label>
          {renderField(field)}
          {errors[field.id] && <span className="text-xs text-rose-500">This field is required</span>}
        </div>
      ))}
      <button type="submit" className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors">
        {buttonText}
      </button>
    </form>
  );
}
