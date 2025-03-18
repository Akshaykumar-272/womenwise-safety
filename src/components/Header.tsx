
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X, Bell, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Emergency', path: '/emergency' },
    { name: 'Safe Routes', path: '/safe-routes' },
    { name: 'Contacts', path: '/contacts' },
    { name: 'Resources', path: '/resources' },
  ];

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Requesting Location",
        description: "Please allow access to your location",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          // Prepare a shareable link
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          // Copy to clipboard
          navigator.clipboard.writeText(googleMapsUrl)
            .then(() => {
              toast({
                title: "Location Shared",
                description: "Google Maps link copied to clipboard",
              });
            })
            .catch(() => {
              // If clipboard fails, open in new tab
              window.open(googleMapsUrl, '_blank');
              toast({
                title: "Location Shared",
                description: "Opened location in Google Maps",
              });
            });
        },
        (error) => {
          toast({
            title: "Error Sharing Location",
            description: "Unable to access your location. Please check your permissions.",
            variant: "destructive"
          });
          console.error("Error getting location:", error);
        }
      );
    } else {
      toast({
        title: "Location Sharing Not Supported",
        description: "Your browser doesn't support location sharing",
        variant: "destructive"
      });
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-soft" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-medium text-xl transition-transform hover:scale-[1.02]">
          <Shield className="h-6 w-6 text-safety-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-safety-500 to-safety-700">WomenWise</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-foreground/80 hover:text-foreground transition-colors text-sm font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            className="bg-safety-500 hover:bg-safety-600 text-white shadow-soft flex items-center gap-1"
            onClick={handleShareLocation}
          >
            <MapPin className="h-4 w-4" />
            <span>Share Location</span>
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-soft md:hidden animate-fade-in">
            <nav className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-foreground/80 hover:text-foreground transition-colors py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button 
                className="bg-safety-500 hover:bg-safety-600 text-white shadow-soft mt-2 flex items-center justify-center gap-1"
                onClick={handleShareLocation}
              >
                <MapPin className="h-4 w-4" />
                <span>Share Location</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
