import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, Lock, AlertTriangle, Zap, CheckCircle, Users } from 'lucide-react';
import Link from 'next/link';

const servicesDetail = [
  {
    id: 'penetration-testing',
    icon: Shield,
    title: 'Penetration Testing',
    subtitle: 'Identify vulnerabilities before attackers do',
    description: 'Our certified penetration testers conduct comprehensive security assessments of your infrastructure, applications, and user awareness.',
    benefits: [
      'Identify zero-day vulnerabilities',
      'Test social engineering defenses',
      'Evaluate network segmentation',
      'Assess application security',
      'Document findings with remediation guidance',
    ],
    pricing: 'Custom Quote',
  },
  {
    id: 'compliance',
    icon: Lock,
    title: 'Compliance & Audits',
    subtitle: 'Meet regulatory requirements with confidence',
    description: 'We help organizations achieve and maintain compliance with regulations like HIPAA, PCI-DSS, SOC 2, and GDPR.',
    benefits: [
      'Compliance gap assessments',
      'Policy development and review',
      'Evidence collection and documentation',
      'Audit preparation and support',
      'Ongoing compliance monitoring',
    ],
    pricing: 'Custom Quote',
  },
  {
    id: 'incident-response',
    icon: AlertTriangle,
    title: 'Incident Response',
    subtitle: '24/7 support when breaches occur',
    description: 'Our incident response team provides immediate support during security breaches, helping minimize damage and recover quickly.',
    benefits: [
      '24/7 on-call availability',
      'Immediate containment strategies',
      'Forensic investigation',
      'Communication guidance',
      'Post-incident reporting',
    ],
    pricing: 'Retainer-based',
  },
  {
    id: 'devsecops',
    icon: Zap,
    title: 'DevSecOps',
    subtitle: 'Integrate security into development workflows',
    description: 'We help organizations embed security practices throughout their development lifecycle, from code to deployment.',
    benefits: [
      'Security pipeline integration',
      'SAST/DAST implementation',
      'Dependency scanning',
      'Container security',
      'Infrastructure as Code security',
    ],
    pricing: 'Custom Quote',
  },
];

export default function Services() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Enterprise Security Services
          </h1>
          <p className="text-xl text-foreground/70 mb-8">
            Comprehensive solutions tailored to your organization&apos;s unique security challenges
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {servicesDetail.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className="mb-4">
                    <Icon className="text-primary" size={40} />
                  </div>
                  <h2 className="text-4xl font-bold mb-2">{service.title}</h2>
                  <p className="text-lg text-foreground/70 mb-4">{service.subtitle}</p>
                  <p className="text-foreground/80 mb-6 leading-relaxed">{service.description}</p>

                  <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
                  <ul className="space-y-2 mb-8">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-foreground/80">
                        <CheckCircle size={18} className="text-primary flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4">
                    <Link
                      href="/contact"
                      className="px-6 py-3 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all"
                    >
                      Get Started
                    </Link>
                    <span className="text-foreground/60">Starting from: {service.pricing}</span>
                  </div>
                </div>

                <div className={`bg-secondary/50 border border-primary/20 rounded-lg p-12 flex items-center justify-center min-h-96 ${
                  index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''
                }`}>
                  <Icon size={200} className="text-primary/20" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Partner With Senga Systems?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background/50 border border-primary/20 rounded-lg p-8">
              <Users size={32} className="text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Certified Experts</h3>
              <p className="text-foreground/70">
                Our team includes OSCP, CISSP, and other industry-leading certifications
              </p>
            </div>

            <div className="bg-background/50 border border-primary/20 rounded-lg p-8">
              <Shield size={32} className="text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Proven Track Record</h3>
              <p className="text-foreground/70">
                500+ successful security engagements across Fortune 500 companies
              </p>
            </div>

            <div className="bg-background/50 border border-primary/20 rounded-lg p-8">
              <Zap size={32} className="text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Quick Response</h3>
              <p className="text-foreground/70">
                24/7 availability with average response time under 1 hour
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Organization?</h2>
        <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          Get in touch with our team for a free consultation about your security needs
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105"
        >
          Schedule Free Consultation
        </Link>
      </section>

      <Footer />
    </main>
  );
}
