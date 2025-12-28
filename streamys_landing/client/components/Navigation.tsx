import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, GraduationCap, Users, Building, School, Baby, Globe, Plane, Settings, UserCheck, MessageCircle, Shield, BookOpen, DollarSign, Code, Cloud, Lock, Smile, Smartphone, ChevronRight, Menu, X } from "lucide-react";

const servicesData = {
  "Student Management": [
    "Admission & Enrollment",
    "Student Profile Management",
    "Course & Batch Allocation",
    "Parent & Guardian Mapping",
    "Document Verification & Storage",
    "Re-admission & Transfers",
    "Student Analytics Dashboard",
  ],
  "Fee & Finance Automation": [
    "Configurable Fee Structures",
    "Online Payment Gateway",
    "Advance & Partial Payments",
    "Automated Invoicing & Receipts",
    "Fee Reminders & Dues Tracking",
    "Discounts & Scholarships",
    "Multi-Branch Finance Dashboard",
    "Financial Reports & Audit Logs",
  ],
  "Academic & Exam Management": [
    "Course & Subject Structuring",
    "Smart Timetable Scheduling",
    "Attendance Management",
    "Examination Planner",
    "Gradebook & Report Cards",
    "Progress Monitoring",
    "Custom Teacher Remarks",
    "Automated Promotion Rules",
  ],
  "Library & Resource Management": [
    "Centralized Library Database",
    "Barcode / QR Issue & Return",
    "Fine & Due Tracking",
    "User Access Control",
    "Resource Categorization & Tagging",
    "Digital Resource Integration",
    "Inventory Reports",
    "Library Dashboard",
  ],
  "360° Communication": [
    "SMS & Email",
    "Announcements & Circulars",
    "Parent–Teacher–Student Portal",
    "News & Event Management",
    "School Calendar & Alerts",
    "Feedback & Query System",
    "Role-based Access Control",
    "Communication Reports",
  ],
  "Reports & Analytics": [
    "Multi-Dashboard Access",
    "Central Report Center",
    "Custom Report Builder",
    "Student & Staff Analytics",
    "Admission & Fee Insights",
    "Department-Wise Dashboards",
    "Predictive Analytics",
    "Export Options (PDF, Excel, CSV)",
  ],
};

