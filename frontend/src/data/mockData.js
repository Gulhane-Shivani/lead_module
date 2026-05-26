// Initial mock datasets for Educational CRM/HRMS Lead Management System

export const INITIAL_COURSES = [
  { id: 'c1', name: 'B.Tech Computer Science' },
  { id: 'c2', name: 'Master of Business Administration (MBA)' },
  { id: 'c3', name: 'M.Tech Data Science & AI' },
  { id: 'c4', name: 'B.Sc Clinical Psychology' },
  { id: 'c5', name: 'Digital Marketing Specialist' },
  { id: 'c6', name: 'Bachelor of Design (B.Des)' }
];

export const INITIAL_COUNSELORS = [
  { id: 'cn1', name: 'Sarah Connor', email: 'sarah.c@edulead.com', avatar: 'SC', activeLeads: 24, conversionRate: 72 },
  { id: 'cn2', name: 'David Miller', email: 'david.m@edulead.com', avatar: 'DM', activeLeads: 18, conversionRate: 64 },
  { id: 'cn3', name: 'Elena Rostova', email: 'elena.r@edulead.com', avatar: 'ER', activeLeads: 31, conversionRate: 81 },
  { id: 'cn4', name: 'Michael Chang', email: 'michael.c@edulead.com', avatar: 'MC', activeLeads: 15, conversionRate: 55 }
];

export const DEFAULT_FORM_FIELDS = [
  {
    id: 'f_name',
    section: 'Basic Info',
    type: 'text',
    label: 'Student Full Name',
    placeholder: 'Enter student\'s full name',
    required: true,
    validation: { minLength: 2 }
  },
  {
    id: 'f_email',
    section: 'Basic Info',
    type: 'email',
    label: 'Email Address',
    placeholder: 'studentname@example.com',
    required: true,
    validation: {}
  },
  {
    id: 'f_phone',
    section: 'Basic Info',
    type: 'number',
    label: 'Phone Number',
    placeholder: 'e.g., 9876543210',
    required: true,
    validation: { minLength: 10 }
  },
  {
    id: 'f_course',
    section: 'Academic Preference',
    type: 'dropdown',
    label: 'Course of Interest',
    placeholder: 'Select a course',
    required: true,
    options: ['B.Tech Computer Science', 'Master of Business Administration (MBA)', 'M.Tech Data Science & AI', 'B.Sc Clinical Psychology', 'Digital Marketing Specialist', 'Bachelor of Design (B.Des)'],
    validation: {}
  },
  {
    id: 'f_source',
    section: 'Source Details',
    type: 'dropdown',
    label: 'Lead Source',
    placeholder: 'Where did you hear about us?',
    required: false,
    options: ['Google Search', 'Facebook Ads', 'LinkedIn', 'Instagram', 'Friend Referral', 'Educational Fair'],
    validation: {}
  },
  {
    id: 'f_counselor',
    section: 'Internal Assignment',
    type: 'dropdown',
    label: 'Assigned Counselor',
    placeholder: 'Select counselor',
    required: true,
    options: ['Sarah Connor', 'David Miller', 'Elena Rostova', 'Michael Chang'],
    validation: {}
  },
  {
    id: 'f_status',
    section: 'Internal Assignment',
    type: 'dropdown',
    label: 'Lead Status',
    placeholder: 'Set current status',
    required: true,
    options: ['New', 'Contacted', 'Interested', 'Follow-Up Pending', 'Admission Confirmed', 'Rejected'],
    validation: {}
  },
  {
    id: 'f_notes',
    section: 'Academic Preference',
    type: 'textarea',
    label: 'Counselor Notes',
    placeholder: 'Enter additional details or discussion notes...',
    required: false,
    validation: {}
  }
];

