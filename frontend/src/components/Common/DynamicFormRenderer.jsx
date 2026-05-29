import React from 'react';
import { useForm } from 'react-hook-form';

const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Interested',
  'Follow-Up Pending',
  'Admission Confirmed',
  'Rejected',
];

export default function DynamicFormRenderer({
  fields,
  counselors = [],
  defaultValues,
  onSubmit,
  buttonText,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const commonClasses =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm text-slate-800 dark:text-slate-200 transition-all duration-150';

  const renderField = (field) => {
    const fType = field.field_type || field.type;
    const fieldLabel = (field.label || '').toLowerCase().trim();

    // ── Special: Assigned Counselor → dynamic dropdown from DB ──
    if (fieldLabel === 'assigned counselor') {
      return (
        <select
          {...register(String(field.id))}
          className={commonClasses}
        >
          <option value="">— Select Counselor —</option>
          {counselors.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.full_name}
              {c.role === 'admin' ? '  (Admin)' : ''}
            </option>
          ))}
        </select>
      );
    }

    // ── Special: Status → fixed status dropdown ──
    if (fieldLabel === 'status') {
      return (
        <select
          {...register(String(field.id))}
          className={commonClasses}
          defaultValue={defaultValues?.[String(field.id)] || ''}
        >
          <option value="">— Select Status —</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      );
    }

    // ── Map backend field_type to HTML input type ──
    let htmlType = fType;
    if (htmlType === 'date picker') htmlType = 'date';
    if (htmlType === 'number') htmlType = 'number';

    switch (fType) {
      case 'dropdown':
        return (
          <select
            {...register(String(field.id), { required: field.required })}
            className={commonClasses}
          >
            <option value="">{field.placeholder || 'Enter value'}</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="flex flex-wrap gap-4 pt-1">
            {(field.options || []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm cursor-pointer text-slate-700 dark:text-slate-300"
              >
                <input
                  type="radio"
                  {...register(String(field.id), { required: field.required })}
                  value={opt}
                  className="accent-indigo-600"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex flex-wrap gap-4 pt-1">
            {(field.options || []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm cursor-pointer text-slate-700 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  {...register(String(field.id))}
                  value={opt}
                  className="accent-indigo-600 w-4 h-4"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            {...register(String(field.id), { required: field.required })}
            placeholder={field.placeholder || ''}
            rows={3}
            className={`${commonClasses} resize-none`}
          />
        );

      default:
        return (
          <input
            type={htmlType || 'text'}
            {...register(String(field.id), { required: field.required })}
            placeholder={field.placeholder || ''}
            className={commonClasses}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {fields.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide">
            {field.label}{' '}
            {field.required && <span className="text-rose-500">*</span>}
          </label>
          {renderField(field)}
          {errors[String(field.id)] && (
            <span className="text-[11px] text-rose-500 font-medium">
              This field is required
            </span>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 mt-2"
      >
        {buttonText}
      </button>
    </form>
  );
}
