interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white 
                py-8 sm:py-12 md:py-16 ${className || ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4 sm:mb-6">
              <img
                src="/logo_w.png"
                alt="Streamys Logo"
                className="h-20 md:h-24 w-auto mr-3"
              />
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-md leading-relaxed">
              Streamys empowers institutions to operate smoothly and
              efficiently, simplifying administrative tasks and enhancing
              overall management for schools and colleges across the country
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {[
                { href: "#", icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616..." },
                { href: "#", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.0..." },
                { href: "#", icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 ..." },
                { href: "#", icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.9..." }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-gray-700 hover:bg-blue-600 p-2 rounded-full 
                          transition-all duration-300 transform hover:scale-110
                          hover:shadow-lg hover:shadow-blue-600/20"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-white">Solutions</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "K-12 Schools",
                "Preschools & Playschools",
                "Colleges & Higher Education",
                "Coaching & Training Institutes",
                "Study Abroad Consultants"
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-gray-300 hover:text-blue-400 
                            transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 
                                 transform group-hover:scale-150 transition-transform"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Get in Touch
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  content: "K No 42/2, 2nd main, Venkoji Rao, 6th HSR Layout, Bommanahalli post, Bengaluru- 560068",
                  subtext: "Serving nationwide"
                },
                {
                  icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
                  content: "+91 9731361100",
                  subtext: "24/7 Support"
                },
                {
                  icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
                  content: "Contact@streamys.in",
                  subtext: "Quick response",
                  isEmail: true
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg 
                              transform hover:scale-110 transition-transform">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    {item.isEmail ? (
                      <a
                        href={`mailto:${item.content}`}
                        className="text-xs sm:text-sm text-gray-300 hover:text-blue-400 
                                transition-colors block"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-300">{item.content}</p>
                    )}
                    <p className="text-xs text-gray-400">{item.subtext}</p>
                  </div>
                </div>
              ))}

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center px-3 sm:px-4 py-2 
                          bg-blue-600 hover:bg-blue-700 text-white 
                          text-xs sm:text-sm font-medium rounded-lg 
                          transition-all duration-300 
                          transform hover:scale-105 
                          hover:shadow-lg hover:shadow-blue-600/20"
                >
                  Book Free Demo
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-xs sm:text-sm text-gray-400">
                © 2025 Streamys. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Made with</span>
                <svg
                  className="w-3 h-3 text-red-500 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>in India</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { href: "/privacy-policy", text: "Privacy Policy" },
                { href: "/terms-of-service", text: "Terms of Service" },
                { href: "/cookie-policy", text: "Cookie Policy" },
                { href: "/sitemap", text: "Sitemap" }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-xs sm:text-sm text-gray-400 hover:text-white 
                          transition-colors duration-300 
                          hover:underline"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}