export const INITIAL_LEADS = [
  {
    id: 'lead_1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@gmail.com',
    phone: '9812345670',
    course: 'B.Tech Computer Science',
    source: 'Google Search',
    counselor: 'Elena Rostova',
    status: 'Admission Confirmed',
    dateCreated: '2026-05-01',
    notes: 'Aarav is highly motivated, scored 94% in high school. Prefers AI specialization. Paid admission token fee.',
    customFields: {}
  },
  {
    id: 'lead_2',
    name: 'Sophia Patel',
    email: 'sophia.patel@yahoo.com',
    phone: '9823456781',
    course: 'Master of Business Administration (MBA)',
    source: 'LinkedIn',
    counselor: 'Sarah Connor',
    status: 'Interested',
    dateCreated: '2026-05-08',
    notes: 'Has 2 years of work experience in software sales. Looking for scholarship details.',
    customFields: {}
  },
  {
    id: 'lead_3',
    name: 'Kabir Malhotra',
    email: 'kabir.malhotra@outlook.com',
    phone: '9834567892',
    course: 'M.Tech Data Science & AI',
    source: 'Facebook Ads',
    counselor: 'David Miller',
    status: 'Follow-Up Pending',
    dateCreated: '2026-05-15',
    notes: 'Needs to check if online class option is available. Schedule demo session next Monday.',
    customFields: {}
  },
  {
    id: 'lead_4',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gmail.com',
    phone: '9845678903',
    course: 'B.Sc Clinical Psychology',
    source: 'Friend Referral',
    counselor: 'Elena Rostova',
    status: 'New',
    dateCreated: '2026-05-25',
    notes: 'Inquiry received via website form. Parents in Bangalore, want to schedule hostel tour.',
    customFields: {}
  },
  {
    id: 'lead_5',
    name: 'Rohan Joshi',
    email: 'rohan.joshi@rediffmail.com',
    phone: '9856789014',
    course: 'Digital Marketing Specialist',
    source: 'Instagram',
    counselor: 'Michael Chang',
    status: 'Contacted',
    dateCreated: '2026-05-20',
    notes: 'Called him yesterday. He is currently working. Wanted weekend batch options.',
    customFields: {}
  },
  {
    id: 'lead_6',
    name: 'Emily Watson',
    email: 'emily.watson@gmail.com',
    phone: '9867890125',
    course: 'Bachelor of Design (B.Des)',
    source: 'Educational Fair',
    counselor: 'Sarah Connor',
    status: 'Rejected',
    dateCreated: '2026-05-03',
    notes: 'Inquired but course fee was too high. Refused to opt for education loan.',
    customFields: {}
  },
  {
    id: 'lead_7',
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    phone: '9878901236',
    course: 'B.Tech Computer Science',
    source: 'Google Search',
    counselor: 'Elena Rostova',
    status: 'Interested',
    dateCreated: '2026-05-12',
    notes: 'Good score in entrance exams. Comparing with other local institutes.',
    customFields: {}
  },
  {
    id: 'lead_8',
    name: 'Kiara Sen',
    email: 'kiara.sen@outlook.com',
    phone: '9889012347',
    course: 'Bachelor of Design (B.Des)',
    source: 'Instagram',
    counselor: 'David Miller',
    status: 'Admission Confirmed',
    dateCreated: '2026-05-18',
    notes: 'Incredible sketching portfolio. Accepted admission offer and submitted documents.',
    customFields: {}
  },
  {
    id: 'lead_9',
    name: 'Aditya Roy',
    email: 'aditya.roy@yahoo.com',
    phone: '9890123458',
    course: 'Master of Business Administration (MBA)',
    source: 'LinkedIn',
    counselor: 'Sarah Connor',
    status: 'Follow-Up Pending',
    dateCreated: '2026-05-24',
    notes: 'Requested brochure for placement reports. Call scheduled for tomorrow morning.',
    customFields: {}
  },
  {
    id: 'lead_10',
    name: 'Zoe Cooper',
    email: 'zoe.cooper@gmail.com',
    phone: '9901234569',
    course: 'B.Sc Clinical Psychology',
    source: 'Google Search',
    counselor: 'Michael Chang',
    status: 'New',
    dateCreated: '2026-05-26',
    notes: 'Fresh inquiry. Intrigued by counseling internship tie-ups.',
    customFields: {}
  }
];

