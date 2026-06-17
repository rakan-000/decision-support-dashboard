export type Locale = "ar" | "en";

export const LOCALES: Locale[] = ["ar", "en"];

/** Flat dictionary keyed by string id. Arabic is treated as a first-class language. */
export const dictionary: Record<string, { ar: string; en: string }> = {
  "app.name": { ar: "منصة ذكاء القرار للخدمات المشتركة", en: "Shared Services Decision Intelligence" },
  "app.short": { ar: "ذكاء القرار", en: "Decision Intelligence" },
  "app.tagline": {
    ar: "تحويل الوثائق التنظيمية إلى ذكاء تنفيذي",
    en: "Turning organizational documents into executive intelligence",
  },

  // Chapters — names + statements (editorial system)
  "ch.upload.name": { ar: "الاستيعاب الذكي", en: "Intelligence Intake" },
  "ch.upload.statement": { ar: "ارفع الوثائق، اصنع الذكاء", en: "Upload Intelligence" },
  "ch.kb.name": { ar: "أساس المعرفة", en: "Knowledge Foundation" },
  "ch.kb.statement": { ar: "محرك المعرفة المؤسسية", en: "Organizational Knowledge Engine" },
  "ch.analysis.name": { ar: "محرك التحليل", en: "Analysis Engine" },
  "ch.analysis.statement": { ar: "حوّل الوثائق إلى قرارات", en: "Transform Documents Into Decisions" },
  "ch.governance.name": { ar: "طبقة الحوكمة", en: "Governance Layer" },
  "ch.governance.statement": { ar: "الحوكمة تبدأ بالرؤية", en: "Governance Starts With Visibility" },
  "ch.recommendations.name": { ar: "التوصيات", en: "Recommendations" },
  "ch.recommendations.statement": { ar: "الدليل قبل التوصية", en: "Evidence Before Advice" },
  "ch.decisions.name": { ar: "دعم القرار", en: "Decision Support" },
  "ch.decisions.statement": { ar: "مركز القرار التنفيذي", en: "Executive Decision Center" },
  "ch.departments.name": { ar: "ذكاء الإدارات", en: "Department Intelligence" },
  "ch.departments.statement": { ar: "ذكاءٌ موحّد عبر الإدارات", en: "Unified Intelligence Across Departments" },
  "ch.dashboard.name": { ar: "مركز القيادة", en: "Executive Command Center" },
  "ch.dashboard.statement": { ar: "غرفة القيادة التنفيذية", en: "The Command Center" },
  "ch.history.name": { ar: "سجل المنظومة", en: "System Ledger" },
  "ch.history.statement": { ar: "كل حركة موثقة", en: "Every Move Recorded" },
  "ch.next": { ar: "الفصل التالي", en: "Next Chapter" },
  "ch.continue": { ar: "تابع الرحلة", en: "Continue the journey" },

  // Ecosystem
  "eco.eyebrow": { ar: "منظومة الذكاء", en: "Intelligence Ecosystem" },
  "eco.title": { ar: "تنقل عبر الشبكة", en: "Navigate the Network" },
  "eco.engine": { ar: "محرك التحليل", en: "Analysis Engine" },
  "eco.open": { ar: "خريطة المنظومة", en: "Ecosystem Map" },
  "eco.hint": { ar: "كل وحدة متصلة بمحرك التحليل - اختر عقدة للانتقال", en: "Every module is connected to the analysis engine - choose a node to travel" },

  // Navigation
  "nav.home": { ar: "الرئيسية التنفيذية", en: "Executive Home" },
  "nav.upload": { ar: "مركز الرفع", en: "Upload Center" },
  "nav.analysis": { ar: "مساحة التحليل", en: "Analysis Workspace" },
  "nav.governance": { ar: "الحوكمة والامتثال", en: "Governance & Compliance" },
  "nav.recommendations": { ar: "مركز التوصيات", en: "Recommendations" },
  "nav.decisions": { ar: "دعم القرار", en: "Decision Support" },
  "nav.departments": { ar: "ذكاء الإدارات", en: "Department Intelligence" },
  "nav.dashboard": { ar: "اللوحة التنفيذية", en: "Executive Dashboard" },
  "nav.knowledge": { ar: "قاعدة المعرفة الخاصة", en: "Private Knowledge Base" },
  "nav.history": { ar: "سجل النشاط", en: "Activity History" },
  "nav.settings": { ar: "الإعدادات", en: "Settings" },
  "nav.section.intelligence": { ar: "الذكاء", en: "Intelligence" },
  "nav.section.governance": { ar: "الحوكمة", en: "Governance" },
  "nav.section.system": { ar: "النظام", en: "System" },

  // Common
  "common.search": { ar: "بحث", en: "Search" },
  "common.searchPlaceholder": { ar: "ابحث في الوثائق والتحليلات...", en: "Search documents and analyses..." },
  "common.all": { ar: "الكل", en: "All" },
  "common.department": { ar: "الإدارة", en: "Department" },
  "common.priority": { ar: "الأولوية", en: "Priority" },
  "common.status": { ar: "الحالة", en: "Status" },
  "common.date": { ar: "التاريخ", en: "Date" },
  "common.owner": { ar: "المالك", en: "Owner" },
  "common.confidence": { ar: "درجة الثقة", en: "Confidence" },
  "common.viewAnalysis": { ar: "عرض التحليل", en: "View Analysis" },
  "common.export": { ar: "تصدير", en: "Export" },
  "common.exportPdf": { ar: "تصدير PDF", en: "Export PDF" },
  "common.exportPptx": { ar: "تصدير PowerPoint", en: "Export PowerPoint" },
  "common.exportSummary": { ar: "تصدير الملخص", en: "Export Summary" },
  "common.exporting": { ar: "جارٍ التصدير...", en: "Exporting..." },
  "common.exportFailed": { ar: "فشل التصدير", en: "Export failed" },
  "common.export.title": { ar: "تصدير التقرير التنفيذي", en: "Export Executive Report" },
  "common.loading": { ar: "جارٍ التحميل...", en: "Loading..." },
  "common.noData": { ar: "لا توجد بيانات", en: "No data available" },
  "common.unassigned": { ar: "غير محدد", en: "Unassigned" },
  "common.filters": { ar: "عوامل التصفية", en: "Filters" },
  "common.cancel": { ar: "إلغاء", en: "Cancel" },
  "common.save": { ar: "حفظ", en: "Save" },
  "common.delete": { ar: "حذف", en: "Delete" },
  "common.back": { ar: "رجوع", en: "Back" },
  "common.viewAll": { ar: "عرض الكل", en: "View all" },
  "common.evidence": { ar: "الدليل", en: "Evidence" },
  "common.source": { ar: "المصدر", en: "Source" },

  // Privacy
  "privacy.secureLabel": { ar: "قناة آمنة", en: "Secure Channel" },
  "privacy.title": { ar: "بيئة استخبارات آمنة", en: "Secure Intelligence Environment" },
  "privacy.body": {
    ar: "يجب رفع الملفات الحساسة فقط بعد موافقة المؤسسة على مزود الذكاء الاصطناعي وإعدادات التخزين المختارة. تبقى الوثائق التنظيمية مخزّنة بشكل خاص على الخادم.",
    en: "Sensitive files should only be uploaded after the organization has approved the selected AI provider and storage configuration. Organizational documents remain stored privately on the server.",
  },
  "privacy.aiReady": { ar: "مزود الذكاء الاصطناعي مهيأ", en: "AI provider configured" },
  "privacy.aiNotReady": {
    ar: "مزود الذكاء الاصطناعي غير مهيأ - يعمل في وضع العرض التوضيحي",
    en: "AI provider not configured - running in demo mode",
  },
  "privacy.storageLocal": { ar: "التخزين محلي وخاص", en: "Storage is local and private" },
  "privacy.embeddingsExternal": { ar: "تُحسب التضمينات عبر مزود خارجي", en: "Embeddings computed via external provider" },
  "privacy.embeddingsLocal": { ar: "تُحسب التضمينات محلياً", en: "Embeddings computed locally" },

  // Home — cinematic story
  "hero.eyebrow": { ar: "منصة ذكاء القرار", en: "Decision Intelligence Platform" },
  "hero.title1": { ar: "حوّل وثائقك إلى", en: "Turn documents into" },
  "hero.title2": { ar: "ذكاء تنفيذي", en: "executive intelligence" },
  "hero.sub": {
    ar: "منظومة ذكاء حيّة تقرأ وثائق مؤسستك وتفهمها وتحوّلها إلى رؤى ومخاطر وتوصيات وقرارات - وفق سياساتك الداخلية وسياق القطاع غير الربحي السعودي.",
    en: "A living intelligence system that reads your organization's documents, understands them, and turns them into insights, risks, recommendations, and decisions - grounded in your internal policies and the Saudi nonprofit context.",
  },
  "hero.ctaPrimary": { ar: "ابدأ الاستيعاب", en: "Begin Intake" },
  "hero.scroll": { ar: "مرّر للاستكشاف", en: "Scroll to explore" },
  "hero.h1a": { ar: "رؤية أعمق،", en: "Deeper insight," },
  "hero.h1b": { ar: "قرار أدق،", en: "sharper decisions," },
  "hero.h1c": { ar: "مستقبل أفضل.", en: "a better future." },
  "hero.connected": { ar: "النظام متصل", en: "System Connected" },
  "hero.explore": { ar: "استكشاف المنصة", en: "Explore the Platform" },
  "hero.report": { ar: "عرض التقرير التنفيذي", en: "Executive Report" },
  "hero.indexLabel": { ar: "مؤشر الأداء العام", en: "Overall Performance Index" },
  "hero.indexCaption": {
    ar: "مؤشر مركّب من درجتي الامتثال والحوكمة عبر المنظومة",
    en: "Composite of compliance and governance across the system",
  },
  "hero.network": { ar: "شبكة الذكاء المؤسسي", en: "Organizational Intelligence Network" },
  "hero.ctaSecondary": { ar: "اللوحة التنفيذية", en: "Executive Dashboard" },
  "home.ecoTitle": { ar: "منظومة مترابطة، لا صفحات منفصلة", en: "A connected ecosystem, not separate pages" },
  "home.journeyTitle": { ar: "رحلة الذكاء", en: "The Intelligence Journey" },
  "home.journeySub": { ar: "من الوثيقة إلى القرار", en: "From Document to Decision" },
  "home.journey1.title": { ar: "الاستيعاب", en: "Intake" },
  "home.journey1.body": { ar: "ارفع الوثائق فتُقرأ وتُستخرج وتُصنّف تلقائياً", en: "Upload documents; they are read, extracted, and classified automatically" },
  "home.journey2.title": { ar: "المعرفة", en: "Knowledge" },
  "home.journey2.body": { ar: "تُقارن الوثائق بسياساتك وأدلتك كمصدر للحقيقة", en: "Documents are weighed against your policies and manuals as the source of truth" },
  "home.journey3.title": { ar: "التحليل", en: "Analysis" },
  "home.journey3.body": { ar: "يولّد المحرك رؤى ومخاطر وفجوات وتوصيات مدعومة بالأدلة", en: "The engine generates evidence-backed insights, risks, gaps, and recommendations" },
  "home.journey4.title": { ar: "القرار", en: "Decision" },
  "home.journey4.body": { ar: "تصل القيادة إلى إجراءات تنفيذية وتقارير جاهزة للقرار", en: "Leadership reaches executive actions and decision-ready reports" },
  "home.liveTitle": { ar: "أحدث الذكاء", en: "Latest Intelligence" },

  // Home
  "home.greeting": { ar: "مرحباً بك", en: "Welcome" },
  "home.subtitle": {
    ar: "نظرة تنفيذية شاملة على الوثائق والمخاطر والإجراءات",
    en: "An executive overview of documents, risks, and actions",
  },
  "home.recent": { ar: "أحدث التحليلات", en: "Recent Analyses" },
  "home.quickUpload": { ar: "رفع سريع", en: "Quick Upload" },
  "home.criticalAlerts": { ar: "تنبيهات حرجة", en: "Critical Alerts" },

  // Metrics
  "metric.totalDocuments": { ar: "إجمالي الوثائق", en: "Total Documents" },
  "metric.activeRisks": { ar: "المخاطر النشطة", en: "Active Risks" },
  "metric.openActions": { ar: "الإجراءات المفتوحة", en: "Open Actions" },
  "metric.closedActions": { ar: "الإجراءات المغلقة", en: "Closed Actions" },
  "metric.complianceScore": { ar: "درجة الامتثال", en: "Compliance Score" },
  "metric.governanceScore": { ar: "درجة الحوكمة", en: "Governance Score" },
  "metric.recommendations": { ar: "التوصيات", en: "Recommendations" },
  "metric.departments": { ar: "الإدارات", en: "Departments" },

  // Dashboard
  "dashboard.title": { ar: "اللوحة التنفيذية", en: "Executive Dashboard" },
  "dashboard.riskHeatmap": { ar: "خريطة حرارة المخاطر", en: "Risk Heatmap" },
  "dashboard.deptDistribution": { ar: "توزيع الإدارات", en: "Department Distribution" },
  "dashboard.priorityMatrix": { ar: "مصفوفة الأولويات", en: "Priority Matrix" },
  "dashboard.recommendationStatus": { ar: "حالة التوصيات", en: "Recommendation Status" },
  "dashboard.deptComparison": { ar: "مقارنة الإدارات", en: "Department Comparison" },
  "dashboard.scores": { ar: "مؤشرات الحوكمة والامتثال", en: "Governance & Compliance Scores" },

  // Upload
  "upload.title": { ar: "مركز الرفع", en: "Upload Center" },
  "upload.subtitle": {
    ar: "ارفع ملفات PDF أو Excel أو Word لتحليلها وتحويلها إلى ذكاء تنفيذي",
    en: "Upload PDF, Excel, or Word files to analyze and turn into executive intelligence",
  },
  "upload.dropHere": { ar: "اسحب الملفات هنا أو انقر للاختيار", en: "Drag files here or click to browse" },
  "upload.supported": { ar: "المدعوم: PDF, DOCX, XLSX", en: "Supported: PDF, DOCX, XLSX" },
  "upload.queue": { ar: "قائمة المعالجة", en: "Processing Queue" },
  "upload.preTag": { ar: "تصنيف مبدئي للإدارة (اختياري)", en: "Pre-tag department (optional)" },
  "upload.startAnalysis": { ar: "بدء التحليل", en: "Start Analysis" },
  "upload.processing": { ar: "جارٍ المعالجة", en: "Processing" },
  "upload.terminal": { ar: "محطة استيعاب الذكاء", en: "Intelligence Intake Terminal" },
  "upload.ready": { ar: "النظام جاهز", en: "System Ready" },

  // Analysis sections
  "analysis.title": { ar: "مساحة التحليل", en: "Analysis Workspace" },
  "analysis.overview": { ar: "نظرة عامة", en: "Overview" },
  "analysis.executiveSummary": { ar: "الملخص التنفيذي", en: "Executive Summary" },
  "analysis.keyInsights": { ar: "أبرز الرؤى", en: "Key Insights" },
  "analysis.risks": { ar: "المخاطر والقضايا", en: "Risks & Issues" },
  "analysis.governanceReview": { ar: "مراجعة الحوكمة", en: "Governance Review" },
  "analysis.complianceReview": { ar: "مراجعة الامتثال", en: "Compliance Review" },
  "analysis.gapAnalysis": { ar: "تحليل الفجوات", en: "Gap Analysis" },
  "analysis.rootCause": { ar: "تحليل السبب الجذري", en: "Root Cause Analysis" },
  "analysis.swot": { ar: "تحليل سوات", en: "SWOT Analysis" },
  "analysis.pestel": { ar: "تحليل بيستل", en: "PESTEL Analysis" },
  "analysis.kpiOpportunities": { ar: "فرص مؤشرات الأداء", en: "KPI Opportunities" },
  "analysis.recommendations": { ar: "التوصيات", en: "Recommendations" },
  "analysis.executiveActions": { ar: "الإجراءات التنفيذية", en: "Executive Actions" },
  "analysis.kbSources": { ar: "مصادر قاعدة المعرفة المستخدمة", en: "Knowledge Base Sources Used" },
  "analysis.notApplicable": { ar: "غير منطبق على هذه الوثيقة", en: "Not applicable to this document" },
  "analysis.insufficientEvidence": { ar: "أدلة غير كافية", en: "Insufficient Evidence Found" },
  "analysis.demoBadge": { ar: "تحليل توضيحي (بدون ذكاء اصطناعي)", en: "Demo analysis (no AI)" },
  "analysis.realBadge": { ar: "تحليل بالذكاء الاصطناعي", en: "AI analysis" },

  // Analysis Workspace
  "ws.searchPlaceholder": { ar: "ابحث بالاسم أو الإدارة أو المالك أو المحتوى...", en: "Search by name, department, owner, or content..." },
  "ws.sortBy": { ar: "ترتيب حسب", en: "Sort by" },
  "ws.sortNewest": { ar: "الأحدث أولاً", en: "Newest first" },
  "ws.sortPriority": { ar: "الأعلى أولوية", en: "Highest priority" },
  "ws.sortCompliance": { ar: "الأقل امتثالاً", en: "Lowest compliance" },
  "ws.sortRisk": { ar: "الأكثر مخاطر", en: "Highest risk count" },
  "ws.sortConfidence": { ar: "الأعلى ثقة", en: "Highest confidence" },
  "ws.analysisType": { ar: "نوع التحليل", en: "Analysis type" },
  "ws.demo": { ar: "توضيحي", en: "Demo" },
  "ws.realAi": { ar: "ذكاء اصطناعي", en: "Real AI" },
  "ws.fileType": { ar: "نوع الملف", en: "File type" },
  "ws.kbFilter": { ar: "مصادر المعرفة", en: "KB sources" },
  "ws.withKb": { ar: "مع مصادر", en: "With sources" },
  "ws.withoutKb": { ar: "بدون مصادر", en: "Without sources" },
  "ws.dateFrom": { ar: "من تاريخ", en: "From date" },
  "ws.dateTo": { ar: "إلى تاريخ", en: "To date" },
  "ws.results": { ar: "النتائج", en: "Results" },
  "ws.noResults": { ar: "لا توجد وثائق مطابقة للمرشحات", en: "No documents match the current filters" },
  "ws.clear": { ar: "مسح المرشحات", en: "Clear filters" },
  "ws.openAnalysis": { ar: "فتح التحليل", en: "Open analysis" },
  "ws.sources": { ar: "مصادر", en: "sources" },
  "ws.risks": { ar: "مخاطر", en: "risks" },

  // Document processing statuses
  "docstatus.queued": { ar: "في الانتظار", en: "Queued" },
  "docstatus.extracting": { ar: "جارٍ الاستخراج", en: "Extracting" },
  "docstatus.classifying": { ar: "جارٍ التصنيف", en: "Classifying" },
  "docstatus.analyzing": { ar: "جارٍ التحليل", en: "Analyzing" },
  "docstatus.complete": { ar: "مكتمل", en: "Complete" },
  "docstatus.failed": { ar: "فشل", en: "Failed" },

  // SWOT
  "swot.strengths": { ar: "نقاط القوة", en: "Strengths" },
  "swot.weaknesses": { ar: "نقاط الضعف", en: "Weaknesses" },
  "swot.opportunities": { ar: "الفرص", en: "Opportunities" },
  "swot.threats": { ar: "التهديدات", en: "Threats" },

  // PESTEL
  "pestel.political": { ar: "سياسي", en: "Political" },
  "pestel.economic": { ar: "اقتصادي", en: "Economic" },
  "pestel.social": { ar: "اجتماعي", en: "Social" },
  "pestel.technological": { ar: "تقني", en: "Technological" },
  "pestel.environmental": { ar: "بيئي", en: "Environmental" },
  "pestel.legal": { ar: "قانوني/تنظيمي", en: "Legal / Regulatory" },

  // Knowledge base
  "kb.title": { ar: "قاعدة المعرفة الخاصة", en: "Private Knowledge Base" },
  "kb.subtitle": {
    ar: "المصدر الأساسي للحقيقة: السياسات والإجراءات وأدلة الحوكمة ومصفوفة الصلاحيات",
    en: "The primary source of truth: policies, procedures, governance manuals, and the delegation of authority matrix",
  },
  "kb.addDocument": { ar: "إضافة وثيقة", en: "Add Document" },
  "kb.type": { ar: "النوع", en: "Type" },
  "kb.active": { ar: "نشط", en: "Active" },
  "kb.version": { ar: "الإصدار", en: "Version" },
  "kb.total": { ar: "إجمالي الوثائق", en: "Total Documents" },
  "kb.chunks": { ar: "المقاطع المفهرسة", en: "Indexed Chunks" },
  "kb.activeCount": { ar: "النشطة", en: "Active" },
  "kb.scope": { ar: "النطاق", en: "Scope" },
  "kb.orgWide": { ar: "على مستوى المؤسسة", en: "Organization-wide" },
  "kb.effectiveDate": { ar: "تاريخ السريان", en: "Effective Date" },
  "kb.description": { ar: "الوصف", en: "Description" },
  "kb.descriptionPlaceholder": { ar: "وصف موجز يستخدم كعنوان للمصدر", en: "Short description used as the source title" },
  "kb.versionPlaceholder": { ar: "مثال: 1.0", en: "e.g. 1.0" },
  "kb.upload": { ar: "رفع وثيقة", en: "Upload Document" },
  "kb.uploading": { ar: "جارٍ الرفع والفهرسة...", en: "Uploading and indexing..." },
  "kb.selectFile": { ar: "اختر ملف PDF أو DOCX أو XLSX", en: "Select a PDF, DOCX, or XLSX file" },
  "kb.selectType": { ar: "اختر النوع", en: "Select type" },
  "kb.filterType": { ar: "تصفية حسب النوع", en: "Filter by type" },
  "kb.filterDept": { ar: "تصفية حسب الإدارة", en: "Filter by department" },
  "kb.inactive": { ar: "غير نشط", en: "Inactive" },
  "kb.empty": { ar: "لم تتم إضافة أي وثائق مرجعية بعد", en: "No reference documents added yet" },
  "kb.privacyTitle": { ar: "خصوصية قاعدة المعرفة", en: "Knowledge Base Privacy" },
  "kb.privacyBody": {
    ar: "تُخزَّن وثائق قاعدة المعرفة محلياً بشكل خاص وتُستخدم كمصدر الحقيقة الداخلي عند التحليل. لا يتم استخدام أي ذكاء اصطناعي خارجي أو تضمينات ما لم يتم تهيئتها صراحةً.",
    en: "Knowledge base files are stored locally and privately, and are used as the internal source of truth during analysis. No external AI or embeddings are used unless explicitly configured.",
  },
  "kb.retrievalLocal": { ar: "الاسترجاع محلي (معجمي) بدون تضمينات خارجية", en: "Retrieval is local (lexical) with no external embeddings" },
  "kb.retrievalExternal": { ar: "الاسترجاع يستخدم تضمينات خارجية", en: "Retrieval uses external embeddings" },

  // Governance
  "governance.title": { ar: "مركز الحوكمة والامتثال", en: "Governance & Compliance Center" },
  "governance.policyAlignment": { ar: "محاذاة السياسات", en: "Policy Alignment" },
  "governance.gapSummary": { ar: "ملخص الفجوات", en: "Gap Summary" },
  "governance.lowScore": { ar: "وثائق بدرجات منخفضة", en: "Documents with Low Scores" },
  "governance.complianceIssues": { ar: "قضايا الامتثال", en: "Compliance Issues" },
  "governance.alignmentDesc": { ar: "متوسط محاذاة الوثائق مع السياسات الداخلية", en: "Average alignment of documents with internal policies" },

  // Recommendations
  "recommendations.title": { ar: "مركز التوصيات", en: "Recommendations Center" },
  "rec.status.pending": { ar: "قيد المراجعة", en: "Pending" },
  "rec.status.accepted": { ar: "مقبولة", en: "Accepted" },
  "rec.status.rejected": { ar: "مرفوضة", en: "Rejected" },
  "rec.status.implemented": { ar: "منفذة", en: "Implemented" },

  // Decisions
  "decisions.title": { ar: "مركز دعم القرار", en: "Decision Support Center" },
  "decisions.briefs": { ar: "مذكرات القرار التنفيذية", en: "Executive Decision Briefs" },
  "decisions.actionBoard": { ar: "لوحة الإجراءات التنفيذية", en: "Executive Action Board" },
  "decisions.immediate": { ar: "بنود تتطلب اهتماماً فورياً", en: "Immediate Attention Items" },
  "decisions.recommended": { ar: "قرارات موصى بها", en: "Recommended Decisions" },
  "decisions.expectedOutcome": { ar: "النتيجة المتوقعة", en: "Expected outcome" },
  "decisions.noImmediate": { ar: "لا توجد بنود حرجة حالياً", en: "No critical items at this time" },

  // Departments
  "dept.documents": { ar: "الوثائق", en: "Documents" },
  "dept.risks": { ar: "المخاطر النشطة", en: "Active Risks" },
  "dept.actions": { ar: "الإجراءات المفتوحة", en: "Open Actions" },
  "dept.view": { ar: "عرض الإدارة", en: "View department" },
  "dept.recentDocs": { ar: "أحدث الوثائق", en: "Recent Documents" },

  // Settings
  "settings.theme": { ar: "المظهر", en: "Theme" },
  "settings.themeLight": { ar: "فاتح", en: "Light" },
  "settings.themeDark": { ar: "داكن", en: "Dark" },
  "settings.aiStatus": { ar: "حالة مزود الذكاء الاصطناعي", en: "AI Provider Status" },
  "settings.storageMode": { ar: "وضع التخزين", en: "Storage Mode" },
  "settings.storageLocal": { ar: "محلي وخاص", en: "Local and private" },
  "settings.privacyMode": { ar: "وضع الخصوصية", en: "Privacy Mode" },
  "settings.privacyOn": { ar: "مفعّل - تبقى الملفات محلية", en: "Enabled - files remain local" },
  "settings.embeddings": { ar: "التضمينات", en: "Embeddings" },
  "settings.future": { ar: "إعدادات مستقبلية", en: "Future Configuration" },
  "settings.futureDesc": { ar: "تُضاف عبر متغيرات البيئة دون تغييرات في الكود", en: "Configured via environment variables with no code changes" },
  "settings.configured": { ar: "مهيأ", en: "Configured" },
  "settings.notConfigured": { ar: "غير مهيأ", en: "Not configured" },
  "settings.demoMode": { ar: "وضع العرض التوضيحي", en: "Demo mode" },

  // Departments
  "departments.title": { ar: "مركز ذكاء الإدارات", en: "Department Intelligence Center" },

  // History
  "history.title": { ar: "سجل النشاط", en: "Activity History" },

  // Settings
  "settings.title": { ar: "الإعدادات", en: "Settings" },
  "settings.language": { ar: "اللغة", en: "Language" },
  "settings.providers": { ar: "إعدادات المزودين", en: "Provider Configuration" },
  "settings.seed": { ar: "تحميل بيانات تجريبية", en: "Load demo data" },
  "settings.seedDesc": {
    ar: "تعبئة المنصة ببيانات عرض توضيحي لاستكشاف الواجهات قبل رفع وثائق حقيقية.",
    en: "Populate the platform with demonstration data to explore the interface before uploading real documents.",
  },

  // Status labels
  "status.open": { ar: "مفتوح", en: "Open" },
  "status.in_progress": { ar: "قيد التنفيذ", en: "In Progress" },
  "status.complete": { ar: "مكتمل", en: "Complete" },
  "status.overdue": { ar: "متأخر", en: "Overdue" },
  "status.mitigated": { ar: "تمت المعالجة", en: "Mitigated" },
  "status.closed": { ar: "مغلق", en: "Closed" },
};

export function translate(key: string, locale: Locale): string {
  const entry = dictionary[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en;
}
