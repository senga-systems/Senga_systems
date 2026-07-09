'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Users, Mail, MessageSquare, BarChart3, LogOut, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      setIsLoggedIn(true);
      loadLeads();
    }
    // Set demo password
    setAdminPassword('admin123');
  }, []);

  const loadLeads = () => {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(storedLeads);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('adminSession', 'true');
      loadLeads();
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminSession');
  };

  const deleteLead = (index: number) => {
    const updatedLeads = leads.filter((_, i) => i !== index);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    setSelectedLead(null);
  };

  if (!isLoggedIn) {
    return (
      <main>
        <Navigation />
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-md w-full bg-secondary/50 border border-primary/20 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-2">Admin Dashboard</h1>
            <p className="text-foreground/70 text-center mb-8">Enter admin password to access</p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-accent transition-all"
              >
                Access Dashboard
              </button>
            </form>

            <p className="text-center text-foreground/60 text-xs mt-6">Demo Password: admin123</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navigation />

      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-secondary border border-primary/20 text-foreground rounded-lg hover:border-primary transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6">
              <Mail className="text-primary mb-3" size={24} />
              <p className="text-foreground/70 text-sm mb-1">Total Leads</p>
              <p className="text-3xl font-bold">{leads.length}</p>
            </div>
            <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6">
              <Users className="text-accent mb-3" size={24} />
              <p className="text-foreground/70 text-sm mb-1">This Week</p>
              <p className="text-3xl font-bold">{leads.filter(l => {
                const date = new Date(l.timestamp);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return date > weekAgo;
              }).length}</p>
            </div>
            <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6">
              <BarChart3 className="text-primary mb-3" size={24} />
              <p className="text-foreground/70 text-sm mb-1">Engagement Rate</p>
              <p className="text-3xl font-bold">100%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leads List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Recent Leads</h2>

              {leads.length === 0 ? (
                <div className="bg-secondary/50 border border-primary/20 rounded-lg p-12 text-center">
                  <MessageSquare size={48} className="text-foreground/40 mx-auto mb-4" />
                  <p className="text-foreground/70">No leads yet. Contact inquiries will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedLead(lead)}
                      className={`bg-secondary/50 border rounded-lg p-6 cursor-pointer transition-all ${
                        selectedLead === lead
                          ? 'border-primary bg-secondary/80'
                          : 'border-primary/20 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{lead.name}</h3>
                          <p className="text-foreground/70 text-sm">{lead.email}</p>
                          <p className="text-foreground/60 text-sm">{lead.company}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {lead.service}
                            </span>
                            <span className="text-xs text-foreground/50">
                              {new Date(lead.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Lead Details</h2>

              {selectedLead ? (
                <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">{selectedLead.name}</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Email</p>
                      <p className="font-semibold">{selectedLead.email}</p>
                    </div>

                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Phone</p>
                      <p className="font-semibold">{selectedLead.phone || 'Not provided'}</p>
                    </div>

                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Company</p>
                      <p className="font-semibold">{selectedLead.company}</p>
                    </div>

                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Service Interest</p>
                      <p className="font-semibold capitalize">{selectedLead.service}</p>
                    </div>

                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Date Submitted</p>
                      <p className="font-semibold">
                        {new Date(selectedLead.timestamp).toLocaleDateString()} at{' '}
                        {new Date(selectedLead.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Message</p>
                      <p className="text-foreground/80 bg-background/50 p-3 rounded text-sm">
                        {selectedLead.message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-accent transition-all"
                    >
                      <Mail size={18} />
                      Send Email
                    </a>
                    <button
                      onClick={() => {
                        const index = leads.indexOf(selectedLead);
                        deleteLead(index);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent/20 text-accent border border-accent/50 rounded-lg font-semibold hover:bg-accent/30 transition-all"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6 text-center">
                  <MessageSquare size={32} className="text-foreground/40 mx-auto mb-3" />
                  <p className="text-foreground/70">Select a lead to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
