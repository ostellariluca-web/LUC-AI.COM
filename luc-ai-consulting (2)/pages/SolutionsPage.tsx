// FIX: Removed a conflicting /// <reference types="react" /> directive that was causing type resolution issues.
import React from 'react';
import { SOLUTIONS, PROCESS_STEPS, STATS } from '../constants';
import AnimatedElement from '../components/AnimatedElement';
import CtaSection from '../components/CtaSection';
import { Check, AlertTriangle } from 'lucide-react';

const SolutionsPage: React.FC = () => {
  return (
    <>
      <section className="bg-dark-900">
        <div className="container mx-auto px-6 py-20 text-center">
          <AnimatedElement>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-light-100">
              Die Zukunft von <span className="gradient-text">Heidelberg</span> beginnt jetzt
            </h1>
            <p className="text-xl text-light-400 max-w-3xl mx-auto">
              Ich baue die KI-Infrastruktur für Heidelbergs Geschäfte. Dein Business sollte vorne dabei sein.
            </p>
          </AnimatedElement>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-20 bg-dark-950">
        <div className="container mx-auto px-6">
          <AnimatedElement className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Die KI-Revolution ist da</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
          </AnimatedElement>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STATS.map((stat, index) => (
              <AnimatedElement key={index} delay={index * 100}>
                <div className="stat-card bg-dark-800 p-6 rounded-lg border-l-4 border-primary-500 h-full">
                  <div className="text-4xl font-bold text-primary-500 mb-2">{stat.value}</div>
                  <p className="text-light-400">{stat.label}</p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      
      {/* Core Services Section */}
      <section className="py-20 bg-dark-950">
        <div className="container mx-auto px-6">
          <AnimatedElement className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meine <span className="gradient-text">Lösungen</span></h2>
            <p className="text-lg text-light-400 max-w-3xl mx-auto">
              Professionelle KI-Lösungen für dein Business – von Voice Agents bis hin zu maßgeschneiderten Systemen.
            </p>
          </AnimatedElement>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SOLUTIONS.map((solution, index) => (
              <AnimatedElement key={solution.title} delay={index * 100} className={solution.isWide ? 'lg:col-span-2' : ''}>
                <div className="gradient-border h-full solution-card">
                    <div className="bg-dark-800 rounded-xl p-8 h-full flex flex-col">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-dark-700`}>
                            <solution.icon className={`w-7 h-7 ${solution.color === 'primary' ? 'text-primary-500' : 'text-secondary-500'}`} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-light-100">{solution.title}</h3>
                        <p className="text-light-400 mb-6 flex-grow">{solution.description}</p>
                        <ul className="space-y-3 text-light-200 mb-6">
                            {solution.features.map(feature => (
                            <li key={feature} className="flex items-start">
                                <Check className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                            ))}
                        </ul>
                        {solution.quote && (
                          <div className="bg-dark-900/50 mt-auto p-4 rounded-lg border border-dark-700">
                            <p className="text-light-400 font-medium text-sm italic">
                              "{solution.quote}"
                            </p>
                          </div>
                        )}
                    </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-20 bg-dark-900">
        <div className="container mx-auto px-6">
            <AnimatedElement className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">So funktioniert es</h2>
                <p className="text-lg text-light-400 max-w-2xl mx-auto">
                    Ein strukturierter und transparenter Ansatz für dein KI-Projekt.
                </p>
            </AnimatedElement>
            <div className="max-w-3xl mx-auto space-y-8">
                {PROCESS_STEPS.map((step, index) => (
                    <AnimatedElement key={step.title} delay={index * 150}>
                       <div className="process-step" data-step={index + 1}>
                            <h3 className="text-xl font-bold mb-2 text-light-100">{step.title}</h3>
                            <p className="text-light-400">{step.description}</p>
                        </div>
                    </AnimatedElement>
                ))}
            </div>
        </div>
      </section>

      <CtaSection 
        title="Bereit für die KI-Zukunft?"
        description="Die KI-Revolution wartet nicht. Jeder Tag ohne Optimierung ist ein verlorener Tag. Kunden, die deine Konkurrenz heute gewinnt, kommen morgen nicht mehr zurück."
        buttonText="Kostenlose Beratung vereinbaren"
        buttonLink="/#contact"
      />
    </>
  );
};

export default SolutionsPage;