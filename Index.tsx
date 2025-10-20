import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cpu, Linkedin, Mail, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [demoPhoneNumber, setDemoPhoneNumber] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Vanta Waves background
    const vanta = (window as any).VANTA;
    const three = (window as any).THREE;
    
    if (vanta && three) {
      const vantaEffect = vanta.WAVES({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x7c3aed,
        shininess: 30.0,
        waveHeight: 15.0,
        waveSpeed: 0.5,
        zoom: 0.75,
      });

      return () => {
        if (vantaEffect) vantaEffect.destroy();
      };
    }
  }, []);

  useEffect(() => {
    // Scroll reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^\+\d{6,15}$/.test(phoneNumber)) {
      toast({
        title: "Ungültige Nummer",
        description: "Bitte gib eine gültige internationale Nummer ein (z.B. +4917612345678)",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Anruf wird gestartet...",
      description: "Dein KI-Agent ruft dich gleich an!",
    });

    setPhoneNumber("");
    setTimeout(() => setCallModalOpen(false), 2000);
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^\+\d{6,15}$/.test(demoPhoneNumber)) {
      toast({
        title: "Ungültige Nummer",
        description: "Bitte gib eine gültige internationale Nummer ein (z.B. +4917612345678)",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demo wird gestartet...",
      description: "Dein KI-Agent ruft dich gleich an!",
    });

    setDemoPhoneNumber("");
    setTimeout(() => setDemoModalOpen(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Nachricht gesendet!",
      description: "Wir melden uns in Kürze bei dir.",
    });
  };

  return (
    <div className="min-h-screen relative">
      <div id="vanta-bg" className="fixed inset-0 opacity-15 -z-10" />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary logo-animation cursor-pointer">
              LUC-AI.COM
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="hover:text-primary transition-all duration-300 hover:scale-110">
              About
            </a>
            <a href="#demo" className="hover:text-primary transition-all duration-300 hover:scale-110">
              Demo
            </a>
            <a href="#contact" className="hover:text-primary transition-all duration-300 hover:scale-110">
              Contact
            </a>
          </div>
          <div className="md:hidden">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
            AI, die <span className="gradient-text">spricht</span>,{" "}
            <span className="gradient-text">denkt</span> und{" "}
            <span className="gradient-text">verkauft</span> – für dein Business.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Erlebe, wie dein Unternehmen mit echten KI-Agenten arbeitet.
          </p>
          <div className="animate-fade-in-up delay-400">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl glow animate-float"
              onClick={() => setCallModalOpen(true)}
            >
              Live testen
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-muted/50 py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Über mich</h2>
            <div className="w-24 h-1 bg-secondary mx-auto" />
          </div>
          <div className="bg-card p-8 md:p-12 rounded-xl shadow-sm text-center scroll-reveal delay-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <p className="text-xl leading-relaxed text-foreground/80 mx-auto">
              Ich bin <span className="font-semibold text-primary">LUC-AI.COM</span>, AI
              Consultant. Ich entwickle Systeme, die deine Stimme skalieren – von
              Kundenservice bis Sales. Meine Mission ist es, KI-Lösungen zu schaffen,
              die nicht nur funktionieren, sondern sich natürlich in deine
              Businessprozesse integrieren.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 text-center scroll-reveal">
              <h2 className="text-3xl font-bold mb-6">Live Demo</h2>
              <p className="text-muted-foreground mb-8">
                Erlebe selbst, wie ein KI-Agent mit deinen Kunden spricht, Anfragen
                bearbeitet und Verkäufe abschließt – rund um die Uhr, in deinem Brand
                Voice.
              </p>
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl glow mx-auto"
                onClick={() => setDemoModalOpen(true)}
              >
                Starte Live-Demo
              </Button>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-1 rounded-xl mx-auto w-full scroll-reveal delay-200 transition-all duration-300 hover:scale-105">
              <div className="bg-card p-6 rounded-lg h-full">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 animate-pulse delay-100" />
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-200" />
                </div>
                <div className="h-64 flex items-center justify-center text-center">
                  <div className="text-center">
                    <Cpu className="w-12 h-12 text-primary mx-auto mb-4 animate-float" />
                    <p className="text-muted-foreground">
                      Authentische KI-Konversation starten
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-muted/50 py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-3xl font-bold mb-4">
              Kontakt für persönliches Gespräch
            </h2>
            <p className="text-muted-foreground">
              Hinterlasse deine Daten – um einen{" "}
              <span className="gradient-text font-semibold">kostenlosen persönlichen</span>{" "}
              Termin zu vereinbaren.
            </p>
          </div>
          <form className="bg-card p-8 rounded-xl shadow-sm scroll-reveal delay-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" onSubmit={handleContactSubmit}>
            <div className="mb-6">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                className="mt-2"
                required
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="company">Unternehmen</Label>
              <Input
                type="text"
                id="company"
                className="mt-2"
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                type="tel"
                id="phone"
                className="mt-2"
                required
              />
            </div>
            <div className="mb-8">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                type="email"
                id="email"
                className="mt-2"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Jetzt kontaktieren
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t scroll-reveal">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-muted-foreground">© 2025 LUC-AI.COM – AI Consulting</p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Call Modal */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="sm:max-w-md">
          <h3 className="text-xl font-semibold text-center mb-2">
            Sofort-Demo: KI ruft dich an
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Gib deine Nummer im internationalen Format ein (z. B. +4917612345678).
          </p>
          <form onSubmit={handleCallSubmit} className="space-y-4">
            <Input
              type="tel"
              placeholder="+49…"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <div className="flex justify-center gap-2">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Anrufen lassen
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCallModalOpen(false)}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Demo Modal */}
      <Dialog open={demoModalOpen} onOpenChange={setDemoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <h3 className="text-xl font-semibold text-center mb-2">
            Live-Demo: KI ruft dich an
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Gib deine Nummer im internationalen Format ein (z. B. +4917612345678).
          </p>
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <Input
              type="tel"
              placeholder="+49…"
              value={demoPhoneNumber}
              onChange={(e) => setDemoPhoneNumber(e.target.value)}
              required
            />
            <div className="flex justify-center gap-2">
              <Button
                type="submit"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Anrufen lassen
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDemoModalOpen(false)}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
