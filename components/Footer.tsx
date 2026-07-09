import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Share2, Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-secondary to-background border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-background font-black text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Senga Systems</span>
            </div>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Enterprise cybersecurity and software engineering solutions for organizations that refuse to compromise on security.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/20 transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/20 transition-all">
                <Share2 size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/20 transition-all">
                <Code size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-foreground font-bold mb-6">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services#penetration-testing" className="text-muted hover:text-primary transition-colors font-medium">
                  Penetration Testing
                </Link>
              </li>
              <li>
                <Link href="/services#compliance" className="text-muted hover:text-primary transition-colors font-medium">
                  Compliance & Audits
                </Link>
              </li>
              <li>
                <Link href="/services#incident-response" className="text-muted hover:text-primary transition-colors font-medium">
                  Incident Response
                </Link>
              </li>
              <li>
                <Link href="/services#devsecops" className="text-muted hover:text-primary transition-colors font-medium">
                  DevSecOps
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-bold mb-6">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted hover:text-primary transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted hover:text-primary transition-colors font-medium">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-primary transition-colors font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-muted hover:text-primary transition-colors font-medium">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 text-muted hover:text-primary transition-colors">
                <Mail size={18} className="mt-0 text-primary flex-shrink-0" />
                <span className="font-medium">hello@senga.systems</span>
              </li>
              <li className="flex gap-3 text-muted hover:text-primary transition-colors">
                <Phone size={18} className="mt-0 text-primary flex-shrink-0" />
                <span className="font-medium">+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-3 text-muted hover:text-primary transition-colors">
                <MapPin size={18} className="mt-0 text-primary flex-shrink-0" />
                <span className="font-medium">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary/5 pt-10 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted/70">
          <p>&copy; {currentYear} Senga Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
