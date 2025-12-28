import {
  Users,
  MessageSquare,
  Smartphone,
  Monitor,
  Globe,
  Video,
  CheckCircle,
  ArrowRight,
  Play,
  Cloud,
  Earth
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function WhyChooseUsSection() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, index]));
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const features = [
    {
      icon: Users,
      badge: "Manage User Roles",
      title: "Dedicated Portals for Everyone",
      description: "Streamys offers a complete role-based portal system tailored for Admins, Teachers, Accountants, Management Staff, Parents, and Students. Each user gets a personalized space with the tools they need—making communication, management, and learning effortless.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      cta: { text: "Start Your Free Trial Now ", link: "/" }
    },
    {
      icon: Smartphone,
      badge: "SMS Alerts",
      title: "Alerts & Engage",
      description: "From attendance to announcements, share unlimited SMS, Email and within application alters with you school community”",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      cta: { text: "Request for demo", link: "/" }
    },
    {
      icon: Cloud,
      badge: "Easy Accessiblity",
      title: "Cloud-Based Solution",
      description: "A powerful cloud platform accessible from anywhere, anytime - with secure, real-time access across devices.",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      cta: { text: "Start Your Free Trial Now", link: "/" }
    },
    {
      icon: Earth,
      badge: "Universal Access",
      title: "Cross-Platform Desktop",
      description: "Desktop, laptop, tablet, or mobile—Streamys goes everywhere with you",
      image: "/Animation_For_School_Management_Website.mp4",
      cta: { text: "Request for demo", link: "/" }
    }
  ];

  return (
    <section
      className="relative text-white py-20 px-5 overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to left, rgb(9, 50, 127), rgb(6, 24, 59))",
        backgroundColor: "rgb(255, 255, 255)"
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div
          ref={el => sectionRefs.current[0] = el}
          className={`text-center mb-20 transition-all duration-1000 ${visibleSections.has(0)
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
            <CheckCircle className="w-5 h-5 text-white animate-pulse" />
            <span className="text-white font-medium">Why Choose Streamys?</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Nexa_Bold',sans-serif]">
            Experience The Future of School Management with Streamys -
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent"> Feature-Rich, Always Improving, and <br/><br/><button className="text-white text-2xl md:text-2xl font-bold px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors">Free to Try</button></span>
          </h2>

          {/* <p className="text-blue-100 text-lg max-w-4xl mx-auto leading-relaxed">
            Streamys offers more features than any other school management system in the market.
            Completely free, constantly updated, and trusted by thousands of institutions worldwide.
          </p> */}

        </div>

        {/* Features Grid */}
        <div className="space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                ref={el => sectionRefs.current[index + 1] = el}
                className={`flex items-center gap-8 md:gap-16 transition-all duration-1000 delay-200 ${visibleSections.has(index + 1)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
                  } ${isEven ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className="w-full md:flex-1 max-w-lg">
                  <div className={`transform transition-all duration-700 ${visibleSections.has(index + 1) ? 'translate-x-0' : isEven ? '-translate-x-10' : 'translate-x-10'
                    }`}>
                    {/* Animated Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-4">
                      <Icon className={`w-5 h-5 text-white transition-transform duration-500 ${visibleSections.has(index + 1) ? 'rotate-0 scale-100' : 'rotate-45 scale-75'
                        }`} />
                      <span className="text-white font-medium">{feature.badge}</span>
                    </div>

                    {/* Animated Title */}
                    <h3 className={`text-3xl md:text-4xl font-bold text-white mb-4 font-['Nexa_Bold',sans-serif] transition-all duration-700 delay-100 ${visibleSections.has(index + 1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                      }`}>
                      {feature.title}
                    </h3>

                    {/* Animated Description */}
                    <p className={`text-blue-100 text-lg leading-relaxed mb-8 transition-all duration-700 delay-200 ${visibleSections.has(index + 1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                      }`}>
                      {feature.description}
                    </p>

                    {/* Animated CTA */}
                    <div className={`transition-all duration-700 delay-300 ${visibleSections.has(index + 1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                      }`}>
                      {feature.cta.link && (
                        <a
                          href={feature.cta.link}
                          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <span>{feature.cta.text}</span>
                          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full md:flex-1 max-w-lg">
                  <div className={`relative transition-all duration-1000 delay-400 ${visibleSections.has(index + 1)
                    ? 'opacity-100 scale-100 rotate-0'
                    : 'opacity-0 scale-95 rotate-3'
                    }`}>
                    <div className="relative group">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />

                      {/* Image/Video Container */}
                      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:bg-white/10 transition-all duration-500">
                        {feature.image.endsWith('.mp4') ? (
                          <video
                            src={feature.image}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`w-full h-auto transition-all duration-1000 ${visibleSections.has(index + 1)
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-8 scale-95'
                              }`}
                            style={{
                              transitionDelay: `${index * 0.1}s`
                            }}
                          />
                        ) : (
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className={`w-full h-auto transition-all duration-1000 ${visibleSections.has(index + 1)
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-8 scale-95'
                              }`}
                            style={{
                              transitionDelay: `${index * 0.1}s`
                            }}
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA Section */}
        <div
          ref={el => sectionRefs.current[features.length + 1] = el}
          className={`text-center mt-32 transition-all duration-1000 ${visibleSections.has(features.length + 1)
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-['Nexa_Bold',sans-serif]">
              Ready for Smarter Management?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Experience Streamys in action and explore what’s possible.
            </p>
            <a
              href="/"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <Play className="w-6 h-6" />
              <span>Try Streamys Today</span>
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
