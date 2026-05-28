/* ==========================================================================
   Logic Engine - Pediatric Surgery Clinic Management App
   ========================================================================== */

// --- SUPABASE CONFIGURATION ---
// Paste your Supabase Project credentials here to enable collaborative cloud database.
// If left as default, the application will run in local-only mode (LocalStorage).
const SUPABASE_URL = "https://lesakyiknftciqxacybt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlc2FreWlrbmZ0Y2lxeGFjeWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTM2MDcsImV4cCI6MjA5NTM2OTYwN30.1c6e0DPjJJj4eeQ-QjhpwHS18ms-DqF1px3jHk0KMOk";

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
        console.warn("Failed to initialize Supabase client: ", e);
    }
}

// 1. SURGERY TYPES PRESETS (Bilingual Definitions)
const SURGERY_PRESETS = [
    { id: 'inguinal_hernia', ar: 'فتق إربي', en: 'Inguinal Hernia' },
    { id: 'umbilical_hernia', ar: 'فتق سرّي', en: 'Umbilical Hernia' },
    { id: 'undescended_testis', ar: 'خصية معلقة', en: 'Undescended Testis' },
    { id: 'hypospadias', ar: 'إحليل سفلي (مجرى البول)', en: 'Hypospadias' },
    { id: 'hydrocele', ar: 'قيلة مائية (مياه على الخصية)', en: 'Hydrocele' },
    { id: 'phimosis', ar: 'طهاره (ضيق قلفة)', en: 'Phimosis / Circumcision' },
    { id: 'appendectomy', ar: 'استئصال الزائدة الدودية', en: 'Appendectomy' },
    { id: 'hirschsprung', ar: 'جراحة مرض هيرشسبرونغ', en: 'Hirschsprung Disease Operation' },
    { id: 'anorectal', ar: 'إصلاح عيب خلقي بفتحة الشرج', en: 'Anorectal Malformation Repair' },
    { id: 'cleft_lip', ar: 'شفة أرنبية وسقف الحلق', en: 'Cleft Lip & Palate' },
    { id: 'neonatal_tumor', ar: 'استئصال أورام حديثي الولادة', en: 'Fetal / Neonatal Tumor Resection' },
    { id: 'chronic_constipation', ar: 'إمساك مزمن', en: 'Chronic Constipation' },
    { id: 'lap_cholecystectomy', ar: 'استئصال المرارة بالمنظار', en: 'Laparoscopic Cholecystectomy' },
    { id: 'lap_appendectomy', ar: 'استئصال الزائدة بالمنظار', en: 'Laparoscopic Appendectomy' },
    { id: 'splenectomy', ar: 'استئصال الطحال لأمراض الدم', en: 'Splenectomy for Blood Disorders' },
    { id: 'lap_hyperhidrosis', ar: 'علاج فرط التعرق بالمنظار', en: 'Laparoscopic Hyperhidrosis Treatment' },
    { id: 'other', ar: 'عملية أخرى (كتابة يدوية)', en: 'Other / Custom Surgery' }
];

