import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Award, Users, Target, Zap } from 'lucide-react';
import Link from 'next/link';

const team = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Founder & Chief Security Officer',
    bio: 'PhD in Cybersecurity with 15+ years of experience in enterprise security.',
  },
  {
    name: 'James Mitchell',
    role: 'VP of Penetration Testing',
    bio: 'OSCP certified with expertise in infrastructure and application security.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Compliance & Risk Director',
    bio: 'CISSP, CISM certified with extensive regulatory compliance experience.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Incident Response Lead',
    bio: 'Former law enforcement cybercrime investigator, now heads our IR team.',
  },
];

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We pursue excellence in every engagement, delivering comprehensive and actionable security insights.',
  },
  {
    icon: Users,
    title: 'Integrity',
    description: 'We operate with complete transparency and honest communication with our clients.',
  },
  {
    icon: Award,
    title: 'Innovation',
    description: 'We stay ahead of emerging threats by continuously updating our methodologies and tools.',
  },
  {
    icon: Zap,
    title: 'Efficiency',
    description: 'We deliver results quickly without compromising on quality or depth of analysis.',
  },
];

export default function About() {
  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Senga Systems</h1>
          <p className="text-xl text-foreground/70">
            Trusted by enterprises worldwide to deliver world-class cybersecurity solutions
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              To empower organizations to defend against sophisticated cyber threats through expert guidance, 
              cutting-edge tools, and unwavering commitment to security excellence. We believe that every 
              organization deserves access to world-class security expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-background/50 border border-primary/20 rounded-lg p-8">
                  <Icon className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-foreground/70">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-foreground/70">Security Engagements</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">50+</div>
              <p className="text-foreground/70">Security Professionals</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">98%</div>
              <p className="text-foreground/70">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">15+</div>
              <p className="text-foreground/70">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-background/50 border border-primary/20 rounded-lg p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg mb-4" />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-3">{member.role}</p>
                <p className="text-foreground/70">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {[
              { year: '2009', milestone: 'Senga Systems founded by Dr. Sarah Chen' },
              { year: '2012', milestone: 'Expanded team to 10 security professionals' },
              { year: '2015', milestone: 'Completed 100th security engagement' },
              { year: '2018', milestone: 'Opened offices in 3 new cities' },
              { year: '2021', milestone: 'Achieved ISO 27001 certification' },
              { year: '2024', milestone: 'Expanded to 50+ team members globally' },
            ].map((item, index) => (
              <div key={index} className="flex gap-8 items-center">
                <div className="flex-shrink-0 w-24 font-bold text-primary text-lg">{item.year}</div>
                <div className="flex-1 bg-secondary/50 border-l-2 border-primary pl-6 py-4 rounded">
                  <p className="text-foreground/80">{item.milestone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
        <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          Help us build a more secure digital world. We&apos;re always looking for talented security professionals.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105"
        >
          Get in Touch
        </Link>
      </section>

      <Footer />
    </main>
  );
}
