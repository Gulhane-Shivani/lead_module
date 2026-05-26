/**
 * Export data array to a CSV file.
 * Handles proper character escaping for quotes and commas.
 */
export function exportToCSV(data, filename = 'leads_export.csv') {
  if (!data || !data.length) return;

  const headers = [
    'ID', 
    'Name', 
    'Email', 
    'Phone', 
    'Course of Interest', 
    'Source', 
    'Assigned Counselor', 
    'Status', 
    'Date Created', 
    'Notes'
  ];

  const csvRows = [
    headers.join(','), // Header row
    ...data.map(item => {
      const values = [
        item.id,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${(item.phone || '')}"`,
        `"${(item.course || '').replace(/"/g, '""')}"`,
        `"${(item.source || '').replace(/"/g, '""')}"`,
        `"${(item.counselor || '').replace(/"/g, '""')}"`,
        `"${(item.status || '')}"`,
        `"${(item.dateCreated || '')}"`,
        `"${(item.notes || '').replace(/\r?\n|\r/g, ' ').replace(/"/g, '""')}"`
      ];
      return values.join(',');
    })
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export default exportToCSV;
