import { 
  LayoutDashboard, UserPlus, BookOpen, FileText, Users, MessageSquare, 
  Calendar, GraduationCap, ClipboardList, DollarSign, BarChart3, 
  UserCheck, Mail, Library, CreditCard, Clock, School, Building 
} from "lucide-react";

export default function FeaturesSection() {
  const coreModules = [
    { icon: LayoutDashboard, title: "Multiple Dashboards", description: "Comprehensive overview for all user roles" },
    { icon: UserPlus, title: "Student Admission", description: "Streamlined admission process management" },
    { icon: BookOpen, title: "Courses and Batches", description: "Organize academic programs efficiently" },
    { icon: FileText, title: "Examination", description: "Complete exam management system" },
    { icon: Users, title: "Employee/Teacher Login", description: "Secure access for staff members" },
    { icon: MessageSquare, title: "Custom Student Remarks", description: "Personalized student feedback system" },
    { icon: Calendar, title: "SMS Integration", description: "Automated communication system" },
    { icon: GraduationCap, title: "Gradebook", description: "Digital grade management" },
    { icon: ClipboardList, title: "News Management", description: "Keep everyone informed with updates" },
    { icon: DollarSign, title: "Messaging System", description: "Internal communication platform" },
    { icon: BarChart3, title: "User Management", description: "Control user access and permissions" },
    { icon: UserCheck, title: "Students/Parents Login", description: "Dedicated portals for families" },
    { icon: Calendar, title: "School/Events Calendar", description: "Track important dates and events" },
    { icon: Clock, title: "Timetable", description: "Automated scheduling system" },
    { icon: ClipboardList, title: "Student Attendance", description: "Digital attendance tracking" },
    { icon: DollarSign, title: "Finance", description: "Complete financial management" },
    { icon: BarChart3, title: "Report Center", description: "Comprehensive reporting system" },
    { icon: UserCheck, title: "Student Information", description: "Complete student profiles" },
    { icon: DollarSign, title: "Advance Fees", description: "Advanced fee management" },
    { icon: Mail, title: "Email Integration", description: "Seamless email communication" },
    { icon: Library, title: "Library", description: "Digital library management" },
    { icon: CreditCard, title: "Payment Gateway", description: "Secure online payment processing" }
  ];

  return (
    <section
      className="relative text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "rgba(9, 48, 122, 1)" }}
    >
      {/* Background gradient circles with responsive sizing */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] 
                      rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                      blur-2xl sm:blur-3xl -top-24 sm:-top-32 md:-top-48 -left-12 sm:-left-16 md:-left-24 
                      animate-pulse"></div>
        <div className="absolute w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px] 
                      rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 
                      blur-2xl sm:blur-3xl -bottom-16 sm:-bottom-24 md:-bottom-32 -right-8 sm:-right-12 md:-right-16 
                      animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 
                       font-['Nexa_Bold',sans-serif] bg-clip-text text-transparent 
                       bg-gradient-to-r from-white to-blue-200
                       leading-tight">
            All Features In One Place
          </h2>
          <div className="text-sm sm:text-base leading-relaxed max-w-4xl mx-auto 
                        px-4 sm:px-6 text-white/90">
            Streamys is a next-gen school management platform built for schools,
            colleges, universities, and training centers. From <b>admissions to
            attendance, exams to results</b> everything is automated in one place.<b> A
            seamless, intuitive system with real-time insights and collaboration
            tools</b> that make learning and administration <b>smarter, faster, and
            simpler</b>
          </div>
        </div>

        {/* Responsive grid layout with improved spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                      gap-4 sm:gap-5 md:gap-6
                      px-2 sm:px-4 md:px-6">
          {coreModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white/10 backdrop-blur-sm rounded-lg 
                          p-4 sm:p-5 md:p-6
                          hover:bg-white/15 transition-all duration-500 ease-out
                          border border-white/20 hover:border-white/30
                          hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
                          hover:-translate-y-1 hover:scale-[1.02]
                          cursor-pointer
                          transform-gpu"
              >
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br 
                              from-transparent via-transparent to-transparent
                              group-hover:from-pink-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10
                              transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                
                <div className="relative flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg 
                                  bg-gradient-to-br from-pink-400 to-red-400 
                                  flex items-center justify-center group-hover:scale-110 
                                  transition-all duration-500 ease-out
                                  shadow-lg shadow-pink-500/20">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white 
                                    transform group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white 
                                 mb-1 sm:mb-2 leading-tight
                                 group-hover:text-transparent group-hover:bg-clip-text 
                                 group-hover:bg-gradient-to-r group-hover:from-pink-200 group-hover:to-blue-200
                                 transition-all duration-500">
                      {module.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed 
                                group-hover:text-white/90 transition-colors duration-500">
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Responsive decorative corner accent */}
                <div className="absolute top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 
                                rounded-full bg-white/40"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
