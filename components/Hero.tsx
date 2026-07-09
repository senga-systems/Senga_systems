import Link from 'next/link';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: 'linear-gradient(90deg, var(--color-primary) 1px, transparent 1px), linear-gradient(var(--color-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Premium Gradient Blobs */}
      <div className="absolute top-32 right-20 w-96 h-96 bg-primary opacity-15 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-accent-secondary opacity-5 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-8 inline-block">
          <div className="flex items-center gap-2 bg-tertiary/60 backdrop-blur-lg border border-primary/30 rounded-full px-5 py-2.5 text-sm font-medium hover:border-primary/50 transition-all">
            <Shield size={18} className="text-primary" />
            <span className="text-foreground/90">Enterprise Security Reimagined</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
          <span className="text-foreground block mb-2">Advanced </span>
          <span className="bg-gradient-to-r from-primary via-accent to-accent-secondary bg-clip-text text-transparent">
            Cybersecurity
          </span>
          <span className="text-foreground block mt-2">You Can Trust</span>
        </h1>

        <p className="text-lg md:text-xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Enterprise-grade security solutions including penetration testing, compliance audits, incident response, and DevSecOps—backed by certified security experts.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <Link
            href="/services"
            className="px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-background rounded-lg font-bold hover:shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            Explore Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 bg-tertiary border-2 border-primary/40 text-foreground rounded-lg font-bold hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
          >
            Start Free Audit <Zap size={20} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-primary/10">
          <div className="text-center group">
            <div className="text-5xl font-black bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">500+</div>
            <p className="text-muted text-sm uppercase tracking-wider font-semibold">Security Audits</p>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-black bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">98%</div>
            <p className="text-muted text-sm uppercase tracking-wider font-semibold">Client Satisfaction</p>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">24/7</div>
            <p className="text-muted text-sm uppercase tracking-wider font-semibold">Incident Response</p>
          </div>
        </div>
      </div>
    </section>
  );
}
