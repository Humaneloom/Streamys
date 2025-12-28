import { cn } from "@/lib/utils";
import { Check, Users, Sparkles, Building2, Crown, ChevronDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Subscription() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  const plans = [
    {
      name: "Standard",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      students: "Up to 200 Students",
      staff: "Up to 20 Staff",
      description: "Kickstart your digital journey with essential tools and AI assistance",
      price: "₹15,000",
      period: "/year",
      originalPrice: "₹20,400 save 15%",
      features: [
        "All Core Modules",
        "Email & Phone Support",
        "One-on-One Online Training",
        "Data Configuration Included"
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-blue-500 hover:bg-blue-600 text-white",
      popular: false,
      trial: "30 Day Free Trial",
      trialNote: "No Credit/Debit Required"
    },
    {
      name: "Pro",
      icon: <Sparkles className="w-8 h-8 text-green-500" />,
      badge: "Most Popular",
      students: "Up to 600 Students",
      staff: "up to 60 Staff",
      description: "Boost productivity with automation, smart AI and advanced analytics",
      price: "₹35,000",
      period: "/year",
      originalPrice: "₹59,500 save 15%",
      features: [
        "All Core Modules",
        "Advanced Analytics",
        "Email & Phone Support",
        "One-on-One Online Training"
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-blue-500 hover:bg-blue-600 text-white",
      popular: true
    },
    {
      name: "Elite",
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      students: "Up to 1000 Students",
      staff: "Up to 100 Staff",
      description: "Unlock full potential with multi-branch management and premium AI features",
      price: "₹50,000",
      period: "/year",
      originalPrice: "₹59,565 save 15%",
      features: [
        "All Core Modules",
        "Premium Analytics",
        "Multi-branch Management",
        "Priority Support included"
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-blue-500 hover:bg-blue-600 text-white",
      popular: false
    },
    {
      name: "Enterprise",
      icon: <Building2 className="w-8 h-8 text-orange-500" />,
      students: "Up to ∞ Students",
      staff: "Up to ∞ Staff",
      description: "Fully customizable solution for large institutions with hire-label and priority sur",
      price: "Contact Sales",
      period: "",
      originalPrice: "",
      features: [
        "All Commodules",
        "Custom Modules",
        "White-Label Options",
        "Dedicated Support",
        "Data Configuration Included"
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-blue-500 hover:bg-blue-600 text-white",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I switch-plans later?",
      answer: "Yes. You can upgrade or downgrade anytime, and all your data will remain safe. There are no long-term contracts, and you can change your plan with just a few clicks from your dashboard.",
      isOpen: false
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! Standard plan comes with a 30-day free trial with no credit card required. You can explore all features and see how Streamys works for your institution before making any commitment.",
      isOpen: false
    },
    {
      question: "Do you provide onboarding assistance?",
      answer: "Absolutely! We provide comprehensive onboarding support including one-on-one training sessions, data migration assistance, and dedicated support during your first 30 days to ensure smooth implementation.",
      isOpen: false
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees whatsoever. The price you see is exactly what you pay. All core features, updates, and standard support are included in your subscription with no additional charges.",
      isOpen: false
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and digital payment methods. For Enterprise plans, we also offer invoice-based billing and custom payment terms.",
      isOpen: false
    },
    {
      question: "Can I get a custom plan?",
      answer: "Yes! For institutions with unique requirements, we offer custom Enterprise plans with tailored features, dedicated support, and flexible pricing. Contact our sales team to discuss your specific needs.",
      isOpen: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      <div className="pt-16">
        {/* Header Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Streamys Pricing Plans
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible, transparent, and designed for schools of every size. Standard
              plan comes with a 30-day free trial — no credit card required.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-2xl shadow-lg border-2 p-8 relative",
                  plan.popular ? "border-green-500 scale-105" : "border-gray-200"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{plan.students}</p>
                  <p className="text-sm text-gray-600 mb-4">{plan.staff}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center mb-6">
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-sm text-gray-500">{plan.originalPrice}</p>
                  )}
                </div>

                <button
                  className={cn(
                    "w-full py-3 px-6 rounded-full font-medium transition-colors",
                    plan.buttonStyle
                  )}
                >
                  {plan.buttonText}
                </button>

                {plan.trial && (
                  <div className="text-center mt-4">
                    <p className="text-sm font-medium text-blue-600">{plan.trial}</p>
                    <p className="text-xs text-gray-500">{plan.trialNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
               {faqs.map((faq, index) => (
                 <div
                   key={index}
                   className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                 >
                   <div 
                     className="flex justify-between items-center cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                     onClick={() => toggleFaq(index)}
                   >
                     <h3 className="text-lg font-medium text-gray-900">
                       {faq.question}
                     </h3>
                     <ChevronDown 
                       className={cn(
                         "w-5 h-5 text-gray-500 transition-transform duration-200",
                         openFaqIndex === index ? "rotate-180" : ""
                       )}
                     />
                   </div>
                   {openFaqIndex === index && (
                     <div className="px-6 pb-6 text-gray-600 animate-in slide-in-from-top-2 duration-200">
                       <p className="leading-relaxed">{faq.answer}</p>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}