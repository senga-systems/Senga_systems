import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main>
      <Navigation />

      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              404
            </h1>
            <p className="text-4xl font-bold mb-4">Page Not Found</p>
            <p className="text-xl text-foreground/70">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105"
            >
              <Home size={20} />
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary border border-primary text-foreground rounded-lg font-bold hover:bg-primary/10 transition-all"
            >
              Contact Support <ArrowRight size={20} />
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-16 pt-12 border-t border-primary/20">
            <p className="text-foreground/70 mb-6">Here are some helpful links:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/" className="text-primary hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/services" className="text-primary hover:text-accent transition-colors">
                Services
              </Link>
              <Link href="/blog" className="text-primary hover:text-accent transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-primary hover:text-accent transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
