export default function Sitemap() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-xl text-blue-100">
            Navigate through all pages and sections of our website.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              This sitemap provides an overview of all the pages and sections available on the Streamys website. 
              Use this page to quickly navigate to any section of our site.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Main Pages */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                  </svg>
                  Main Pages
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a href="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Home
                    </a>
                    <p className="text-gray-500 text-sm ml-5">Main landing page with hero section and overview</p>
                  </li>
                  <li>
                    <a href="/subscription" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Subscription Plans
                    </a>
                    <p className="text-gray-500 text-sm ml-5">View and compare our pricing plans</p>
                  </li>
                </ul>
              </div>

              {/* Features & Sections */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Features & Sections
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a href="/#features" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Core Modules (22 Features)
                    </a>
                    <p className="text-gray-500 text-sm ml-5">Complete list of all available modules</p>
                  </li>
                  <li>
                    <a href="/#why-choose-us" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Why Choose Us
                    </a>
                    <p className="text-gray-500 text-sm ml-5">Benefits and advantages of Streamys</p>
                  </li>
                  <li>
                    <a href="/#contact" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Contact Form
                    </a>
                    <p className="text-gray-500 text-sm ml-5">Get in touch with our team</p>
                  </li>
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Solutions
                </h2>
                <ul className="space-y-3">
                  <li>
                    <span className="text-gray-700 font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      K-12 Schools
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-700 font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Preschools & Playschools
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-700 font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Colleges & Higher Education
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-700 font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Coaching & Training Institutes
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-700 font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Study Abroad Consultants
                    </span>
                  </li>
                </ul>
              </div>

              {/* Legal & Policies */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Legal & Policies
                </h2>
                <ul className="space-y-3">
                  <li>
                    <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      Privacy Policy
                    </a>
                    <p className="text-gray-500 text-sm ml-5">How we collect and protect your data</p>
                  </li>
                  <li>
                    <a href="/terms-of-service" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      Terms of Service
                    </a>
                    <p className="text-gray-500 text-sm ml-5">Terms and conditions for using our services</p>
                  </li>
                  <li>
                    <a href="/cookie-policy" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      Cookie Policy
                    </a>
                    <p className="text-gray-500 text-sm ml-5">Information about cookies and tracking</p>
                  </li>
                  <li>
                    <a href="/sitemap" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      Sitemap
                    </a>
                    <p className="text-gray-500 text-sm ml-5">Complete site navigation structure</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Core Modules Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                All 22 Core Modules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Student Management</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Student Information System</li>
                    <li>• Admission Management</li>
                    <li>• Attendance Management</li>
                    <li>• Academic Records</li>
                    <li>• Student Portal</li>
                    <li>• Parent Portal</li>
                    <li>• Gradebook</li>
                    <li>• Report Cards</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Administrative</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Fee Management</li>
                    <li>• Timetable Management</li>
                    <li>• Exam Management</li>
                    <li>• Transport Management</li>
                    <li>• Hostel Management</li>
                    <li>• Inventory Management</li>
                    <li>• Staff Management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Academic & Financial</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Library Management</li>
                    <li>• Email Integration</li>
                    <li>• Payment Gateway</li>
                    <li>• Communication Tools</li>
                    <li>• Analytics & Reports</li>
                    <li>• Mobile App</li>
                    <li>• Online Learning</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
                    <p className="text-gray-600 text-sm">
                      K No 42/2, 2nd Main, Venkoji Rao, 6th HSR Layout, Bommanahalli Post, 
                      Bengaluru – 560068
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Phone</h3>
                    <p className="text-gray-600 text-sm">+91 9731361100</p>
                    <p className="text-gray-500 text-xs">24/7 Support Available</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
                    <p className="text-gray-600 text-sm">Contact@streamys.in</p>
                    <p className="text-gray-500 text-xs">Quick Response Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}