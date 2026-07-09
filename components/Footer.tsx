import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Twitter, Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-foreground">Senga Systems</span>
            </div>
            <p className="text-foreground/70 text-sm mb-4">
              Enterprise cybersecurity solutions for organizations that refuse to compromise on security.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Code size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#penetration-testing" className="text-foreground/70 hover:text-primary transition-colors">
                  Penetration Testing
                </Link>
              </li>
              <li>
                <Link href="/services#compliance" className="text-foreground/70 hover:text-primary transition-colors">
                  Compliance & Audits
                </Link>
              </li>
              <li>
                <Link href="/services#incident-response" className="text-foreground/70 hover:text-primary transition-colors">
                  Incident Response
                </Link>
              </li>
              <li>
                <Link href="/services#devsecops" className="text-foreground/70 hover:text-primary transition-colors">
                  DevSecOps
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/70 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-foreground/70 hover:text-primary transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 text-foreground/70">
                <Mail size={16} className="mt-0.5 text-primary" />
                <span>hello@senga.systems</span>
              </li>
              <li className="flex gap-2 text-foreground/70">
                <Phone size={16} className="mt-0.5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-2 text-foreground/70">
                <MapPin size={16} className="mt-0.5 text-primary" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
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
