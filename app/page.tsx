import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { ArrowRight, Shield, Lock, AlertTriangle, Zap } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Shield,
    title: 'Penetration Testing',
    description: 'Comprehensive security assessments to identify vulnerabilities before attackers do.',
  },
  {
    icon: Lock,
    title: 'Compliance & Audits',
    description: 'Meet regulatory requirements with thorough compliance audits and documentation.',
  },
  {
    icon: AlertTriangle,
    title: 'Incident Response',
    description: '24/7 response team ready to handle security incidents and breaches.',
  },
  {
    icon: Zap,
    title: 'DevSecOps',
    description: 'Integrate security into your development pipeline from day one.',
  },
];

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />

      {/* Services Preview */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Comprehensive security solutions designed for enterprise organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-background/50 border border-primary/20 rounded-lg p-8 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <Icon className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-foreground/70 mb-4">{service.description}</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-semibold"
                  >
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105"
            >
              View All Services <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Why Choose Senga Systems?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-secondary/50 rounded-lg border border-primary/20">
              <h3 className="text-xl font-bold mb-3">Expert Team</h3>
              <p className="text-foreground/70">
                Certified security professionals with decades of combined experience
              </p>
            </div>
            <div className="p-6 bg-secondary/50 rounded-lg border border-primary/20">
              <h3 className="text-xl font-bold mb-3">Proactive Approach</h3>
              <p className="text-foreground/70">
                We identify threats before they become breaches
              </p>
            </div>
            <div className="p-6 bg-secondary/50 rounded-lg border border-primary/20">
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-foreground/70">
                Always available when you need us most
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105"
          >
            Schedule Your Security Audit Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