// 2. DICTIONARY TRANSLATIONS (English and Arabic maps)
const TRANSLATIONS = {
    ar: {
        appLogo: 'جراحة الأطفال<br><span style="font-size:0.75rem; font-weight:400; opacity:0.8;">مستشفى العريش العام</span>',
        menuDashboard: 'الرئيسية',
        menuPatients: 'سجل الحالات',
        menuSchedule: 'مواعيد العمليات',
        menuDatabase: 'البيانات والنسخ',
        titleDashboard: 'لوحة المتابعة العامة',
        titlePatients: 'سجل حالات العيادة',
        titleSchedule: 'جدول العمليات القادمة',
        titleDatabase: 'قاعدة البيانات والنسخ',
        btnAddNewCase: 'إضافة حالة جديدة',
        metricAwaitingSurgeries: 'حالات بانتظار عملية',
        metricScheduled: 'عمليات مجدولة',
        metricCompleted: 'عمليات تمت ومتابعة',
        metricAllCases: 'إجمالي الحالات بالعيادة',
        chartSurgeryTypes: 'إحصائيات العمليات حسب النوع',
        chartStatusBreakdown: 'توزيع الحالات حسب الحالة',
        optAllOperations: 'جميع أنواع العمليات',
        optAllStatuses: 'جميع الحالات',
        statusExamined: 'بانتظار تحديد موعد',
        statusScheduled: 'تم تحديد عملية',
        statusCompleted: 'تم إجراء العملية ومتابعة',
        statusArchived: 'مؤرشف ومكتمل',
        tableHeadName: 'اسم الطفل والسن',
        tableHeadDiagnosis: 'نوع العملية المقترحة',
        tableHeadDate: 'موعد العملية',
        tableHeadFollowup: 'آخر متابعة',
        tableHeadStatus: 'الحالة',
        emptyStateTitle: 'لا توجد حالات مسجلة حالياً',
        emptyStateDesc: 'قم بإضافة حالة جديدة أو قم بتغيير فلاتر التصفية لعرض النتائج.',
        upcomingSurgeriesTitle: 'العمليات الجراحية المجدولة القادمة',
        optAllPriorities: 'جميع الأولويات',
        priorityRoutine: 'روتينية',
        priorityUrgent: 'عاجلة',
        backupTitle: 'إدارة قاعدة البيانات والنسخ الاحتياطي',
        backupDesc: 'بما أن هذا التطبيق يعمل محلياً بالكامل على متصفحك للحفاظ على سرعة وخصوصية بيانات مرضى العيادة، يرجى القيام بتنزيل نسخة احتياطية من البيانات بشكل دوري لتجنب فقدانها عند مسح ذاكرة المتصفح.',
        btnExportBackup: 'تصدير نسخة احتياطية (JSON)',
        btnImportBackup: 'استيراد قاعدة بيانات',
        btnResetDb: 'تهيئة ومسح قاعدة البيانات',
        drawerSecClinical: 'البيانات السريرية والتشخيص',
        lblOperationType: 'العملية المقترحة',
        lblCaseStatus: 'حالة المريض الحالية',
        lblWeight: 'الوزن الحالي',
        lblRegDate: 'تاريخ أول كشف',
        drawerSecActions: 'الإجراءات والجدولة',
        lblChangeStatus: 'تغيير حالة المريض',
        lblOperationDate: 'موعد العملية المقترح',
        lblPriority: 'الأولوية',
        btnSaveUpdates: 'حفظ تحديثات الحالة',
        drawerSecTimeline: 'الخط الزمني للمتابعات',
        btnAddFollowup: 'إضافة متابعة',
        modalTitleAdd: 'إضافة حالة مريض جديدة',
        modalTitleEdit: 'تعديل بيانات المريض',
        modalTitleFollowup: 'تسجيل زيارة متابعة',
        formName: 'اسم الطفل ثلاثي *',
        formAgeYears: 'العمر (سنوات) *',
        formAgeMonths: 'الشهور الإضافية',
        formWeight: 'الوزن (كيلو جرام)',
        formPhone: 'رقم هاتف ولي الأمر',
        formExamDate: 'تاريخ الكشف والتشخيص *',
        formOpType: 'نوع العملية الجراحية *',
        formCustomOp: 'اسم العملية بالتفصيل',
        formDiagnosis: 'التشخيص التفصيلي وملاحظات الكشف',
        btnCancel: 'إلغاء',
        btnSave: 'حفظ الحالة',
        followupDate: 'تاريخ الزيارة *',
        followupNotes: 'ملاحظات الفحص والتقدم المباشر',
        chkArchiveCase: 'أرشفة الحالة (تم الشفاء بالكامل وتوقف المتابعة)',
        confirmReset: 'هل أنت متأكد من مسح جميع بيانات الحالات؟ لا يمكن التراجع عن هذا الإجراء.',
        alertSaved: 'تم حفظ بيانات الحالة بنجاح!',
        alertFollowupSaved: 'تم تسجيل زيارة المتابعة بنجاح!',
        alertStatusUpdated: 'تم تحديث حالة المريض وجدولة المواعيد!',
        alertImported: 'تم استيراد قاعدة البيانات بنجاح وتحديث الحالات!',
        alertResetDone: 'تم مسح قاعدة البيانات بالكامل.',
        alertInvalidBackup: 'ملف النسخة الاحتياطية غير صالح.',
        toastSuccess: 'نجاح',
        noFollowups: 'لا توجد زيارات متابعة مسجلة حتى الآن.',
        visitExam: 'كشف مبدئي بالعيادة',
        visitScheduled: 'تم جدولة موعد العملية الجراحية',
        visitCompleted: 'تم إجراء العملية بنجاح وبدء المتابعة',
        visitFollowup: 'زيارة متابعة جديدة بالعيادة',
        visitArchived: 'أرشفة الحالة وإغلاق الملف الطبي',
        yearsOld: 'سنوات',
        monthsOld: 'شهور',
        kg: 'كجم',
        btnLogout: 'تسجيل الخروج',
        formEmail: 'البريد الإلكتروني',
        formPassword: 'كلمة المرور',
        btnStaffPortal: 'بوابة الكادر الطبي',
        heroTitle: 'عيادة جراحة الأطفال المتميزة',
        heroSubtitle: 'مستشفى العريش العام - رعاية طبية متكاملة وجراحة آمنة لأطفالنا',
        heroDesc: 'نقدم أحدث الحلول الجراحية للأطفال وحديثي الولادة بأعلى معايير الأمان والدقة الطبية، تحت إشراف نخبة من الأطباء المتخصصين.',
        btnExploreServices: 'استكشف خدماتنا العلاجية',
        titlePublicServices: 'الخدمات الجراحية التخصصية بالعيادة',
        srvHerniaTitle: 'عمليات الفتق الإربي والسرّي',
        srvHerniaDesc: 'إصلاح الفتق عند الرضع والأطفال بأحدث الطرق التجميلية الدقيقة التي تضمن سرعة الشفاء وتفادت المضاعفات.',
        srvTestisTitle: 'علاج وتثبيت الخصية المعلقة',
        srvTestisDesc: 'الفحص المبكر والتدخل الجراحي التجميلي لتثبيت الخصية في موضعها الطبيعي لحماية وظيفتها ونموها السليم.',
        srvHypospadiasTitle: 'جراحة إصلاح الإحليل السفلي',
        srvHypospadiasDesc: 'إصلاح وتجميل مجرى البول للأطفال وتعديل الانحناء بأعلى دقة ونسب نجاح ممتازة للمحافظة على الوظائف الطبيعية.',
        srvCircumTitle: 'الطهارة الجراحية والتجميلية',
        srvCircumDesc: 'عمليات الختان للأطفال وحديثي الولادة وإصلاح عيوب الطهارة الخاطئة تحت تخدير موضعي أو كلي آمن ومريح.',
        srvNeonatalTitle: 'عيوب القولون والشرج الخلقية',
        srvNeonatalDesc: 'تشخيص وعلاج حالات ضيق أو عدم تشكل فتحة الشرج الخلقية ومرض هيرشسبرونغ للرضع جراحياً وخلال المتابعة.',
        srvOtherTitle: 'استئصال أورام وجراحات حديثي الولادة',
        srvOtherDesc: 'علاج حالات الطوارئ مثل الزائدة الدودية الحادة وانسداد الأمعاء، واستئصال التشوهات الجسدية والأورام الخلقية بأمان.',
        srvConstipationTitle: 'الامساك المزمن فى الاطفال',
        srvConstipationDesc: 'التشخيص الجراحي والعلاجي لحالات الإمساك المزمن عند الرضع والأطفال وتحديد أسبابه العضوية والوظيفية.',
        srvCholecystectomyTitle: 'استئصال المرارة بالمنظار',
        srvCholecystectomyDesc: 'إجراء جراحي دقيق لاستئصال المرارة باستخدام تقنيات المنظار المتطورة لتقليل التعب وتسريع التعافي بعد العملية.',
        srvLapAppendectomyTitle: 'استئصال الزائدة الدودية بالمنظار',
        srvLapAppendectomyDesc: 'التدخل الجراحي الطارئ أو المجدول لاستئصال الزائدة الدودية الملتهبة بالمنظار من خلال فتحات صغيرة جداً وبأمان تام.',
        srvSplenectomyTitle: 'استئصال الطحال لأمراض الدم',
        srvSplenectomyDesc: 'جراحة استئصال الطحال للأطفال المصابين بأمراض الدم (مثل الثلاسيميا وأنيميا خلايا الدم المنجلية) لتحسين صحتهم.',
        srvHyperhidrosisTitle: 'علاج فرط التعرق بالمنظار',
        srvHyperhidrosisDesc: 'التدخل الجراحي التجميلي بالمنظار الصدري لعلاج حالات فرط تعرق اليدين والإبطين بشكل دائم وآمن.',
        titleClinicSchedule: 'مواعيد العمل والعيادة الخارجية',
        descClinicSchedule: 'تستقبل العيادة الخارجية بمستشفى العريش العام الحالات في المواعيد الرسمية التالية:',
        tblDay: 'اليوم',
        tblTime: 'الفترة الزمنية',
        tblLocation: 'الموقع',
        dayMon: 'الإثنين أسبوعياً',
        timeMorning: '08:00 صباحاً - 01:00 ظهراً',
        locOutpatient: 'مبنى العيادات الخارجية',
        noteTitle: 'ملاحظة للأهالي:',
        noteBody: 'يرجى إحضار جميع الفحوصات الطبية السابقة والأشعة والتقارير الطبية الخاصة بالطفل أثناء الزيارة لمساعدتنا في التشخيص الدقيق والسريع.',
        footerCopyright: '© 2026 قسم جراحة الأطفال - مستشفى العريش العام. جميع الحقوق محفوظة.'
    },
    en: {
        appLogo: 'Pediatric Surgery<br><span style="font-size:0.75rem; font-weight:400; opacity:0.8;">Al-Arish General Hospital</span>',
        menuDashboard: 'Dashboard',
        menuPatients: 'Patient Registry',
        menuSchedule: 'Surgery Schedule',
        menuDatabase: 'Data & Backup',
        titleDashboard: 'General Dashboard',
        titlePatients: 'Clinic Patient Database',
        titleSchedule: 'Upcoming Surgeries Schedule',
        titleDatabase: 'Database Management',
        btnAddNewCase: 'Add New Case',
        metricAwaitingSurgeries: 'Awaiting Surgery',
        metricScheduled: 'Scheduled Surgeries',
        metricCompleted: 'Completed & Follow-up',
        metricAllCases: 'Total Registered Cases',
        chartSurgeryTypes: 'Surgeries by Operation Type',
        chartStatusBreakdown: 'Case Status Distribution',
        optAllOperations: 'All Operation Types',
        optAllStatuses: 'All Statuses',
        statusExamined: 'Awaiting Scheduling',
        statusScheduled: 'Surgery Scheduled',
        statusCompleted: 'Surgery Done (Follow-up)',
        statusArchived: 'Archived (Recovered)',
        tableHeadName: 'Child Name & Age',
        tableHeadDiagnosis: 'Proposed Operation',
        tableHeadDate: 'Surgery Date',
        tableHeadFollowup: 'Last Follow-up',
        tableHeadStatus: 'Status',
        emptyStateTitle: 'No cases recorded yet',
        emptyStateDesc: 'Add a new patient case or modify search filters to view records.',
        upcomingSurgeriesTitle: 'Upcoming Scheduled Operations',
        optAllPriorities: 'All Priorities',
        priorityRoutine: 'Routine',
        priorityUrgent: 'Urgent',
        backupTitle: 'Database & Backup Management',
        backupDesc: 'Since this application runs entirely locally in your browser for clinic patient confidentiality, please download a backup file regularly to prevent data loss when cleaning browser storage.',
        btnExportBackup: 'Export Database (JSON)',
        btnImportBackup: 'Import Database',
        btnResetDb: 'Reset and Clear Database',
        drawerSecClinical: 'Clinical Record & Diagnosis',
        lblOperationType: 'Proposed Surgery',
        lblCaseStatus: 'Active Status',
        lblWeight: 'Current Weight',
        lblRegDate: 'Initial Exam Date',
        drawerSecActions: 'Clinical Scheduling Actions',
        lblChangeStatus: 'Transition Patient Status',
        lblOperationDate: 'Proposed Surgery Date',
        lblPriority: 'Priority Level',
        btnSaveUpdates: 'Save Status Updates',
        drawerSecTimeline: 'Clinical Progress Timeline',
        btnAddFollowup: 'Log Follow-up',
        modalTitleAdd: 'Register New Patient Case',
        modalTitleEdit: 'Modify Patient Case Info',
        modalTitleFollowup: 'Log Follow-up Progress',
        formName: 'Child Name (Full) *',
        formAgeYears: 'Age (Years) *',
        formAgeMonths: 'Additional Months',
        formWeight: 'Weight (kg)',
        formPhone: 'Parent Phone Number',
        formExamDate: 'Diagnosis Exam Date *',
        formOpType: 'Surgery Category *',
        formCustomOp: 'Detailed Surgery Description',
        formDiagnosis: 'Detailed Diagnosis & Clinical Notes',
        btnCancel: 'Cancel',
        btnSave: 'Save Case',
        followupDate: 'Visit Date *',
        followupNotes: 'Exam Progress & Clinical Notes',
        chkArchiveCase: 'Archive Case (Fully Recovered / Stop Follow-ups)',
        confirmReset: 'Are you sure you want to delete ALL patient records? This action is permanent and cannot be undone.',
        alertSaved: 'Patient case saved successfully!',
        alertFollowupSaved: 'Follow-up visit logged successfully!',
        alertStatusUpdated: 'Patient clinical status and dates updated!',
        alertImported: 'Database imported successfully!',
        alertResetDone: 'Clinic database has been reset.',
        alertInvalidBackup: 'Invalid backup file structure.',
        toastSuccess: 'Success',
        noFollowups: 'No follow-up visits recorded yet.',
        visitExam: 'Initial clinical examination',
        visitScheduled: 'Surgery operation scheduled',
        visitCompleted: 'Operation completed successfully, follow-up phase started',
        visitFollowup: 'New follow-up check visit logged',
        visitArchived: 'Patient archived and medical file closed',
        yearsOld: 'years',
        monthsOld: 'months',
        kg: 'kg',
        btnLogout: 'Logout',
        formEmail: 'Email Address',
        formPassword: 'Password',
        btnStaffPortal: 'Staff Portal',
        heroTitle: 'Outstanding Pediatric Surgery Clinic',
        heroSubtitle: 'Al-Arish General Hospital - Integrated Medical Care & Safe Surgery for Our Children',
        heroDesc: 'We offer the latest surgical solutions for infants and children with the highest standards of medical safety and precision, under the supervision of specialized surgeons.',
        btnExploreServices: 'Explore Our Services',
        titlePublicServices: 'Specialized Surgical Services at the Clinic',
        srvHerniaTitle: 'Inguinal & Umbilical Hernia',
        srvHerniaDesc: 'Repair of hernias in infants and children using the latest cosmetic and precise techniques to ensure rapid recovery and avoid complications.',
        srvTestisTitle: 'Undescended Testis Treatment',
        srvTestisDesc: 'Early examination and cosmetic orchidopexy to secure the testis in its normal anatomical position to protect its function.',
        srvHypospadiasTitle: 'Hypospadias Repair Surgery',
        srvHypospadiasDesc: 'Reconstruction and cosmetic repair of the urethral opening and correction of penile curvature with high success rates.',
        srvCircumTitle: 'Surgical & Cosmetic Circumcision',
        srvCircumDesc: 'Newborn and pediatric circumcisions, and revision of previous circumcision defects under safe, comfortable anesthesia.',
        srvNeonatalTitle: 'Congenital Anorectal & Colon Defects',
        srvNeonatalDesc: 'Diagnosis and surgical treatment of anorectal malformations and Hirschsprung\'s disease in infants and children.',
        srvOtherTitle: 'Neonatal Surgery & Tumor Resection',
        srvOtherDesc: 'Emergency management of acute appendicitis, bowel obstruction, and resection of congenital anomalies & tumors safely.',
        srvConstipationTitle: 'Chronic Constipation in Children',
        srvConstipationDesc: 'Surgical and medical diagnosis for chronic constipation in infants and children, defining organic and functional causes.',
        srvCholecystectomyTitle: 'Laparoscopic Cholecystectomy',
        srvCholecystectomyDesc: 'Precise surgical removal of the gallbladder using advanced laparoscopic techniques, minimizing discomfort and accelerating recovery.',
        srvLapAppendectomyTitle: 'Laparoscopic Appendectomy',
        srvLapAppendectomyDesc: 'Emergency or scheduled surgical removal of the inflamed appendix laparoscopically via tiny keyhole incisions safely.',
        srvSplenectomyTitle: 'Splenectomy for Blood Disorders',
        srvSplenectomyDesc: 'Surgical removal of the spleen for children diagnosed with blood disorders (such as Thalassemia or Sickle Cell Anemia) to improve health.',
        srvHyperhidrosisTitle: 'Endoscopic Hyperhidrosis Treatment',
        srvHyperhidrosisDesc: 'Cosmetic endoscopic thoracic sympathectomy (ETS) for permanent and safe treatment of severe sweaty hands and underarms.',
        titleClinicSchedule: 'Clinic Working Schedule',
        descClinicSchedule: 'Al-Arish General Hospital Outpatient Clinic receives cases during the following official hours:',
        tblDay: 'Day',
        tblTime: 'Time',
        tblLocation: 'Location',
        dayMon: 'Every Monday',
        timeMorning: '08:00 AM - 01:00 PM',
        locOutpatient: 'Outpatient Clinics Building',
        noteTitle: 'Note for Parents:',
        noteBody: 'Please bring all previous medical records, scans, and reports during the visit to help us provide a quick and accurate diagnosis.',
        footerCopyright: '© 2026 Pediatric Surgery Department - Al-Arish General Hospital. All rights reserved.',
        modalTitleAdd: 'Register New Patient Case',
        modalTitleEdit: 'Modify Patient Case Info',
        modalTitleFollowup: 'Log Follow-up Progress',
        formName: 'Child Name (Full) *',
        formAgeYears: 'Age (Years) *',
        formAgeMonths: 'Additional Months',
        formWeight: 'Weight (kg)',
        formPhone: 'Parent Phone Number',
        formExamDate: 'Diagnosis Exam Date *',
        formOpType: 'Surgery Category *',
        formCustomOp: 'Detailed Surgery Description',
        formDiagnosis: 'Detailed Diagnosis & Clinical Notes',
        btnCancel: 'Cancel',
        btnSave: 'Save Case',
        followupDate: 'Visit Date *',
        followupNotes: 'Exam Progress & Clinical Notes',
        chkArchiveCase: 'Archive Case (Fully Recovered / Stop Follow-ups)',
        confirmReset: 'Are you sure you want to delete ALL patient records? This action is permanent and cannot be undone.',
        alertSaved: 'Patient case saved successfully!',
        alertFollowupSaved: 'Follow-up visit logged successfully!',
        alertStatusUpdated: 'Patient clinical status and dates updated!',
        alertImported: 'Database imported successfully!',
        alertResetDone: 'Clinic database has been reset.',
        alertInvalidBackup: 'Invalid backup file structure.',
        toastSuccess: 'Success',
        noFollowups: 'No follow-up visits recorded yet.',
        visitExam: 'Initial clinical examination',
        visitScheduled: 'Surgery operation scheduled',
        visitCompleted: 'Operation completed successfully, follow-up phase started',
        visitFollowup: 'New follow-up check visit logged',
        visitArchived: 'Patient archived and medical file closed',
        yearsOld: 'years',
        monthsOld: 'months',
        kg: 'kg',
        btnLogout: 'Logout',
        formEmail: 'Email Address',
        formPassword: 'Password'
    }
};

