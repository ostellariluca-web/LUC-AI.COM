// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import CtaSection from '../components/CtaSection';
import { Check, Zap } from 'lucide-react';
import { EXPERTISE, APPROACH } from '../constants';


const AboutPage: React.FC = () => {
  return (
    <>
      <section className="bg-dark-900">
        <div className="container mx-auto px-6 py-20 text-center">
          <AnimatedElement>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-light-100">
              Über <span className="gradient-text">LUCA</span>
            </h1>
            <p className="text-xl text-light-400 max-w-3xl mx-auto">
              Der KI-Experte, der Heidelberger Businesses hilft, in der KI-Revolution zu gewinnen.
            </p>
          </AnimatedElement>
        </div>
      </section>

      <section className="py-20 bg-dark-950">
        <div className="container mx-auto px-6 max-w-4xl">
          <AnimatedElement>
            <div className="bg-dark-800 rounded-2xl shadow-2xl shadow-primary/10 p-8 md:p-12 border border-dark-700 card-hover">
              <div className="text-center mb-10">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white text-6xl font-bold">L</span>
                </div>
                <h2 className="text-3xl font-bold mb-2 text-light-100">LUCA Ostellari</h2>
                <p className="text-lg text-secondary font-medium">KI-Consultant & Business Automation Expert</p>
              </div>

              <div className="space-y-6 text-lg text-light-300 leading-relaxed">
                <p>
                  Ich bin <strong>LUCA</strong>, und ich zeige Heidelberger Businesses, wie sie mit KI mehr Geld verdienen – und wie sie im KI-Ansturm nicht untergehen, sondern gewinnen.
                </p>
                <p>
                  Mit über 5 Jahren Erfahrung in der KI-Entwicklung und Business-Automatisierung helfe ich Unternehmen dabei, ihre Prozesse zu optimieren und neue Geschäftsmöglichkeiten zu erschließen.
                </p>

                <div className="grid md:grid-cols-2 gap-10 my-12">
                  <div className="bg-dark-900/50 p-6 rounded-lg border border-dark-700">
                    <h3 className="text-2xl font-bold mb-6 flex items-center text-primary"><Check className="mr-3"/> Meine Expertise</h3>
                    <ul className="space-y-4">
                      {EXPERTISE.map(item => (
                        <li key={item} className="flex items-start">
                          <Check className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                          <span className="text-light-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-dark-900/50 p-6 rounded-lg border border-dark-700">
                    <h3 className="text-2xl font-bold mb-6 flex items-center text-secondary"><Zap className="mr-3"/> Mein Ansatz</h3>
                    <ul className="space-y-4">
                      {APPROACH.map(item => (
                        <li key={item} className="flex items-start">
                           <Zap className="w-5 h-5 text-secondary mr-3 mt-1 flex-shrink-0" />
                          <span className="text-light-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl border border-primary/20">
                  <h3 className="text-2xl font-bold mb-4 text-light-100">Warum Heidelberg?</h3>
                  <p className="text-light-200">
                    Heidelberg ist meine Heimatstadt, und ich sehe das enorme Potenzial, das hier schlummert. Während internationale Konzerne bereits ihre KI-Systeme optimieren, haben lokale Businesses die Chance, jetzt zu handeln und sich einen entscheidenden Vorteil zu verschaffen.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>

      <CtaSection 
        title="Bereit für deine KI-Zukunft?"
        description="Lass uns gemeinsam dein Business zukunftssicher machen. Jeder Tag ohne KI-Optimierung ist ein verlorener Tag."
        buttonText="Kostenlose Beratung vereinbaren"
        buttonLink="/#contact"
      />
    </>
  );
};

export default AboutPage;