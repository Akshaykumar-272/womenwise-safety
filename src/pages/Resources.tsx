
import { useEffect } from 'react';
import { ArrowLeft, BookOpen, Building, Info, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import MedicalFinder from '@/components/MedicalFinder';
import HotspotMap from '@/components/HotspotMap';
import { useIsMobile } from '@/hooks/use-mobile';

const Resources = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    toast({
      title: "Safety Resources",
      description: "Find helpful information and nearby services",
    });
  }, [toast]);

  const resources = [
    {
      id: "womens-safety-guidelines",
      title: "Women's Safety Guidelines",
      description: "Essential tips and best practices for staying safe in various situations",
      icon: <Info className="h-5 w-5" />,
    },
    {
      id: "legal-resources",
      title: "Legal Resources",
      description: "Information about your rights and legal assistance",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "support-organizations",
      title: "Support Organizations",
      description: "List of NGOs and groups providing support to women",
      icon: <Building className="h-5 w-5" />,
    },
    {
      id: "medical-support",
      title: "Medical Support",
      description: "Information about medical services specializing in women's health",
      icon: <Heart className="h-5 w-5" />,
    }
  ];

  const handleLearnMore = (resourceId: string) => {
    navigate(`/resources/${resourceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-medium">Safety Resources</h1>
        </div>
        
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="w-full mb-6 bg-muted">
            <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
            <TabsTrigger value="medical" className="flex-1">Medical Facilities</TabsTrigger>
            <TabsTrigger value="hotspots" className="flex-1">Safety Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map(resource => (
                <div 
                  key={resource.id} 
                  className="bg-white p-6 rounded-xl shadow-soft hover:shadow-hover transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-safety-100 p-3 rounded-full text-safety-500 mt-1">
                      {resource.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">{resource.title}</h3>
                      <p className="text-muted-foreground mb-4">{resource.description}</p>
                      <Button 
                        variant="ghost"
                        className="inline-flex items-center text-safety-600 hover:text-safety-700 text-sm font-medium p-0 h-auto hover:bg-transparent"
                        onClick={() => handleLearnMore(resource.id)}
                      >
                        Learn more
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="medical">
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h2 className="text-xl font-medium mb-4">Find Medical Facilities</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Locate nearby hospitals, clinics, and emergency medical services
                    </p>
                    
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Enter your location" 
                        className="w-full border border-input rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-safety-500"
                      />
                      <Button 
                        className="absolute right-0 top-0 bottom-0 rounded-l-none bg-safety-500 hover:bg-safety-600"
                      >
                        Search
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs flex-1">Hospitals</Button>
                      <Button variant="outline" size="sm" className="text-xs flex-1">Clinics</Button>
                      <Button variant="outline" size="sm" className="text-xs flex-1">Pharmacies</Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Heart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Medical facility map</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <MedicalFinder />
            </div>
          </TabsContent>
          
          <TabsContent value="hotspots">
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h2 className="text-xl font-medium mb-4">Safety Map</h2>
                <p className="text-muted-foreground mb-4">
                  View safety information and hotspots in your area to make informed decisions
                </p>
                
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Info className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Safety map visualization</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Safe Areas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">Caution Areas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs">Hotspots</span>
                  </div>
                </div>
              </div>
              
              <HotspotMap />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Resources;
