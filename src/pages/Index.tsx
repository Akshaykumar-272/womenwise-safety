
import { useState, useEffect } from 'react';
import { Shield, BellRing, MapPin, Clock, PhoneCall, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import EmergencySOS from '@/components/EmergencySOS';
import SafeNavigation from '@/components/SafeNavigation';
import TrustedContacts from '@/components/TrustedContacts';
import HotspotMap from '@/components/HotspotMap';
import MedicalFinder from '@/components/MedicalFinder';
import FeatureCard from '@/components/FeatureCard';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading and show welcome toast
    const timer = setTimeout(() => {
      setIsLoaded(true);
      toast({
        title: "Welcome to WomenWise",
        description: "Your personal safety companion",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [toast]);

  const features = [
    {
      title: "Quick Emergency Call",
      description: "Instantly connect with emergency services with a single tap",
      icon: <PhoneCall className="h-5 w-5" />,
    },
    {
      title: "Real-time Tracking",
      description: "Share your location in real-time with trusted contacts",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: "Safety Alerts",
      description: "Receive notifications about safety concerns in your area",
      icon: <BellRing className="h-5 w-5" />,
    },
    {
      title: "Medical Facilities",
      description: "Quick access to nearby hospitals and emergency services",
      icon: <Heart className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-safety-100 text-safety-700 text-xs font-medium mb-2">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Personal Safety Platform
                </div>
                <h1 className="font-medium tracking-tight">
                  Stay Safe & <br />
                  <span className="text-safety-600">Protected</span> Anywhere
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  WomenWise empowers you to navigate the world with confidence through emergency assistance, safe navigation, and community support.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-safety-500 hover:bg-safety-600 text-white shadow-soft px-6 py-6 text-base">
                  Get Started
                </Button>
                <Button variant="outline" className="border-safety-500 text-safety-700 hover:bg-safety-50 px-6 py-6 text-base">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-safety-100 border-2 border-white flex items-center justify-center text-xs font-medium text-safety-700">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Trusted by thousands of women worldwide</p>
              </div>
            </div>

            <div className={`flex justify-center ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              <div className="w-full max-w-md aspect-square bg-gradient-safety rounded-2xl shadow-soft flex items-center justify-center relative overflow-hidden">
                {/* This would be an illustration or image in a real app */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,138,230,0.1),transparent_70%)]" />
                <div className="text-safety-500 z-10">
                  <Shield className="h-20 w-20 mb-4 mx-auto animate-pulse-soft" />
                  <p className="font-medium text-xl">Always Protected</p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-safety-200/40 blur-xl" />
                <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-safety-300/30 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Main Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-medium mb-3">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive safety tools designed to help you feel secure and protected in any situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                className={`animate-fade-in`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SafeNavigation />
                <MedicalFinder />
              </div>
              <div className="space-y-6">
                <HotspotMap />
                <TrustedContacts />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center bg-gradient-to-b from-alert-50 to-white rounded-xl p-8 shadow-soft">
              <div className="text-center mb-6">
                <h3 className="font-medium text-xl mb-2">Emergency Assistance</h3>
                <p className="text-muted-foreground text-sm">
                  One-touch access to emergency help when you need it most
                </p>
              </div>
              <EmergencySOS />
              <div className="mt-6 text-xs text-muted-foreground text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Average response time: under 3 minutes</span>
                </div>
                <p>
                  Activating SOS will alert your emergency contacts and share your location
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 font-medium text-xl mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-safety-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-safety-500 to-safety-700">
                WomenWise
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Help
              </a>
              <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <Separator className="mb-6" />
          <p className="text-xs text-center text-muted-foreground">
            WomenWise © {new Date().getFullYear()} — Your personal safety companion. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
