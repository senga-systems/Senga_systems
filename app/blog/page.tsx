'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAllBlogPosts } from '@/lib/blog-posts';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Blog() {
  const posts = getAllBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(posts.map(p => p.category)));
  const filteredPosts = selectedCategory 
    ? posts.filter(p => p.category === selectedCategory)
    : posts;

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Security Insights & Resources</h1>
          <p className="text-xl text-foreground/70">
            Industry expertise, threat analysis, and security best practices
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Categories */}
          <div className="mb-12 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-background'
                  : 'bg-secondary border border-primary/20 text-foreground hover:border-primary'
              }`}
            >
              All Posts
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-background'
                    : 'bg-secondary border border-primary/20 text-foreground hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group bg-secondary/50 border border-primary/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  {post.image && (
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
                      <span className="text-primary font-semibold">{post.category}</span>
                      <span>{post.readTime} min read</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-foreground/70 mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-foreground/60 pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/70 text-lg">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-foreground/70 mb-8">
            Subscribe to our newsletter for the latest security insights and threat intelligence
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
