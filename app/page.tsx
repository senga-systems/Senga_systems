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
      <section className="bg-gradient-to-b from-tertiary to-secondary py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Services</span></h2>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade security solutions designed to protect your organization from evolving cyber threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-tertiary to-secondary/50 border border-primary/10 hover:border-primary/40 rounded-2xl p-10 transition-all hover:shadow-lg hover:shadow-primary/15 hover:-translate-y-2"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">{service.title}</h3>
                  <p className="text-muted mb-6 leading-relaxed">{service.description}</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-all font-semibold group/link"
                  >
                    Learn More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary to-blue-500 text-background rounded-lg font-bold hover:shadow-lg hover:shadow-primary/40 transition-all hover:scale-105 group"
            >
              View All Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-tertiary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">Why Choose <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Senga Systems</span>?</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">Trusted by enterprise organizations worldwide for security excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-gradient-to-br from-tertiary to-secondary/50 p-10 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-2">
              <div className="text-4xl font-black bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Expert Team</h3>
              <p className="text-muted leading-relaxed">
                OSCP, CISSP, and certified security professionals with 200+ combined years of experience
              </p>
            </div>
            <div className="group bg-gradient-to-br from-tertiary to-secondary/50 p-10 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-2">
              <div className="text-4xl font-black bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Proactive Approach</h3>
              <p className="text-muted leading-relaxed">
                We identify and eliminate threats before they become breaches or compliance violations
              </p>
            </div>
            <div className="group bg-gradient-to-br from-tertiary to-secondary/50 p-10 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-2">
              <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">24/7 Support</h3>
              <p className="text-muted leading-relaxed">
                Always available for incident response and ongoing security support and guidance
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary to-blue-500 text-background rounded-lg font-bold hover:shadow-lg hover:shadow-primary/40 transition-all hover:scale-105 group"
            >
              Schedule Your Security Audit Today <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
