import Link from 'next/link';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(90deg, var(--color-primary) 1px, transparent 1px), linear-gradient(var(--color-primary) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Gradient Blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent opacity-20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-6 inline-block">
          <div className="flex items-center gap-2 bg-secondary/50 backdrop-blur border border-primary/20 rounded-full px-4 py-2 text-sm">
            <Shield size={16} className="text-primary" />
            <span className="text-foreground/80">Enterprise-Grade Security Solutions</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-foreground">Cybersecurity </span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            You Can Trust
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          Protect your enterprise with advanced penetration testing, compliance audits, and incident response services backed by security experts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/services"
            className="px-8 py-4 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Explore Services <ArrowRight size={20} />
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 bg-secondary border border-primary text-foreground rounded-lg font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
          >
            Get a Free Consultation <Zap size={20} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-primary/20">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-foreground/70">Security Audits Completed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <p className="text-foreground/70">Client Satisfaction Rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <p className="text-foreground/70">Incident Response Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