export const INITIAL_FOLLOWUPS = [
  {
    id: 'fup_1',
    leadId: 'lead_1',
    type: 'Call',
    notes: 'Called student to discuss course structure. He was interested and requested fee bifurcation.',
    date: '2026-05-02T10:30:00Z',
    counselor: 'Elena Rostova'
  },
  {
    id: 'fup_2',
    leadId: 'lead_1',
    type: 'WhatsApp',
    notes: 'Sent fee bifurcation PDF and campus tour video link.',
    date: '2026-05-02T11:00:00Z',
    counselor: 'Elena Rostova'
  },
  {
    id: 'fup_3',
    leadId: 'lead_1',
    type: 'Meeting',
    notes: 'Personal campus visit with parents. Discussed scholarships. Confirmed token fee payment.',
    date: '2026-05-05T14:00:00Z',
    counselor: 'Elena Rostova'
  },
  {
    id: 'fup_4',
    leadId: 'lead_2',
    type: 'Email',
    notes: 'Sent MBA curriculum syllabus, placement statistics, and corporate networking documents.',
    date: '2026-05-09T09:15:00Z',
    counselor: 'Sarah Connor'
  },
  {
    id: 'fup_5',
    leadId: 'lead_2',
    type: 'Call',
    notes: 'Followed up on email. Student requested details regarding weekend hybrid option.',
    date: '2026-05-12T16:45:00Z',
    counselor: 'Sarah Connor'
  },
  {
    id: 'fup_6',
    leadId: 'lead_3',
    type: 'Call',
    notes: 'Introductory call. Student asked if placement support includes international tie-ups.',
    date: '2026-05-16T12:00:00Z',
    counselor: 'David Miller'
  },
  {
    id: 'fup_7',
    leadId: 'lead_5',
    type: 'Call',
    notes: 'Outreached to Rohan. He was busy in office, requested a callback on Sunday.',
    date: '2026-05-21T18:00:00Z',
    counselor: 'Michael Chang'
  },
  {
    id: 'fup_8',
    leadId: 'lead_6',
    type: 'Email',
    notes: 'Sent B.Des fee breakup. Advised student on student loan partners.',
    date: '2026-05-04T10:00:00Z',
    counselor: 'Sarah Connor'
  },
  {
    id: 'fup_9',
    leadId: 'lead_6',
    type: 'Call',
    notes: 'Followed up regarding loan application. Student declined saying family decided against loan burdens.',
    date: '2026-05-07T11:30:00Z',
    counselor: 'Sarah Connor'
  },
  {
    id: 'fup_10',
    leadId: 'lead_8',
    type: 'Call',
    notes: 'Discussed portfolio reviews. Standard B.Des portfolio approved by HOD.',
    date: '2026-05-19T10:15:00Z',
    counselor: 'David Miller'
  },
  {
    id: 'fup_11',
    leadId: 'lead_8',
    type: 'Meeting',
    notes: 'Token fee verified. Handed admission confirmation kit.',
    date: '2026-05-20T16:00:00Z',
    counselor: 'David Miller'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'New Lead Assigned',
    message: 'Ananya Iyer has been assigned to Elena Rostova.',
    time: '5 mins ago',
    type: 'assignment',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Follow-Up Pending',
    message: 'Aditya Roy is waiting for placement brochures.',
    time: '2 hours ago',
    type: 'warning',
    read: false
  },
  {
    id: 'notif_3',
    title: 'Admission Target Reached!',
    message: 'Elena Rostova has closed 5 admissions this month.',
    time: '1 day ago',
    type: 'success',
    read: true
  }
];

export const ANALYTICS_TREND_DATA = [
  { month: 'Jan', Leads: 65, Admissions: 12 },
  { month: 'Feb', Leads: 85, Admissions: 20 },
  { month: 'Mar', Leads: 120, Admissions: 28 },
  { month: 'Apr', Leads: 95, Admissions: 22 },
  { month: 'May', Leads: 150, Admissions: 42 }
];

export const ANALYTICS_SOURCE_DATA = [
  { name: 'Google Search', value: 40, color: '#6366f1' },
  { name: 'Facebook Ads', value: 25, color: '#3b82f6' },
  { name: 'LinkedIn', value: 15, color: '#8b5cf6' },
  { name: 'Instagram', value: 10, color: '#ec4899' },
  { name: 'Friend Referral', value: 5, color: '#10b981' },
  { name: 'Educational Fair', value: 5, color: '#f59e0b' }
];