// 3. MOCKUP PRESET DATA (For a populated first view)
const MOCK_PATIENTS = [
    {
        id: 'mock_1',
        name: 'يوسف أحمد منصور',
        ageYears: 2,
        ageMonths: 4,
        weight: 12.5,
        phone: '01012345678',
        examDate: '2026-05-10',
        opType: 'inguinal_hernia',
        customOp: '',
        notes: 'فتق إربي أيمن غير مختنق، الحجم متوسط، يظهر بوضوح عند البكاء. الحالة العامة ممتازة للكشف والتخدير.',
        status: 'scheduled',
        opDate: '2026-06-05',
        priority: 'routine',
        timeline: [
            { date: '2026-05-10', type: 'exam', notes: 'فتق إربي أيمن غير مختنق، الكشف المبدئي وتحديد ضرورة الجراحة التجميلية للفتق.' },
            { date: '2026-05-12', type: 'schedule', notes: 'تم تحديد موعد العملية يوم 2026-06-05، التقييم الروتيني للتخدير.' }
        ]
    },
    {
        id: 'mock_2',
        name: 'جنا عمر الفاروق',
        ageYears: 5,
        ageMonths: 0,
        weight: 18.0,
        phone: '01223456789',
        examDate: '2026-04-15',
        opType: 'hypospadias',
        customOp: '',
        notes: 'إحليل سفلي من الدرجة الثانية (Subcoronal Hypospadias) مع انحناء خفيف بالذكر. تم التوصية بالإصلاح الجراحي التجميلي.',
        status: 'completed',
        opDate: '2026-05-01',
        priority: 'routine',
        timeline: [
            { date: '2026-04-15', type: 'exam', notes: 'كشف وتشخيص إحليل سفلي من الدرجة الثانية.' },
            { date: '2026-04-18', type: 'schedule', notes: 'تم جدولة الجراحة التجميلية وتعديل الانحناء.' },
            { date: '2026-05-01', type: 'completed', notes: 'تمت العملية بنجاح، وتركيب القسطرة لمدة 7 أيام.' },
            { date: '2026-05-08', type: 'followup', notes: 'تم إزالة القسطرة البولية، التئام الجرح ممتاز ومجرى البول مستقيم وجيد.' }
        ]
    },
    {
        id: 'mock_3',
        name: 'عبد الرحمن محمود سليم',
        ageYears: 0,
        ageMonths: 8,
        weight: 8.2,
        phone: '01156789012',
        examDate: '2026-05-20',
        opType: 'undescended_testis',
        customOp: '',
        notes: 'خصية معلقة في الجهة اليسرى (يمكن إنزالها يدوياً للمجرى لكن ترتد). يُقترح عملية تثبيت الخصية (Orchidopexy).',
        status: 'examined',
        opDate: '',
        priority: '',
        timeline: [
            { date: '2026-05-20', type: 'exam', notes: 'كشف أولي للخصية المعلقة اليسرى، العمر 8 شهور ومناسب لسرعة التدخل الجراحي.' }
        ]
    },
    {
        id: 'mock_4',
        name: 'ليان كريم الهواري',
        ageYears: 3,
        ageMonths: 10,
        weight: 14.8,
        phone: '01598765432',
        examDate: '2026-05-22',
        opType: 'appendectomy',
        customOp: '',
        notes: 'حالة اشتباه زائدة دودية حادة بالسونار، ألم بالربع السفلي الأيمن، وارتفاع كرات الدم البيضاء. تقرر الجراحة بشكل فوري.',
        status: 'scheduled',
        opDate: '2026-05-27',
        priority: 'urgent',
        timeline: [
            { date: '2026-05-22', type: 'exam', notes: 'كشف طوارئ، ألم حاد بالبطن والتهاب زائدة دودية بالسونار.' },
            { date: '2026-05-22', type: 'schedule', notes: 'تم حجز موعد عملية عاجل جداً في صباح 2026-05-27 لسرعة الاستئصال.' }
        ]
    }
];

