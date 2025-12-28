import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrolled = window.scrollY;
        const parallax = scrolled * 0.5;
        videoRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      className={cn(
        "relative bg-brand text-white overflow-hidden min-h-[100vh]",
        "flex items-center justify-center",
        className
      )}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        style={{ willChange: 'transform' }}
      >
        <source src="/hero1.mp4" type="video/mp4" />
      </video>

      {/* Background overlay with improved gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-blue-800 to-blue-600 opacity-65" />

      {/* Content */}
      <div className="relative w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 lg:mb-8 transition-all duration-300">
            Empowering{' '}
            <span className="hidden xs:inline">
              <br/>
            </span>
            Smarter Management for
            <span 
              className="block mt-2 sm:mt-3 lg:mt-4 
                       bg-gradient-to-r from-blue-200 via-white to-blue-100 
                       bg-clip-text text-transparent 
                       animate-gradient"
            >
              Every Institution
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl 
                      text-blue-100 
                      mb-6 sm:mb-8 lg:mb-10 
                      leading-relaxed 
                      max-w-3xl mx-auto 
                      px-4 sm:px-6">
            From schools to universities — manage everything in one smart, connected system.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center 
                        px-4 sm:px-0 
                        max-w-lg sm:max-w-none mx-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto 
                       bg-white text-brand hover:bg-gray-100 
                       font-semibold 
                       px-6 sm:px-8 py-2.5 sm:py-3 
                       text-base sm:text-lg 
                       rounded-full 
                       transition-all duration-300 
                       shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-0.5"
            >
              Request for a Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto 
                       border-2 border-white text-brand 
                       hover:bg-white hover:text-brand 
                       font-semibold 
                       px-6 sm:px-8 py-2.5 sm:py-3 
                       text-brand sm:text-lg 
                       rounded-full 
                       transition-all duration-300 
                       backdrop-blur-sm 
                       shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-0.5"
            >
              Learn more...
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom wave with responsive height */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="w-full h-16 sm:h-24 md:h-28 lg:h-32 xl:h-40 transition-all duration-300"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V160H1200V80C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="#09307A"
          />
        </svg>
      </div>

      {/* Add decorative elements for larger screens */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse hidden lg:block"></div>
    </section>
  );
}
