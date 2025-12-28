import { Shield, Cloud, Headphones, Smartphone, BarChart3, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Cloud,
      title: "Cloud Based Software", 
      description: "Streamys is free school software that is always online, you can access it from anywhere, anytime. We will take care of your data and backups.",
      delay: "1s"
    },
    {
      icon: Headphones,
      title: "Regular Updates & Support",
      description: "We add new and awesome features regularly to make our school administrative software unmatchable. Free online 24/7 support for users.",
      delay: "1.5s"
    },
    {
      icon: Smartphone,
      title: "Responsive Web Design",
      description: "You can use our free school management software on any device, like Mobile, Tablet, Laptop, or desktop due to its responsive design.",
      delay: "1s"
    },
    
    {
      icon: Zap,
      title: "Fast, Secure & Easy",
      description: "We use advanced tools and technologies to build up this free school software. It is super fast, secure, reliable, and easy to use and manage.",
      delay: "0.5s"
    }
  ];

  return (
    <section
      className="relative text-white py-16 px-5"
      style={{ backgroundColor: "rgba(9, 48, 122, 1)" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 font-['Nexa_Bold',sans-serif]">
            Features Of School Management Software
          </h2>
          <div className="text-base leading-6 max-w-4xl mx-auto">
            Streamys is a next-gen school management platform built for schools,
            colleges, universities, and training centers. From <b>admissions to
            attendance, exams to results</b> everything is automated in one place.
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left features */}
          <div className="lg:w-1/2 space-y-12">
            {features.slice(0, 2).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="relative">
                  <div className="text-left relative">
                    {/* Animated background circle */}
                    <div
                      className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center animate-bounce"
                      style={{
                        left: "100%",
                        top: "0px",
                        marginLeft: "20px",
                        animationDelay: feature.delay,
                        animationDuration: "3s",
                        animationIterationCount: "infinite",
                        zIndex: 1,
                      }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 pr-24">
                      <h5 className="text-2xl font-medium font-['Nexa_Bold',sans-serif] mb-3 leading-7">
                        {feature.title}
                      </h5>
                      <p className="text-white leading-6 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center image */}
          <div className="lg:w-1/3 flex justify-center">
            <img
              src="/ems_laptop.png"
              alt="School Management Software Interface"
              className="max-w-full h-auto"
              loading="lazy"
            />
          </div>

          {/* Right features */}
          <div className="lg:w-1/2 space-y-12">
            {features.slice(2, 4).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index + 3} className="relative">
                  <div className="text-left relative">
                    {/* Animated background circle */}
                    <div
                      className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center animate-bounce"
                      style={{
                        right: "100%",
                        top: "0px",
                        marginRight: "20px",
                        animationDelay: features[index + 2].delay,
                        animationDuration: "3s",
                        animationIterationCount: "infinite",
                        zIndex: 1,
                      }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 pl-24">
                      <h5 className="text-2xl font-medium font-['Nexa_Bold',sans-serif] mb-3 leading-7">
                        {feature.title}
                      </h5>
                      <p className="text-white leading-6 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