// 4. APP STATE CLASS
class ClinicApp {
    constructor() {
        this.patients = [];
        this.currentLang = 'ar'; // Default language
        this.activeView = 'dashboard';
        this.selectedPatientId = null;

        this.initElements();
        this.bindEvents();
        this.checkAuth();
        this.loadDatabase();
        this.applyLanguage();
        this.fillSurgeryDropdowns();
        this.navigateToView(this.activeView);
    }

    initElements() {
        // Nav Elements
        this.sidebarItems = document.querySelectorAll('.sidebar-menu .menu-item');
        this.pageViews = document.querySelectorAll('.page-view');
        this.pageTitleText = document.getElementById('pageTitleText');
        this.langSwitchBtn = document.getElementById('langSwitchBtn');
        this.menuToggleBtn = document.getElementById('menuToggleBtn');
        this.appWrapper = document.getElementById('appWrapper');

        // Login Screen Elements
        this.loginScreen = document.getElementById('loginScreen');
        this.loginForm = document.getElementById('loginForm');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.loginErrorMsg = document.getElementById('loginErrorMsg');
        this.loginSubmitBtn = document.getElementById('loginSubmitBtn');
        this.loginSubmitText = document.getElementById('loginSubmitText');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.closeLoginModalBtn = document.getElementById('closeLoginModalBtn');

        // Public Landing Page Elements
        this.publicSite = document.getElementById('publicSite');
        this.openLoginModalBtn = document.getElementById('openLoginModalBtn');
        this.publicLangSwitchBtn = document.getElementById('publicLangSwitchBtn');

        // Modal triggers
        this.openAddPatientModalBtn = document.getElementById('openAddPatientModalBtn');
        this.addPatientModal = document.getElementById('addPatientModal');
        this.closeAddPatientModalBtn = document.getElementById('closeAddPatientModalBtn');
        this.cancelAddPatientBtn = document.getElementById('cancelAddPatientBtn');
        
        // Forms
        this.patientForm = document.getElementById('patientForm');
        this.formPatientId = document.getElementById('formPatientId');
        this.formPatientName = document.getElementById('formPatientName');
        this.formAgeYears = document.getElementById('formAgeYears');
        this.formAgeMonths = document.getElementById('formAgeMonths');
        this.formWeight = document.getElementById('formWeight');
        this.formPhone = document.getElementById('formPhone');
        this.formExamDate = document.getElementById('formExamDate');
        this.formOpType = document.getElementById('formOpType');
        this.customOpGroup = document.getElementById('customOpGroup');
        this.formCustomOp = document.getElementById('formCustomOp');
        this.formNotes = document.getElementById('formNotes');

        // Database / Filters
        this.searchInput = document.getElementById('searchInput');
        this.filterOperation = document.getElementById('filterOperation');
        this.filterStatus = document.getElementById('filterStatus');
        this.patientTableBody = document.getElementById('patientTableBody');
        this.dbEmptyState = document.getElementById('dbEmptyState');

        // Schedule / Calendar View
        this.scheduleItemsContainer = document.getElementById('scheduleItemsContainer');
        this.scheduleFilterPriority = document.getElementById('scheduleFilterPriority');

        // Drawer elements
        this.drawerOverlay = document.getElementById('drawerOverlay');
        this.patientDrawer = document.getElementById('patientDrawer');
        this.closeDrawerBtn = document.getElementById('closeDrawerBtn');
        this.drawerPatientName = document.getElementById('drawerPatientName');
        this.drawerPatientMeta = document.getElementById('drawerPatientMeta');
        this.drawerOpType = document.getElementById('drawerOpType');
        this.drawerStatusTag = document.getElementById('drawerStatusTag');
        this.drawerWeight = document.getElementById('drawerWeight');
        this.drawerExamDate = document.getElementById('drawerExamDate');
        this.drawerStatusSelector = document.getElementById('drawerStatusSelector');
        this.drawerScheduleGroupDate = document.getElementById('drawerScheduleGroupDate');
        this.drawerScheduleGroupPriority = document.getElementById('drawerScheduleGroupPriority');
        this.drawerOpDateInput = document.getElementById('drawerOpDateInput');
        this.drawerPriorityInput = document.getElementById('drawerPriorityInput');
        this.drawerSaveActionsBtn = document.getElementById('drawerSaveActionsBtn');
        this.drawerTimeline = document.getElementById('drawerTimeline');
        this.drawerAddFollowupBtn = document.getElementById('drawerAddFollowupBtn');

        // Followup Modal
        this.followupModal = document.getElementById('followupModal');
        this.closeFollowupModalBtn = document.getElementById('closeFollowupModalBtn');
        this.cancelFollowupBtn = document.getElementById('cancelFollowupBtn');
        this.followupForm = document.getElementById('followupForm');
        this.followupDate = document.getElementById('followupDate');
        this.followupNotes = document.getElementById('followupNotes');
        this.followupArchiveCase = document.getElementById('followupArchiveCase');

        // Data / Backup Buttons
        this.exportDataBtn = document.getElementById('exportDataBtn');
        this.triggerImportBtn = document.getElementById('triggerImportBtn');
        this.importFileInput = document.getElementById('importFileInput');
        this.resetDbBtn = document.getElementById('resetDbBtn');
        
        this.toastContainer = document.getElementById('toastContainer');
    }

