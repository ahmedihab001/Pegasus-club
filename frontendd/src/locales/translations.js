export const translations = {
  // General
  welcome: { en: "Welcome", ar: "مرحباً" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  sports: { en: "Sports", ar: "الرياضات" },
  programs: { en: "Programs", ar: "البرامج" },
  schedule: { en: "Schedule", ar: "الجدول" },
  events: { en: "Events", ar: "الفعاليات" },
  profile: { en: "My Profile", ar: "ملفي الشخصي" },
  admin: { en: "Admin", ar: "مدير" },
  card: { en: "Card", ar: "البطاقة" },
  payment: { en: "Payment", ar: "الدفع" },
  logout: { en: "Logout", ar: "تسجيل خروج" },
  login: { en: "Login", ar: "تسجيل دخول" },
  signup: { en: "Sign Up", ar: "إنشاء حساب" },
  
  // Dashboard
  welcomeBack: { en: "Welcome back", ar: "مرحباً بعودتك" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  memberId: { en: "Member ID", ar: "رقم العضوية" },
  role: { en: "Role", ar: "الدور" },
  totalActivities: { en: "Total Activities", ar: "إجمالي الأنشطة" },
  sportBookings: { en: "Sport Bookings", ar: "حجوزات الرياضات" },
  eventsJoined: { en: "Events Joined", ar: "الفعاليات المنضم لها" },
  programsEnrolled: { en: "Programs Enrolled", ar: "البرامج المسجل فيها" },
  upcomingActivities: { en: "Upcoming Activities", ar: "الأنشطة القادمة" },
  pastActivities: { en: "Past Activities", ar: "الأنشطة السابقة" },
  myPrograms: { en: "My Programs", ar: "برامجي" },
  
  // Sports
  bookNow: { en: "Book Now", ar: "احجز الآن" },
  details: { en: "Details", ar: "التفاصيل" },
  coaches: { en: "Coaches", ar: "المدربين" },
  share: { en: "Share", ar: "مشاركة" },
  search: { en: "Search sports...", ar: "ابحث عن رياضات..." },
  wishlist: { en: "Wishlist", ar: "المفضلة" },
  price: { en: "Price", ar: "السعر" },
  description: { en: "Description", ar: "الوصف" },
  
  // Events
  joinEvent: { en: "Join Event", ar: "انضم للفعالية" },
  cancelRegistration: { en: "Cancel Registration", ar: "إلغاء التسجيل" },
  date: { en: "Date", ar: "التاريخ" },
  location: { en: "Location", ar: "الموقع" },
  capacity: { en: "Capacity", ar: "السعة" },
  registered: { en: "You are registered", ar: "أنت مسجل" },
  
  // Programs
  enrollNow: { en: "Enroll Now", ar: "سجل الآن" },
  cancelEnrollment: { en: "Cancel Enrollment", ar: "إلغاء التسجيل" },
  duration: { en: "Duration", ar: "المدة" },
  coach: { en: "Coach", ar: "المدرب" },
  schedule: { en: "Schedule", ar: "الجدول" },
  
  // Payment
  paymentSummary: { en: "Payment Summary", ar: "ملخص الدفع" },
  amount: { en: "Amount", ar: "المبلغ" },
  cardDetails: { en: "Card Details", ar: "تفاصيل البطاقة" },
  cardNumber: { en: "Card Number", ar: "رقم البطاقة" },
  expiry: { en: "MM/YY", ar: "شهر/سنة" },
  cvc: { en: "CVC", ar: "رمز الأمان" },
  payNow: { en: "Pay Now", ar: "ادفع الآن" },
  processing: { en: "Processing...", ar: "جاري المعالجة..." },
  
  // AI Assistant
  aiAssistant: { en: "AI Assistant", ar: "المساعد الذكي" },
  typeMessage: { en: "Type a message...", ar: "اكتب رسالة..." },
  quickActions: { en: "QUICK ACTIONS", ar: "إجراءات سريعة" },
  online: { en: "Online", ar: "متصل" },
  
  // Buttons
  save: { en: "Save", ar: "حفظ" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  edit: { en: "Edit", ar: "تعديل" },
  delete: { en: "Delete", ar: "حذف" },
  add: { en: "Add", ar: "إضافة" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  
  // Messages
  loginRequired: { en: "Please login first", ar: "يرجى تسجيل الدخول أولاً" },
  bookingSuccess: { en: "Booking confirmed successfully!", ar: "تم تأكيد الحجز بنجاح!" },
  bookingFailed: { en: "Booking failed. Please try again.", ar: "فشل الحجز. يرجى المحاولة مرة أخرى." },
  duplicateBooking: { en: "You already have a booking for this session!", ar: "لديك بالفعل حجز لهذه الجلسة!" },
  registrationSuccess: { en: "Successfully registered!", ar: "تم التسجيل بنجاح!" },
  enrollmentSuccess: { en: "Successfully enrolled!", ar: "تم التسجيل بنجاح!" },
  cancellationSuccess: { en: "Cancelled successfully!", ar: "تم الإلغاء بنجاح!" },
  
  // Admin
  adminPanel: { en: "Admin Panel", ar: "لوحة تحكم المدير" },
  users: { en: "Users", ar: "المستخدمين" },
  addUser: { en: "Add User", ar: "إضافة مستخدم" },
  statistics: { en: "Statistics", ar: "الإحصائيات" }
};

export const getTranslation = (key, language) => {
  return translations[key]?.[language] || translations[key]?.en || key;
};