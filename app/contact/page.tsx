'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'penetration-testing',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store in localStorage (frontend-only as per requirements)
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    leads.push({
      ...formData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('leads', JSON.stringify(leads));
    
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      service: 'penetration-testing',
      message: '',
    });

    // Reset after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-foreground/70">
            Have questions about our services? Let&apos;s chat about your security needs.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-8 text-center">
            <Mail className="text-primary mx-auto mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-foreground/70 mb-4">hello@senga.systems</p>
            <p className="text-sm text-foreground/60">Usually responds within 24 hours</p>
          </div>

          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-8 text-center">
            <Phone className="text-primary mx-auto mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p className="text-foreground/70 mb-4">+1 (555) 123-4567</p>
            <p className="text-sm text-foreground/60">Mon-Fri, 9am-6pm PST</p>
          </div>

          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-8 text-center">
            <MapPin className="text-primary mx-auto mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Office</h3>
            <p className="text-foreground/70 mb-4">San Francisco, CA</p>
            <p className="text-sm text-foreground/60">Available for in-person meetings</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg flex items-center gap-3">
                <Clock size={20} className="text-primary" />
                <p className="text-foreground">Thank you! We&apos;ll be in touch within 24 hours.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-semibold mb-2">
                  Service of Interest *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="penetration-testing">Penetration Testing</option>
                  <option value="compliance">Compliance & Audits</option>
                  <option value="incident-response">Incident Response</option>
                  <option value="devsecops">DevSecOps</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your security concerns and how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Message
              </button>

              <p className="text-xs text-foreground/60 text-center">
                We respect your privacy. Your information will only be used to contact you about your inquiry.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'How long does a typical penetration test take?',
                a: 'Most assessments take 1-4 weeks depending on scope. We provide a timeline during the initial consultation.',
              },
              {
                q: 'What is your response time for incidents?',
                a: 'We maintain 24/7 on-call teams with average response times under 1 hour for critical incidents.',
              },
              {
                q: 'Do you offer ongoing support?',
                a: 'Yes! We offer retainer-based services for continuous monitoring, vulnerability management, and support.',
              },
              {
                q: 'How much does a security assessment cost?',
                a: 'Pricing varies based on scope, size of infrastructure, and specific requirements. We provide custom quotes after understanding your needs.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-background/50 border border-primary/20 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2 text-primary">{faq.q}</h3>
                <p className="text-foreground/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
