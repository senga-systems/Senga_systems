'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (login(email, password)) {
      router.push('/portal');
    } else {
      setError('Invalid email or password');
    }

    setIsLoading(false);
  };

  return (
    <main>
      <Navigation />

      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full bg-secondary/50 border border-primary/20 rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <LogIn className="text-background" size={24} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Client Portal</h1>
          <p className="text-foreground/70 text-center mb-8">Sign in to access your security dashboard</p>

          {error && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-accent" />
              <p className="text-foreground">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-accent transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-foreground/70 mt-6 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-accent transition-colors font-semibold">
              Sign up
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-background/50 border border-primary/20 rounded-lg text-xs text-foreground/60">
            <p className="font-semibold text-foreground/80 mb-2">Demo Credentials:</p>
            <p>Email: demo@senga.systems</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
