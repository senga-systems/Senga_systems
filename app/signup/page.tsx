'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.company) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (signup(formData.name, formData.email, formData.password, formData.company)) {
      router.push('/portal');
    } else {
      setError('Email already in use');
    }

    setIsLoading(false);
  };

  return (
    <main>
      <Navigation />

      <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-md w-full bg-secondary/50 border border-primary/20 rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <UserPlus className="text-background" size={24} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-foreground/70 text-center mb-8">Join Senga Systems client portal</p>

          {error && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-accent" />
              <p className="text-foreground text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                placeholder="your@company.com"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-foreground/70 mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-accent transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
