'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LogOut, FileText, AlertCircle, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface SecurityReport {
  id: string;
  name: string;
  type: 'Penetration Test' | 'Compliance Audit' | 'Vulnerability Assessment';
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
  riskLevel: 'low' | 'medium' | 'high';
}

export default function Portal() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [reports, setReports] = useState<SecurityReport[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    // Load sample reports for demo
    if (user) {
      const sampleReports: SecurityReport[] = [
        {
          id: '1',
          name: 'Q2 2024 Penetration Test',
          type: 'Penetration Test',
          date: '2024-06-15',
          status: 'completed',
          riskLevel: 'low',
        },
        {
          id: '2',
          name: 'SOC 2 Compliance Audit',
          type: 'Compliance Audit',
          date: '2024-07-10',
          status: 'in-progress',
          riskLevel: 'medium',
        },
        {
          id: '3',
          name: 'Infrastructure Assessment',
          type: 'Vulnerability Assessment',
          date: '2024-07-20',
          status: 'pending',
          riskLevel: 'medium',
        },
      ];
      setReports(sampleReports);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-foreground/70">Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-primary" />;
      case 'in-progress':
        return <Clock size={20} className="text-accent" />;
      case 'pending':
        return <AlertCircle size={20} className="text-muted" />;
      default:
        return null;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-primary';
      case 'medium':
        return 'text-accent';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-foreground/70';
    }
  };

  return (
    <main>
      <Navigation />

      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}</h1>
              <p className="text-foreground/70">{user.company}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-secondary border border-primary/20 text-foreground rounded-lg hover:border-primary transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6">
              <BarChart3 className="text-primary mb-3" size={24} />
              <p className="text-foreground/70 text-sm mb-1">Completed Reports</p>
              <p className="text-3xl font-bold">5</p>
            </div>
            <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6">
              <Clock className="text-accent mb-3" size={24} />
              <p className="text-foreground/70 text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold">2</p>
            </div>
            <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6">
              <AlertCircle className="text-muted mb-3" size={24} />
              <p className="text-foreground/70 text-sm mb-1">Pending Review</p>
              <p className="text-3xl font-bold">1</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Reports */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Security Reports</h2>

          <div className="space-y-4">
            {reports.map(report => (
              <div
                key={report.id}
                className="bg-secondary/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="text-primary" size={20} />
                      <h3 className="text-xl font-bold">{report.name}</h3>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {report.type}
                      </span>
                    </div>
                    <p className="text-foreground/70 text-sm">
                      Report Date: {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-foreground/70 text-sm mb-1">Risk Level</p>
                      <p className={`font-semibold capitalize ${getRiskColor(report.riskLevel)}`}>
                        {report.riskLevel}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <p className="text-foreground/70 capitalize text-sm">{report.status}</p>
                    </div>

                    {report.status === 'completed' && (
                      <button className="px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-accent transition-all">
                        Download Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/contact"
              className="bg-background/50 border border-primary/20 rounded-lg p-8 hover:border-primary/50 transition-all text-center"
            >
              <h3 className="text-xl font-bold mb-3">Schedule Audit</h3>
              <p className="text-foreground/70 mb-4">Request a new security assessment</p>
              <button className="text-primary hover:text-accent transition-colors font-semibold">
                Schedule →
              </button>
            </Link>

            <Link
              href="/services"
              className="bg-background/50 border border-primary/20 rounded-lg p-8 hover:border-primary/50 transition-all text-center"
            >
              <h3 className="text-xl font-bold mb-3">View Services</h3>
              <p className="text-foreground/70 mb-4">Learn about our security offerings</p>
              <button className="text-primary hover:text-accent transition-colors font-semibold">
                Explore →
              </button>
            </Link>

            <Link
              href="/blog"
              className="bg-background/50 border border-primary/20 rounded-lg p-8 hover:border-primary/50 transition-all text-center"
            >
              <h3 className="text-xl font-bold mb-3">Security Resources</h3>
              <p className="text-foreground/70 mb-4">Read security best practices</p>
              <button className="text-primary hover:text-accent transition-colors font-semibold">
                Read →
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
