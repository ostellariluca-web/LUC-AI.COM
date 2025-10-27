
// FIX: The type for a lucide-react icon component is `LucideIcon`. The `Icon` type was used incorrectly.
import { Phone, Search, Zap, MessageCircle, BarChart2, Wrench, type LucideIcon } from 'lucide-react';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/solutions', label: 'Lösungen' },
  { href: '/about', label: 'Über mich' },
  { href: '/#contact', label: 'Kontakt' },
];

interface Solution {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: 'primary' | 'secondary';
  quote?: string;
  isWide?: boolean;
}

export const SOLUTIONS: Solution[] = [
  {
    icon: Phone,
    title: "AI Sekretär",
    description: "Dein persönlicher KI-Assistent für Anrufe, Termine und Nachrichten – 24/7 verfügbar.",
    features: ["Intelligente Anrufbeantwortung", "Automatische Terminvereinbarung", "Kundenanfragen qualifizieren"],
    color: "primary",
    quote: "Während du schläfst, arbeitet deine KI – niemals einen Kundenanruf verpassen."
  },
  {
    icon: Search,
    title: "KI-SEO Optimierung",
    description: "Optimierung für die neue KI-gesteuerte Suchlandschaft – damit dein Business gefunden wird.",
    features: ["Website-Optimierung für KI-Crawler", "Strukturierte Daten für KI-Verständnis", "Google AI Mode Optimierung"],
    color: "secondary",
    quote: "Wenn KI nach 'bestes Restaurant in Heidelberg' sucht, willst du erwähnt werden."
  },
  {
    icon: Zap,
    title: "Prozess-Automatisierung",
    description: "Automatisierung repetitiver Geschäftsprozesse – damit dein Team strategische Aufgaben erledigt.",
    features: ["E-Mail-Sortierung & automatische Antworten", "Rechnungsverarbeitung & Datenübertragung", "Terminerinnerungen & Follow-ups"],
    color: "primary",
    quote: "60-80% weniger Zeit für administrative Aufgaben – mehr für dein Kerngeschäft."
  },
  {
    icon: MessageCircle,
    title: "AI Customer Service",
    description: "Intelligente Chatbots für Website, WhatsApp, Instagram und E-Mail – 24/7 Service.",
    features: ["Sofortige Antworten auf häufige Fragen", "Bestellstatus & Reservierungsabfragen", "Produktempfehlungen basierend auf Kundenprofil"],
    color: "secondary",
    quote: "Kunden erwarten 24/7-Service – deine KI liefert ihn."
  },
  {
    icon: BarChart2,
    title: "Smart Business Analytics",
    description: "KI-gesteuerte Analyse deiner Geschäftsdaten zur Erkennung von Chancen und Optimierung.",
    features: ["Verkaufsmuster & Prognosen", "Kundenverhalten & Präferenzen", "Preisoptimierung & Wettbewerbsanalysen"],
    color: "primary",
    quote: "Datengetriebene Entscheidungen ohne teure Analysten."
  },
  {
    icon: Wrench,
    title: "Maßgeschneiderte Lösungen",
    description: "Individuelle KI-Lösungen für deine spezifischen Anforderungen – keine Kompromisse.",
    features: [
      "Medizinische Praxis: Patientenmanagement-KI",
      "Immobilien: Automatische Lead-Qualifizierung",
      "Gastronomie: Dynamische Preisgestaltung",
      "Deep Dive in deine Prozesse",
      "Identifikation von Automatisierungsmöglichkeiten",
      "Nahtlose Integration in bestehende Systeme"
    ],
    color: "secondary",
    quote: "Mehr Services in Planung – frag einfach nach deiner speziellen Lösung.",
    isWide: true,
  },
];

export const PROCESS_STEPS = [
    {
        title: "Kostenloses Erstgespräch",
        description: "Wir verstehen dein Business und deine Ziele"
    },
    {
        title: "KI-Potenzial-Analyse",
        description: "Identifizierung der Automatisierungsmöglichkeiten"
    },
    {
        title: "Maßgeschneiderter Plan",
        description: "Entwicklung einer individuellen Lösung"
    },
    {
        title: "Implementation & Launch",
        description: "Aufbau, Integration und kontinuierliche Optimierung"
    },
];

export const STATS = [
    { value: '73%', label: 'der Entscheidungen werden heute von KI-Assistenten getroffen' },
    { value: '85%', label: 'aller Google-Suchen laufen über KI' },
    { value: '2025', label: 'Jetzt ist der Zeitpunkt zu handeln – bevor es zu spät ist' }
];

export const EXPERTISE = [
  "Voice AI & Conversational Agents",
  "Business Process Automation",
  "AI-Powered Customer Service",
  "Data Analytics & Insights",
];

export const APPROACH = [
  "Praktische, umsetzbare Lösungen",
  "Maßgeschneiderte KI-Strategien",
  "Nahtlose Integration",
  "Kontinuierlicher Support",
];