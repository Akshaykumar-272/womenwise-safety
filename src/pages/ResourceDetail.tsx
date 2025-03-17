
import { useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';

// Resource content based on resource type
const resourceContent = {
  'womens-safety-guidelines': {
    title: "Women's Safety Guidelines",
    description: "Essential tips and best practices for staying safe in various situations",
    content: [
      {
        heading: "General Safety Tips",
        items: [
          "Always be aware of your surroundings and avoid distractions like texting while walking alone",
          "Trust your instincts – if a situation feels uncomfortable, remove yourself immediately",
          "Share your location with trusted friends when going to new places or meeting new people",
          "Plan your route in advance and stick to well-lit, populated areas",
          "Keep emergency contacts easily accessible on your phone"
        ]
      },
      {
        heading: "Transportation Safety",
        items: [
          "Prefer verified ride-sharing services over unregistered taxis",
          "Confirm the driver's identity and car details before entering any vehicle",
          "Sit in the back seat when using taxis or ride-sharing services",
          "Consider traveling with companions, especially at night",
          "Plan your route using safer paths even if they take slightly longer"
        ]
      },
      {
        heading: "Social Situation Safety",
        items: [
          "Never leave your drink unattended at social gatherings",
          "Establish a buddy system when attending events with friends",
          "Set boundaries and communicate them clearly",
          "Have an exit strategy or code word with friends for uncomfortable situations",
          "Be cautious about sharing personal information with people you've just met"
        ]
      }
    ],
    links: [
      { text: "UN Women Safety Resources", url: "https://www.unwomen.org/en/what-we-do/ending-violence-against-women" },
      { text: "WHO Safety Guidelines", url: "https://www.who.int/news-room/fact-sheets/detail/violence-against-women" }
    ]
  },
  'legal-resources': {
    title: "Legal Resources",
    description: "Information about your rights and legal assistance",
    content: [
      {
        heading: "Understanding Your Rights",
        items: [
          "Learn about laws protecting against domestic violence, sexual harassment, and assault",
          "Familiarize yourself with workplace rights regarding harassment and discrimination",
          "Know the process for obtaining restraining or protection orders",
          "Understand the legal definition of consent in your jurisdiction",
          "Be aware of laws regarding digital harassment and cyberstalking"
        ]
      },
      {
        heading: "Legal Assistance Resources",
        items: [
          "Legal aid societies often provide free or reduced-cost legal services",
          "Many women's shelters have legal advocates on staff",
          "Law school clinics may offer pro bono services for women in need",
          "Domestic violence organizations frequently provide legal support",
          "Some attorneys specialize in cases involving women's safety issues"
        ]
      },
      {
        heading: "Reporting Incidents",
        items: [
          "Document all incidents with dates, times, locations, and descriptions",
          "Preserve any evidence including messages, emails, or photos",
          "File police reports for all incidents even if immediate action isn't taken",
          "Consider obtaining medical documentation of any injuries",
          "Follow up on case status regularly with assigned officers"
        ]
      }
    ],
    links: [
      { text: "National Network to End Domestic Violence", url: "https://nnedv.org/content/technology-safety/" },
      { text: "WomensLaw.org Legal Information", url: "https://www.womenslaw.org/" }
    ]
  },
  'support-organizations': {
    title: "Support Organizations",
    description: "List of NGOs and groups providing support to women",
    content: [
      {
        heading: "Crisis Support Organizations",
        items: [
          "National Domestic Violence Hotline: 24/7 crisis support and referrals",
          "RAINN (Rape, Abuse & Incest National Network): Support for sexual assault survivors",
          "Crisis Text Line: Text-based mental health support",
          "Safe Horizon: Comprehensive victim services organization",
          "Local women's shelters: Temporary safe housing and support services"
        ]
      },
      {
        heading: "Advocacy Groups",
        items: [
          "National Organization for Women (NOW): Advocacy for women's rights",
          "Time's Up: Addressing inequality and injustice in the workplace",
          "Girls Not Brides: Working to end child marriage globally",
          "Women's Aid: Support for domestic abuse survivors",
          "Global Fund for Women: Funding women's human rights initiatives"
        ]
      },
      {
        heading: "Community Resources",
        items: [
          "YWCA: Programs supporting women's empowerment and elimination of racism",
          "Women's centers at universities and colleges",
          "Community health centers with women's services",
          "Religious organizations with women's support ministries",
          "Local support groups for survivors of violence"
        ]
      }
    ],
    links: [
      { text: "Global Network of Women's Shelters", url: "https://gnws.org/" },
      { text: "UN Women", url: "https://www.unwomen.org/en" }
    ]
  },
  'medical-support': {
    title: "Medical Support",
    description: "Information about medical services specializing in women's health",
    content: [
      {
        heading: "Emergency Medical Services",
        items: [
          "Sexual Assault Nurse Examiners (SANE): Specially trained in forensic exams",
          "Hospital emergency departments: Immediate trauma care",
          "Crisis response teams: Mental health support during emergencies",
          "Community health centers: Often provide walk-in urgent care",
          "Mobile health clinics: Medical services in underserved areas"
        ]
      },
      {
        heading: "Women's Health Services",
        items: [
          "OB/GYN specialists: Comprehensive women's healthcare",
          "Planned Parenthood: Reproductive health services",
          "Women's health clinics: Focused care for women's needs",
          "Mental health professionals specializing in trauma",
          "Telehealth options for remote consultations"
        ]
      },
      {
        heading: "Follow-up Care",
        items: [
          "Trauma-informed therapy services",
          "Support groups for survivors",
          "Physical therapy for injury recovery",
          "Preventive health screenings",
          "Reproductive health follow-up care"
        ]
      }
    ],
    links: [
      { text: "Office on Women's Health", url: "https://www.womenshealth.gov/" },
      { text: "World Health Organization - Women's Health", url: "https://www.who.int/health-topics/women-s-health" }
    ]
  }
};

const ResourceDetail = () => {
  const navigate = useNavigate();
  const { resourceId } = useParams();
  const { toast } = useToast();
  
  const resource = resourceId && resourceContent[resourceId as keyof typeof resourceContent];

  useEffect(() => {
    if (resource) {
      toast({
        title: resource.title,
        description: "Detailed information and resources",
      });
    } else {
      toast({
        title: "Resource Not Found",
        description: "The requested resource could not be found",
        variant: "destructive"
      });
      navigate('/resources');
    }
  }, [resource, toast, navigate, resourceId]);

  if (!resource) {
    return null;
  }

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
          <h1 className="text-3xl font-medium">{resource.title}</h1>
        </div>
        
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-soft mb-6">
          <p className="text-lg text-muted-foreground mb-8">{resource.description}</p>
          
          <div className="space-y-8">
            {resource.content.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-medium mb-4 text-safety-700">{section.heading}</h2>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-safety-500 flex-shrink-0" />
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
                {index < resource.content.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-xl font-medium mb-4">Additional Resources</h2>
          <div className="space-y-3">
            {resource.links.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-safety-50 transition-colors group"
              >
                <span className="font-medium">{link.text}</span>
                <ExternalLink className="h-4 w-4 text-safety-500 group-hover:text-safety-700 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourceDetail;