export default function Navigation() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null);

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "Student Management":
        return <UserCheck className="w-4 h-4 mr-3 text-gray-400" />;
      case "Fee & Finance Automation":
        return <DollarSign className="w-4 h-4 mr-3 text-gray-400" />;
      case "Academic & Exam Management":
        return <Users className="w-4 h-4 mr-3 text-gray-400" />;
      case "Library & Resource Management":
        return <BookOpen className="w-4 h-4 mr-3 text-gray-400" />;
      case "360° Communication":
        return <MessageCircle className="w-4 h-4 mr-3 text-gray-400" />;
      case "Reports & Analytics":
        return <BookOpen className="w-4 h-4 mr-3 text-gray-400" />;
      default:
        return <ChevronRight className="w-4 h-4 mr-3 text-gray-400" />;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img
                  src="/logo.png"
                  alt="Streamys Logo"
                  className="h-12 md:h-16 w-auto mr-2"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 ml-8">
              {/* Products Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-1 px-2 py-2 text-gray-700 hover:text-brand transition-colors"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onClick={() => setIsProductsOpen(true)}
                >
                  <span>Solutions & Services</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Desktop Dropdown Menu */}
                {isProductsOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-[min(90vw,900px)] bg-white rounded-lg shadow-xl border border-gray-200 p-8 z-50"
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    <div className="grid grid-cols-3 gap-8">
                      {/* For Industries */}
                      <div>
                        <h3 className="font-semibold text-blue-500 mb-4 flex items-center">
                          Who We Serve <ChevronDown className="w-4 h-4 ml-1" />
                        </h3>
                        <div className="space-y-2">
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <Users className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">K-12 Schools</span>
                          </a>
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <Baby className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">Preschools & Playschools</span>
                          </a>
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <BookOpen className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">Colleges and Universities</span>
                          </a>
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <Building className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">Coaching & Training Institutes</span>
                          </a>
                        </div>
                      </div>

                      {/* What we offer */}
                      <div className="relative">
                        <h3 className="font-semibold text-blue-500 mb-4 flex items-center">
                          What We Offer <ChevronDown className="w-4 h-4 ml-1" />
                        </h3>
                        <div className="space-y-2">
                          {Object.keys(servicesData).map((service) => (
                            <div
                              key={service}
                              className="relative"
                              onMouseEnter={() => setActiveService(service)}
                              onMouseLeave={() => setActiveService(null)}
                            >
                              <a
                                href="#"
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand group"
                              >
                                <div className="flex items-center">
                                  {getServiceIcon(service)}
                                  <span className="text-sm">{service}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                              {activeService === service && (
                                <div className="absolute left-full top-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 ml-2">
                                  <div className="space-y-2">
                                    {servicesData[service].map((item) => (
                                      <a
                                        key={item}
                                        href="#"
                                        className="block p-2 text-sm text-gray-600 hover:text-brand hover:bg-gray-50 rounded-lg transition-colors"
                                      >
                                        {item}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Why Streamys */}
                      <div>
                        <h3 className="font-semibold text-blue-500 mb-4 flex items-center">
                          Why Streamys <ChevronDown className="w-4 h-4 ml-1" />
                        </h3>
                        <div className="space-y-2">
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <Cloud className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">100% Cloud-Based</span>
                          </a>
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <Lock className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">Safe & Scalable</span>
                          </a>
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <Smile className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">User-Friendly</span>
                          </a>
                          <a href="#" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-brand">
                            <Smartphone className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm">Coming Soon: Mobile App</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Plans Link */}
              <Link to="/subscription" className="text-gray-700 hover:text-brand transition-colors font-medium">
                Our Plans
              </Link>
            </div>
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center">
            {/* Desktop Auth Buttons (only on lg+) */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* <a
                href="http://localhost:3000/Adminregister"
                className="bg-brand text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Sign Up
              </a> */}
              <a
                href="https://app.streamys.in/choose"
                className="bg-white text-brand border border-brand px-6 py-2 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Login
              </a>
              <a
                href="/"
                className="bg-orange-500 text-white border border-orange-500 px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
              >
                Request Demo
              </a>
              <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img
                  src="/telephone.png"
                  alt="Streamys Logo"
                  className="h-8 w-auto mr-2"
                />
              </a>
            </div>

            {/* Mobile/Tablet menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-brand hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand ml-auto mr-2"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-7 w-7" aria-hidden="true" />
              ) : (
                <Menu className="block h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet menu */}
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {/* Mobile Solutions & Services Dropdown */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveMobileSection(activeMobileSection === 'services' ? null : 'services')}
              className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
            >
              <span>Solutions & Services</span>
              <ChevronDown className={`w-5 h-5 transform transition-transform ${activeMobileSection === 'services' ? 'rotate-180' : ''}`} />
            </button>

            {activeMobileSection === 'services' && (
              <div className="pl-4 space-y-2">
                {Object.keys(servicesData).map((service) => (
                  <div key={service}>
                    <button
                      onClick={() => setActiveService(activeService === service ? null : service)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-brand hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        {getServiceIcon(service)}
                        <span>{service}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transform transition-transform ${activeService === service ? 'rotate-180' : ''}`} />
                    </button>

                    {activeService === service && (
                      <div className="pl-4 space-y-1 mt-1">
                        {servicesData[service].map((item) => (
                          <a
                            key={item}
                            href="#"
                            className="block px-3 py-2 text-sm text-gray-500 hover:text-brand hover:bg-gray-50 rounded-md"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Plans Link */}
          <Link
            to="/subscription"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand hover:bg-gray-50 rounded-md"
          >
            Our Plans
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="px-3 pt-4 space-y-2">
            <a
              href="/app/Adminregister"
              className="block text-center bg-brand text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </a>
            <a
              href="https://app.streamys.in/choose"
              className="block text-center bg-white text-brand border border-brand px-4 py-2 rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              Login
            </a>
            <a
              href="/"
              className="block text-center bg-orange-500 text-white border border-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              Request Demo
            </a>
            <div className="flex justify-center pt-2">
              <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img
                  src="/telephone.png"
                  alt="Contact"
                  className="h-8 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