    bindEvents() {
        // Toggle mobile sidebar
        if (this.menuToggleBtn) {
            this.menuToggleBtn.addEventListener('click', () => {
                this.appWrapper.classList.toggle('sidebar-open');
            });
        }

        // Navigation clicks
        this.sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.navigateToView(view);
                this.appWrapper.classList.remove('sidebar-open');
            });
        });

        // Language toggle
        if (this.langSwitchBtn) {
            this.langSwitchBtn.addEventListener('click', () => {
                this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
                this.applyLanguage();
            });
        }

        if (this.publicLangSwitchBtn) {
            this.publicLangSwitchBtn.addEventListener('click', () => {
                this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
                this.applyLanguage();
            });
        }

        // Login Modal triggers
        if (this.openLoginModalBtn) {
            this.openLoginModalBtn.addEventListener('click', () => {
                if (this.loginScreen) this.loginScreen.classList.add('active');
            });
        }

        if (this.closeLoginModalBtn) {
            this.closeLoginModalBtn.addEventListener('click', () => {
                if (this.loginScreen) this.loginScreen.classList.remove('active');
            });
        }

        // Add case modals
        if (this.openAddPatientModalBtn) {
            this.openAddPatientModalBtn.addEventListener('click', () => this.openPatientFormModal());
        }
        if (this.closeAddPatientModalBtn) {
            this.closeAddPatientModalBtn.addEventListener('click', () => this.closePatientFormModal());
        }
        if (this.cancelAddPatientBtn) {
            this.cancelAddPatientBtn.addEventListener('click', () => this.closePatientFormModal());
        }

        // Operations Presets select logic
        if (this.formOpType) {
            this.formOpType.addEventListener('change', () => {
                if (this.formOpType.value === 'other') {
                    this.customOpGroup.style.display = 'flex';
                } else {
                    this.customOpGroup.style.display = 'none';
                }
            });
        }

        // Save Patient Form Submission
        if (this.patientForm) {
            this.patientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePatientData();
            });
        }

        // Filters listeners
        const triggerTableUpdate = () => this.renderPatientTable();
        if (this.searchInput) this.searchInput.addEventListener('input', triggerTableUpdate);
        if (this.filterOperation) this.filterOperation.addEventListener('change', triggerTableUpdate);
        if (this.filterStatus) this.filterStatus.addEventListener('change', triggerTableUpdate);

        // Schedule / Calendar priority filters
        if (this.scheduleFilterPriority) {
            this.scheduleFilterPriority.addEventListener('change', () => this.renderScheduleList());
        }

        // Dashboard metric card quick filters
        document.querySelectorAll('.summary-card').forEach(card => {
            card.addEventListener('click', () => {
                const status = card.getAttribute('data-filter-status');
                if (status === 'all') {
                    this.filterStatus.value = '';
                } else {
                    this.filterStatus.value = status;
                }
                this.filterOperation.value = '';
                if (this.searchInput) this.searchInput.value = '';
                this.navigateToView('patients');
            });
        });

        // Drawer actions
        if (this.closeDrawerBtn) this.closeDrawerBtn.addEventListener('click', () => this.closePatientDrawer());
        if (this.drawerOverlay) this.drawerOverlay.addEventListener('click', () => this.closePatientDrawer());

        if (this.drawerStatusSelector) {
            this.drawerStatusSelector.addEventListener('change', () => {
                const val = this.drawerStatusSelector.value;
                if (val === 'scheduled') {
                    this.drawerScheduleGroupDate.style.display = 'flex';
                    this.drawerScheduleGroupPriority.style.display = 'flex';
                } else {
                    this.drawerScheduleGroupDate.style.display = 'none';
                    this.drawerScheduleGroupPriority.style.display = 'none';
                }
            });
        }

        if (this.drawerSaveActionsBtn) {
            this.drawerSaveActionsBtn.addEventListener('click', () => this.saveDrawerStatusChanges());
        }

        // Log follow-ups modal
        if (this.drawerAddFollowupBtn) {
            this.drawerAddFollowupBtn.addEventListener('click', () => this.openFollowupModal());
        }
        if (this.closeFollowupModalBtn) {
            this.closeFollowupModalBtn.addEventListener('click', () => this.closeFollowupModal());
        }
        if (this.cancelFollowupBtn) {
            this.cancelFollowupBtn.addEventListener('click', () => this.closeFollowupModal());
        }
        if (this.followupForm) {
            this.followupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveFollowupData();
            });
        }

        // Database backups triggers
        if (this.exportDataBtn) this.exportDataBtn.addEventListener('click', () => this.exportBackup());
        if (this.triggerImportBtn) {
            this.triggerImportBtn.addEventListener('click', () => this.importFileInput.click());
        }
        if (this.importFileInput) {
            this.importFileInput.addEventListener('change', (e) => this.handleImportBackup(e));
        }
        if (this.resetDbBtn) this.resetDbBtn.addEventListener('click', () => this.resetDatabase());

        // Login Form Submission
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = this.loginEmail.value.trim();
                const password = this.loginPassword.value;
                this.handleLogin(email, password);
            });
        }

        // Logout Trigger
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    checkAuth() {
        if (!supabaseClient) {
            // Local offline mode authentication check
            const isLocalLoggedIn = localStorage.getItem('local_logged_in') === 'true';
            if (isLocalLoggedIn) {
                document.body.classList.add('logged-in');
                if (this.loginScreen) this.loginScreen.classList.remove('active');
                this.loadDatabase();
            } else {
                document.body.classList.remove('logged-in');
            }
            if (this.logoutBtn) this.logoutBtn.style.display = 'flex';
            return;
        }

        if (this.logoutBtn) this.logoutBtn.style.display = 'flex';

        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                document.body.classList.add('logged-in');
                if (this.loginScreen) this.loginScreen.classList.remove('active');
                this.loadDatabase();
            } else {
                document.body.classList.remove('logged-in');
            }
        });

        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                document.body.classList.add('logged-in');
                if (this.loginScreen) this.loginScreen.classList.remove('active');
                this.loadDatabase();
            } else {
                document.body.classList.remove('logged-in');
                this.patients = [];
                this.navigateToView('dashboard');
            }
        });
    }

    async handleLogin(email, password) {
        if (!supabaseClient) {
            this.loginSubmitBtn.disabled = true;
            this.loginSubmitText.textContent = this.currentLang === 'ar' ? 'جاري التحقق...' : 'Verifying...';
            this.loginErrorMsg.style.display = 'none';

            setTimeout(() => {
                // In local mode, accept any non-empty credential
                if (email && password) {
                    localStorage.setItem('local_logged_in', 'true');
                    document.body.classList.add('logged-in');
                    if (this.loginScreen) this.loginScreen.classList.remove('active');
                    this.loadDatabase();
                    this.showToast(this.currentLang === 'ar' ? 'تم تسجيل الدخول محلياً بنجاح!' : 'Logged in locally successfully!');
                } else {
                    this.loginErrorMsg.textContent = this.currentLang === 'ar' 
                        ? 'خطأ في تسجيل الدخول. يرجى تعبئة جميع الحقول.' 
                        : 'Authentication failed. Please fill all fields.';
                    this.loginErrorMsg.style.display = 'block';
                }
                this.loginSubmitBtn.disabled = false;
                this.loginSubmitText.textContent = this.currentLang === 'ar' ? 'تسجيل الدخول' : 'Sign In';
            }, 400);
            return;
        }

        this.loginSubmitBtn.disabled = true;
        this.loginSubmitText.textContent = this.currentLang === 'ar' ? 'جاري التحقق...' : 'Verifying...';
        this.loginErrorMsg.style.display = 'none';

        try {
            const { error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            this.showToast(this.currentLang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
        } catch (err) {
            this.loginErrorMsg.textContent = this.currentLang === 'ar' 
                ? 'خطأ في تسجيل الدخول. يرجى التحقق من البيانات.' 
                : 'Authentication failed. Please verify credentials.';
            this.loginErrorMsg.style.display = 'block';
        } finally {
            this.loginSubmitBtn.disabled = false;
            this.loginSubmitText.textContent = this.currentLang === 'ar' ? 'تسجيل الدخول' : 'Sign In';
        }
    }

    async handleLogout() {
        if (!supabaseClient) {
            localStorage.removeItem('local_logged_in');
            document.body.classList.remove('logged-in');
            this.showToast(this.currentLang === 'ar' ? 'تم تسجيل الخروج.' : 'Logged out.');
            return;
        }
        try {
            await supabaseClient.auth.signOut();
            this.showToast(this.currentLang === 'ar' ? 'تم تسجيل الخروج.' : 'Logged out.');
        } catch (err) {
            console.error(err);
        }
    }

    // 5. DATABASE OPERATIONS (LOCAL STORAGE OR CLOUD SYNC)
    async loadDatabase() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('patients')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                this.patients = (data || []).map(p => ({
                    id: p.id,
                    name: p.name,
                    ageYears: p.age_years,
                    ageMonths: p.age_months,
                    weight: p.weight,
                    phone: p.phone,
                    examDate: p.exam_date,
                    opType: p.op_type,
                    customOp: p.custom_op,
                    notes: p.notes,
                    status: p.status,
                    opDate: p.op_date,
                    priority: p.priority,
                    timeline: p.timeline || []
                }));

                if (this.activeView === 'dashboard') this.renderDashboard();
                else if (this.activeView === 'patients') this.renderPatientTable();
                else if (this.activeView === 'schedule') this.renderScheduleList();
            } catch (err) {
                console.error(err);
                this.showToast("Failed to load cloud database.");
            }
        } else {
            const localData = localStorage.getItem('pediatric_clinic_patients');
            if (localData) {
                try {
                    this.patients = JSON.parse(localData);
                } catch (err) {
                    console.error(err);
                    this.patients = [];
                    this.saveToDisk();
                }
            } else {
                this.patients = [];
                this.saveToDisk();
            }
        }
    }

    async saveToDisk(patientToUpsert = null) {
        if (supabaseClient) {
            if (patientToUpsert) {
                try {
                    const dbRow = {
                        id: patientToUpsert.id,
                        name: patientToUpsert.name,
                        age_years: patientToUpsert.ageYears,
                        age_months: patientToUpsert.ageMonths,
                        weight: patientToUpsert.weight,
                        phone: patientToUpsert.phone,
                        exam_date: patientToUpsert.examDate,
                        op_type: patientToUpsert.opType,
                        custom_op: patientToUpsert.customOp,
                        notes: patientToUpsert.notes,
                        status: patientToUpsert.status,
                        op_date: patientToUpsert.opDate || null,
                        priority: patientToUpsert.priority || null,
                        timeline: patientToUpsert.timeline
                    };

                    const { error } = await supabaseClient
                        .from('patients')
                        .upsert(dbRow);

                    if (error) throw error;
                } catch (err) {
                    console.error(err);
                    this.showToast("Cloud sync failed.");
                }
            } else {
                try {
                    const dbRows = this.patients.map(p => ({
                        id: p.id,
                        name: p.name,
                        age_years: p.ageYears,
                        age_months: p.ageMonths,
                        weight: p.weight,
                        phone: p.phone,
                        exam_date: p.examDate,
                        op_type: p.opType,
                        custom_op: p.customOp,
                        notes: p.notes,
                        status: p.status,
                        op_date: p.opDate || null,
                        priority: p.priority || null,
                        timeline: p.timeline
                    }));

                    const { error } = await supabaseClient
                        .from('patients')
                        .upsert(dbRows);

                    if (error) throw error;
                } catch (err) {
                    console.error(err);
                }
            }
            this.updateStatistics();
        } else {
            localStorage.setItem('pediatric_clinic_patients', JSON.stringify(this.patients));
            this.updateStatistics();
        }
    }

    // 6. VIEW SWITCHER
    navigateToView(viewId) {
        this.activeView = viewId;
        
        // Update sidebar focus
        this.sidebarItems.forEach(item => {
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Toggle active views elements
        this.pageViews.forEach(view => {
            if (view.id === `view-${viewId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Set navbar title based on view & language
        const titleKey = 'title' + viewId.charAt(0).toUpperCase() + viewId.slice(1);
        this.pageTitleText.textContent = this.getTranslation(titleKey);

        // Render appropriate contents
        if (viewId === 'dashboard') {
            this.renderDashboard();
        } else if (viewId === 'patients') {
            this.renderPatientTable();
        } else if (viewId === 'schedule') {
            this.renderScheduleList();
        }
    }

    // 7. BILINGUAL TRANSLATOR ENGINE
    applyLanguage() {
        // Set document language and direction attributes
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        
        // Translate Title Tag
        document.getElementById('app-title-tag').textContent = this.currentLang === 'ar' 
            ? 'جراحة الأطفال - مستشفى العريش العام' 
            : 'Pediatric Surgery - Al-Arish General Hospital';

        // Translate components
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.getAttribute('data-i18n-html') === 'true' || key === 'appLogo') {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Redraw lists
        this.fillSurgeryDropdowns();
        this.navigateToView(this.activeView);
        
        // Set Language toggle text
        const toggleText = this.langSwitchBtn.querySelector('span');
        if (toggleText) {
            toggleText.textContent = this.currentLang === 'ar' ? 'English' : 'العربية';
        }
    }

    getTranslation(key) {
        return TRANSLATIONS[this.currentLang][key] || TRANSLATIONS['en'][key] || key;
    }

    fillSurgeryDropdowns() {
        if (!this.filterOperation || !this.formOpType) return;

        const activeOpVal = this.filterOperation.value;
        const activeFormVal = this.formOpType.value;

        // Clear existing
        this.filterOperation.innerHTML = `<option value="">${this.getTranslation('optAllOperations')}</option>`;
        this.formOpType.innerHTML = `<option value="" disabled selected>${this.getTranslation('formOpType')}</option>`;

        // Populate preset items
        SURGERY_PRESETS.forEach(op => {
            const label = this.currentLang === 'ar' ? op.ar : op.en;
            
            const filterOpt = document.createElement('option');
            filterOpt.value = op.id;
            filterOpt.textContent = label;
            this.filterOperation.appendChild(filterOpt);

            const formOpt = document.createElement('option');
            formOpt.value = op.id;
            formOpt.textContent = label;
            this.formOpType.appendChild(formOpt);
        });

        // Restore values
        this.filterOperation.value = activeOpVal;
        this.formOpType.value = activeFormVal;
    }

    getSurgeryLabel(opId, customOpName) {
        if (opId === 'other') return customOpName || this.getTranslation('other');
        const preset = SURGERY_PRESETS.find(p => p.id === opId);
        if (preset) {
            return this.currentLang === 'ar' ? preset.ar : preset.en;
        }
        return opId;
    }

    // 8. DASHBOARD RENDERING & CHART DESIGN (SVG)
    renderDashboard() {
        this.updateStatistics();
        this.drawBarChart();
        this.drawPieChart();
    }

    updateStatistics() {
        const stats = {
            examined: 0,
            scheduled: 0,
            completed: 0,
            all: this.patients.length
        };

        this.patients.forEach(p => {
            if (p.status === 'examined') stats.examined++;
            else if (p.status === 'scheduled') stats.scheduled++;
            else if (p.status === 'completed') stats.completed++;
        });

        // Render figures
        document.getElementById('stat-examined').textContent = stats.examined;
        document.getElementById('stat-scheduled').textContent = stats.scheduled;
        document.getElementById('stat-completed').textContent = stats.completed;
        document.getElementById('stat-all').textContent = stats.all;
    }

    drawBarChart() {
        const container = document.getElementById('barChartContainer');
        if (!container) return;

        // Group patients by operation presets
        const groups = {};
        this.patients.forEach(p => {
            const key = p.opType;
            groups[key] = (groups[key] || 0) + 1;
        });

        // Sort groups to get the top categories
        const sortedCategories = Object.keys(groups)
            .map(key => ({
                id: key,
                label: this.getSurgeryLabel(key, key === 'other' ? 'Custom' : ''),
                count: groups[key]
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // top 5

        if (sortedCategories.length === 0) {
            container.innerHTML = `<div class="empty-state"><h4>No Data Available</h4></div>`;
            return;
        }

        const maxCount = Math.max(...sortedCategories.map(c => c.count));
        const chartWidth = container.clientWidth || 500;
        const chartHeight = 220;
        const padding = { top: 20, right: 30, bottom: 40, left: 50 };
        
        // Calculate SVG bars
        const graphWidth = chartWidth - padding.left - padding.right;
        const graphHeight = chartHeight - padding.top - padding.bottom;
        const barWidth = Math.min(60, (graphWidth / sortedCategories.length) * 0.6);
        const barGap = (graphWidth - (barWidth * sortedCategories.length)) / (sortedCategories.length + 1);

        let svgContent = `<svg width="100%" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">`;
        
        // Draw Axis Lines
        // Y Axis line
        svgContent += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${chartHeight - padding.bottom}" stroke="var(--border-color)" stroke-width="1"/>`;
        // X Axis line
        svgContent += `<line x1="${padding.left}" y1="${chartHeight - padding.bottom}" x2="${chartWidth - padding.right}" y2="${chartHeight - padding.bottom}" stroke="var(--border-color)" stroke-width="1"/>`;

        // Y Axis Ticks & Gridlines
        const ticksCount = Math.min(5, maxCount);
        for (let i = 0; i <= ticksCount; i++) {
            const val = Math.round((maxCount / ticksCount) * i);
            const y = chartHeight - padding.bottom - (graphHeight * (val / maxCount));
            
            // Gridline
            svgContent += `<line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="#f1f5f9" stroke-dasharray="4" stroke-width="1"/>`;
            // Ticks labels
            svgContent += `<text x="${padding.left - 10}" y="${y + 4}" font-size="11" fill="var(--text-muted)" text-anchor="end">${val}</text>`;
        }

        // Draw Bars
        sortedCategories.forEach((cat, index) => {
            const x = padding.left + barGap + index * (barWidth + barGap);
            const valRatio = cat.count / maxCount;
            const barHeight = graphHeight * valRatio;
            const y = chartHeight - padding.bottom - barHeight;

            // Render Bar rect
            svgContent += `<rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="var(--primary-medium)" rx="4"/>`;
            
            // Count text above bar
            svgContent += `<text x="${x + barWidth/2}" y="${y - 6}" font-size="11" font-weight="600" fill="var(--text-main)" text-anchor="middle">${cat.count}</text>`;
            
            // Label below bar
            const labelX = x + barWidth / 2;
            const labelY = chartHeight - padding.bottom + 18;
            // Truncate long labels
            let displayLabel = cat.label;
            if (displayLabel.length > 12) displayLabel = displayLabel.substring(0, 10) + '..';

            svgContent += `<text class="chart-label" x="${labelX}" y="${labelY}" font-size="11" fill="var(--text-muted)" text-anchor="middle">${displayLabel}</text>`;
        });

        svgContent += `</svg>`;
        container.innerHTML = svgContent;
    }

    drawPieChart() {
        const container = document.getElementById('pieChartContainer');
        const legendContainer = document.getElementById('pieChartLegend');
        if (!container || !legendContainer) return;

        // Group patients by status
        const statuses = {
            examined: { count: 0, color: 'var(--status-exam-text)', label: this.getTranslation('statusExamined') },
            scheduled: { count: 0, color: 'var(--status-scheduled-text)', label: this.getTranslation('statusScheduled') },
            completed: { count: 0, color: 'var(--status-completed-text)', label: this.getTranslation('statusCompleted') },
            archived: { count: 0, color: 'var(--text-muted)', label: this.getTranslation('statusArchived') }
        };

        let total = 0;
        this.patients.forEach(p => {
            if (statuses[p.status]) {
                statuses[p.status].count++;
                total++;
            }
        });

        if (total === 0) {
            container.innerHTML = `<div class="empty-state"><h4>No Data</h4></div>`;
            legendContainer.innerHTML = '';
            return;
        }

        // SVG parameters
        const size = 180;
        const center = size / 2;
        const radius = size * 0.4;
        let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
        
        let accumulatedPercent = 0;
        let legendHtml = '';

        // Draw segments
        Object.keys(statuses).forEach(key => {
            const stat = statuses[key];
            if (stat.count === 0) return;

            const percent = stat.count / total;
            const startAngle = accumulatedPercent * 2 * Math.PI - Math.PI / 2; // Offset by 90deg to start top center
            const endAngle = (accumulatedPercent + percent) * 2 * Math.PI - Math.PI / 2;
            
            accumulatedPercent += percent;

            // Calculate sector coordinate endpoints
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);

            const largeArcFlag = percent > 0.5 ? 1 : 0;
            
            // Pie Sector Slice Path drawing
            let pathData = '';
            
            // Check if single segment is 100%
            if (percent >= 0.999) {
                pathData = `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.01} ${center - radius} Z`;
            } else {
                pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            }

            svgContent += `<path class="pie-slice" d="${pathData}" fill="${stat.color}" opacity="0.85"/>`;

            // Build legend HTML
            const displayPercent = Math.round(percent * 100);
            legendHtml += `
                <div class="legend-item">
                    <span class="legend-dot" style="background-color: ${stat.color};"></span>
                    <strong>${stat.count}</strong> ${stat.label} (${displayPercent}%)
                </div>
            `;
        });

        // Cut donut hole for cleaner premium look
        const donutRadius = radius * 0.55;
        svgContent += `<circle cx="${center}" cy="${center}" r="${donutRadius}" fill="var(--bg-card)"/>`;
        svgContent += `</svg>`;

        container.innerHTML = svgContent;
        legendContainer.innerHTML = legendHtml;
    }

    // 9. CASE MANAGEMENT PATIENT FORM & MODAL ACTIONS
    openPatientFormModal(patient = null) {
        if (!this.addPatientModal) return;

        // Populate fields if editing, otherwise clear them
        if (patient) {
            this.formPatientId.value = patient.id;
            this.formPatientName.value = patient.name;
            this.formAgeYears.value = patient.ageYears;
            this.formAgeMonths.value = patient.ageMonths || 0;
            this.formWeight.value = patient.weight || '';
            this.formPhone.value = patient.phone || '';
            this.formExamDate.value = patient.examDate || new Date().toISOString().split('T')[0];
            this.formOpType.value = patient.opType || '';
            this.formNotes.value = patient.notes || '';
            
            if (patient.opType === 'other') {
                this.customOpGroup.style.display = 'flex';
                this.formCustomOp.value = patient.customOp || '';
            } else {
                this.customOpGroup.style.display = 'none';
                this.formCustomOp.value = '';
            }

            document.getElementById('modalTitleText').textContent = this.getTranslation('modalTitleEdit');
        } else {
            this.formPatientId.value = '';
            this.patientForm.reset();
            this.formExamDate.value = new Date().toISOString().split('T')[0];
            this.customOpGroup.style.display = 'none';
            document.getElementById('modalTitleText').textContent = this.getTranslation('modalTitleAdd');
        }

        this.addPatientModal.classList.add('active');
    }

    closePatientFormModal() {
        if (this.addPatientModal) {
            this.addPatientModal.classList.remove('active');
            this.patientForm.reset();
        }
    }

    savePatientData() {
        const id = this.formPatientId.value;
        const name = this.formPatientName.value.trim();
        const ageYears = parseInt(this.formAgeYears.value);
        const ageMonths = parseInt(this.formAgeMonths.value) || 0;
        const weight = parseFloat(this.formWeight.value) || null;
        const phone = this.formPhone.value.trim();
        const examDate = this.formExamDate.value;
        const opType = this.formOpType.value;
        const customOp = opType === 'other' ? this.formCustomOp.value.trim() : '';
        const notes = this.formNotes.value.trim();

        if (!name || isNaN(ageYears) || !examDate || !opType) {
            return;
        }

        let targetPatient = null;
        if (id) {
            // Edit existing clinical profile
            const idx = this.patients.findIndex(p => p.id === id);
            if (idx !== -1) {
                // Preserve timeline and existing status scheduling details
                const originalPatient = this.patients[idx];
                this.patients[idx] = {
                    ...originalPatient,
                    name,
                    ageYears,
                    ageMonths,
                    weight,
                    phone,
                    examDate,
                    opType,
                    customOp,
                    notes
                };
                targetPatient = this.patients[idx];
            }
        } else {
            // Register entirely new case
            const newId = 'pat_' + Date.now();
            const newPatient = {
                id: newId,
                name,
                ageYears,
                ageMonths,
                weight,
                phone,
                examDate,
                opType,
                customOp,
                notes,
                status: 'examined', // starts as Examined
                opDate: '',
                priority: '',
                timeline: [
                    {
                        date: examDate,
                        type: 'exam',
                        notes: `${this.getTranslation('visitExam')}: ${this.getSurgeryLabel(opType, customOp)}. ${notes}`
                    }
                ]
            };
            this.patients.push(newPatient);
            targetPatient = newPatient;
        }

        this.saveToDisk(targetPatient);
        this.closePatientFormModal();
        this.showToast(this.getTranslation('alertSaved'));
        
        // Refresh views
        if (this.activeView === 'dashboard') this.renderDashboard();
        else if (this.activeView === 'patients') this.renderPatientTable();
    }

    // 10. PATIENTS DATABASE RENDERERS
    renderPatientTable() {
        if (!this.patientTableBody) return;

        const searchQuery = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
        const opFilter = this.filterOperation ? this.filterOperation.value : '';
        const statusFilter = this.filterStatus ? this.filterStatus.value : '';

        // Filter patients array
        const filtered = this.patients.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) ||
                                 (p.notes && p.notes.toLowerCase().includes(searchQuery)) ||
                                 (p.phone && p.phone.includes(searchQuery)) ||
                                 (p.customOp && p.customOp.toLowerCase().includes(searchQuery));
            
            const matchesOp = !opFilter || p.opType === opFilter;
            const matchesStatus = !statusFilter || p.status === statusFilter;

            return matchesSearch && matchesOp && matchesStatus;
        });

        // Clear existing rows
        this.patientTableBody.innerHTML = '';

        if (filtered.length === 0) {
            this.dbEmptyState.style.display = 'flex';
            return;
        }

        this.dbEmptyState.style.display = 'none';

        // Populate table lines
        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.addEventListener('click', () => this.openPatientDrawer(p.id));

            // Col 1: Name and age meta
            const ageText = `${p.ageYears} ${this.getTranslation('yearsOld')} ${p.ageMonths > 0 ? `و ${p.ageMonths} ${this.getTranslation('monthsOld')}` : ''}`;
            const nameCell = `
                <div class="patient-name-cell">
                    <span class="patient-name-title">${p.name}</span>
                    <span class="patient-meta-sub">${ageText} ${p.weight ? ` | ${p.weight} ${this.getTranslation('kg')}` : ''}</span>
                </div>
            `;

            // Col 2: Diagnosis / Operation type label
            const opLabel = this.getSurgeryLabel(p.opType, p.customOp);

            // Col 3: Surgery schedule date
            let opDateLabel = '-';
            if (p.status === 'scheduled' && p.opDate) {
                const priorityBadge = p.priority === 'urgent' ? ` <span class="status-badge badge-priority-urgent">${this.getTranslation('priorityUrgent')}</span>` : '';
                opDateLabel = `<strong>${p.opDate}</strong>${priorityBadge}`;
            } else if (p.status === 'completed' && p.opDate) {
                opDateLabel = `<span style="text-decoration: line-through; opacity: 0.6;">${p.opDate}</span>`;
            }

            // Col 4: Last timeline follow-up date
            const followups = p.timeline.filter(ev => ev.type === 'followup');
            const lastFollowup = followups.length > 0 ? followups[followups.length - 1].date : '-';

            // Col 5: Status Tag
            const badgeClass = `badge-${p.status}`;
            const statusLabel = this.getTranslation(`status${p.status.charAt(0).toUpperCase() + p.status.slice(1)}`);
            const statusCell = `<span class="status-badge ${badgeClass}">${statusLabel}</span>`;

            tr.innerHTML = `
                <td>${nameCell}</td>
                <td>${opLabel}</td>
                <td>${opDateLabel}</td>
                <td>${lastFollowup}</td>
                <td>${statusCell}</td>
            `;

            this.patientTableBody.appendChild(tr);
        });
    }

    // 11. SIDE DRAWER INTERACTIONS
    openPatientDrawer(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        this.selectedPatientId = patientId;

        // Render demographic texts
        this.drawerPatientName.textContent = patient.name;
        
        const ageText = `${patient.ageYears} ${this.getTranslation('yearsOld')} ${patient.ageMonths > 0 ? `و ${patient.ageMonths} ${this.getTranslation('monthsOld')}` : ''}`;
        this.drawerPatientMeta.textContent = `${this.currentLang === 'ar' ? 'السن' : 'Age'}: ${ageText} | ${this.currentLang === 'ar' ? 'هاتف' : 'Phone'}: ${patient.phone || '-'}`;

        this.drawerOpType.textContent = this.getSurgeryLabel(patient.opType, patient.customOp);
        this.drawerWeight.textContent = patient.weight ? `${patient.weight} ${this.getTranslation('kg')}` : '-';
        this.drawerExamDate.textContent = patient.examDate;

        // Status badge configuration
        const statusLabel = this.getTranslation(`status${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}`);
        const badgeClass = `badge-${patient.status}`;
        this.drawerStatusTag.className = `status-badge ${badgeClass}`;
        this.drawerStatusTag.textContent = statusLabel;

        // Bind quick dropdown scheduler selectors
        this.drawerStatusSelector.value = patient.status;
        this.drawerOpDateInput.value = patient.opDate || '';
        this.drawerPriorityInput.value = patient.priority || 'routine';

        // Check if Scheduled to show date inputs
        if (patient.status === 'scheduled') {
            this.drawerScheduleGroupDate.style.display = 'flex';
            this.drawerScheduleGroupPriority.style.display = 'flex';
        } else {
            this.drawerScheduleGroupDate.style.display = 'none';
            this.drawerScheduleGroupPriority.style.display = 'none';
        }

        // Render historical timeline log events
        this.renderTimeline(patient.timeline);

        // Slide elements active
        this.drawerOverlay.classList.add('active');
        this.patientDrawer.classList.add('active');
    }

    closePatientDrawer() {
        this.selectedPatientId = null;
        if (this.drawerOverlay) this.drawerOverlay.classList.remove('active');
        if (this.patientDrawer) this.patientDrawer.classList.remove('active');
    }

    saveDrawerStatusChanges() {
        if (!this.selectedPatientId) return;

        const patient = this.patients.find(p => p.id === this.selectedPatientId);
        if (!patient) return;

        const newStatus = this.drawerStatusSelector.value;
        const oldStatus = patient.status;
        const opDate = this.drawerOpDateInput.value;
        const priority = this.drawerPriorityInput.value;

        // Validate scheduling inputs
        if (newStatus === 'scheduled' && !opDate) {
            return;
        }

        patient.status = newStatus;
        
        // Handle transitions log records
        if (newStatus === 'scheduled') {
            patient.opDate = opDate;
            patient.priority = priority;

            // Only log timeline event if details changed
            if (oldStatus !== 'scheduled' || patient.opDate !== opDate) {
                const priorityLabel = this.getTranslation(`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`);
                patient.timeline.push({
                    date: new Date().toISOString().split('T')[0],
                    type: 'schedule',
                    notes: `${this.getTranslation('visitScheduled')}: ${opDate} (${priorityLabel})`
                });
            }
        } else if (newStatus === 'completed') {
            // Transitioning from Scheduled -> Completed
            if (oldStatus !== 'completed') {
                patient.timeline.push({
                    date: new Date().toISOString().split('T')[0],
                    type: 'completed',
                    notes: this.getTranslation('visitCompleted')
                });
            }
        } else if (newStatus === 'archived') {
            if (oldStatus !== 'archived') {
                patient.timeline.push({
                    date: new Date().toISOString().split('T')[0],
                    type: 'archived',
                    notes: this.getTranslation('visitArchived')
                });
            }
        }

        this.saveToDisk(patient);
        this.openPatientDrawer(patient.id); // Reload drawer details
        this.showToast(this.getTranslation('alertStatusUpdated'));

        // Refresh lists
        if (this.activeView === 'dashboard') this.renderDashboard();
        else if (this.activeView === 'patients') this.renderPatientTable();
    }

    renderTimeline(timeline = []) {
        this.drawerTimeline.innerHTML = '';
        
        if (timeline.length === 0) {
            this.drawerTimeline.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted);">${this.getTranslation('noFollowups')}</p>`;
            return;
        }

        // Sort events chronologically descending
        const sorted = [...timeline].sort((a, b) => new Date(b.date) - new Date(a.date));

        sorted.forEach(ev => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'timeline-event';

            const title = this.getTranslation(`visit${ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}`);

            eventDiv.innerHTML = `
                <div class="event-header">
                    <span class="event-title">${title}</span>
                    <span class="event-date">${ev.date}</span>
                </div>
                <div class="event-notes">${ev.notes}</div>
            `;
            this.drawerTimeline.appendChild(eventDiv);
        });
    }

    // 12. ADD FOLLOW-UP MODAL ENGINE
    openFollowupModal() {
        if (!this.followupModal || !this.selectedPatientId) return;

        this.followupForm.reset();
        this.followupDate.value = new Date().toISOString().split('T')[0];
        
        // Bring modal to focus
        this.followupModal.classList.add('active');
    }

    closeFollowupModal() {
        if (this.followupModal) {
            this.followupModal.classList.remove('active');
            this.followupForm.reset();
        }
    }

    saveFollowupData() {
        if (!this.selectedPatientId) return;

        const patient = this.patients.find(p => p.id === this.selectedPatientId);
        if (!patient) return;

        const date = this.followupDate.value;
        const notes = this.followupNotes.value.trim();
        const archiveCase = this.followupArchiveCase.checked;

        if (!date || !notes) return;

        // Log follow-up event
        patient.timeline.push({
            date,
            type: 'followup',
            notes: notes
        });

        // Handle auto-archiving state transition
        if (archiveCase) {
            patient.status = 'archived';
            patient.timeline.push({
                date,
                type: 'archived',
                notes: this.getTranslation('visitArchived')
            });
        } else {
            // If they logging followups, the status shifts to completed/followups
            patient.status = 'completed';
        }

        this.saveToDisk(patient);
        this.closeFollowupModal();
        this.openPatientDrawer(patient.id); // Refresh detail drawer timeline
        this.showToast(this.getTranslation('alertFollowupSaved'));

        // Refresh main screens
        if (this.activeView === 'dashboard') this.renderDashboard();
        else if (this.activeView === 'patients') this.renderPatientTable();
    }

    // 13. SCHEDULE TIMELINE LIST RENDERER
    renderScheduleList() {
        if (!this.scheduleItemsContainer) return;

        const priorityFilter = this.scheduleFilterPriority ? this.scheduleFilterPriority.value : '';

        // Extract patients with status scheduled
        const scheduledPatients = this.patients.filter(p => {
            const matchesStatus = p.status === 'scheduled';
            const matchesPriority = !priorityFilter || p.priority === priorityFilter;
            return matchesStatus && matchesPriority;
        });

        // Sort upcoming scheduled operations descending/ascending? Chronological ascending (soonest first)
        scheduledPatients.sort((a, b) => new Date(a.opDate) - new Date(b.opDate));

        this.scheduleItemsContainer.innerHTML = '';

        if (scheduledPatients.length === 0) {
            this.scheduleItemsContainer.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <h4>${this.getTranslation('emptyStateTitle')}</h4>
                    <p>${this.getTranslation('emptyStateDesc')}</p>
                </div>
            `;
            return;
        }

        scheduledPatients.forEach(p => {
            const item = document.createElement('div');
            item.className = 'schedule-item';
            item.addEventListener('click', () => this.openPatientDrawer(p.id));

            // Extract date details
            const dateObj = new Date(p.opDate);
            const day = dateObj.getDate() || '?';
            const month = dateObj.toLocaleDateString(this.currentLang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short' });

            const priorityText = this.getTranslation(`priority${p.priority.charAt(0).toUpperCase() + p.priority.slice(1)}`);
            const opLabel = this.getSurgeryLabel(p.opType, p.customOp);
            const priorityBadge = p.priority === 'urgent' 
                ? `<span class="status-badge badge-priority-urgent">${priorityText}</span>` 
                : `<span class="status-badge badge-scheduled">${priorityText}</span>`;

            item.innerHTML = `
                <div class="schedule-info">
                    <div class="schedule-time">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    
                    <div class="schedule-details">
                        <h4>${p.name}</h4>
                        <p>${opLabel} | ${this.getTranslation('lblCaseStatus')}: ${priorityBadge}</p>
                    </div>
                </div>
                
                <div>
                    <!-- Link SVG icon indicating detail file -->
                    <svg style="width: 20px; height: 20px; stroke: var(--text-muted); fill:none; stroke-width:2;" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </div>
            `;

            this.scheduleItemsContainer.appendChild(item);
        });
    }

    // 14. DATA UTILITY ACTIONS (BACKUP IMPORT/EXPORT/RESET)
    exportBackup() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.patients, null, 4));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        
        const timestamp = new Date().toISOString().split('T')[0];
        dlAnchorElem.setAttribute("download", `pediatric_surgery_clinic_backup_${timestamp}.json`);
        dlAnchorElem.click();
    }

    handleImportBackup(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                // Basic structural verification
                if (Array.isArray(imported)) {
                    this.patients = imported;
                    this.saveToDisk();
                    this.showToast(this.getTranslation('alertImported'));
                    this.navigateToView(this.activeView);
                } else {
                    alert(this.getTranslation('alertInvalidBackup'));
                }
            } catch (err) {
                alert(this.getTranslation('alertInvalidBackup'));
                console.error(err);
            }
        };
        reader.readAsText(file);
        
        // Reset input value to allow triggering change on same file again
        this.importFileInput.value = '';
    }

    async resetDatabase() {
        if (confirm(this.getTranslation('confirmReset'))) {
            if (supabaseClient) {
                try {
                    const { error } = await supabaseClient
                        .from('patients')
                        .delete()
                        .neq('id', '0');
                    if (error) throw error;
                } catch (err) {
                    console.error(err);
                    this.showToast("Cloud reset failed.");
                    return;
                }
            }
            this.patients = [];
            this.saveToDisk();
            this.showToast(this.getTranslation('alertResetDone'));
            this.navigateToView(this.activeView);
        }
    }

    // 15. ALERTS AND CUSTOM NOTIFICATIONS
    showToast(message) {
        if (!this.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        
        // Checkmark Icon
        toast.innerHTML = `
            <svg class="toast-icon" viewBox="0 0 24 24" style="stroke:#047857; fill:none; stroke-width:2;"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${message}</span>
        `;
        
        this.toastContainer.appendChild(toast);

        // Terminate toast alert after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// Instantiate App on Document Loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ClinicApp();
});
