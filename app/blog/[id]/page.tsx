import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog-posts';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map(post => ({
    id: post.id,
  }));
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const nextPost = allPosts[currentIndex + 1];
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <main>
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-6">
            <ArrowLeft size={18} />
            Back to Blog
          </Link>

          <div className="mb-6 inline-block">
            <span className="text-primary font-semibold">{post.category}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-foreground/70 text-sm">
            <span className="flex items-center gap-2">
              <User size={16} />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none prose-p:text-foreground/80 prose-p:leading-relaxed prose-headings:text-foreground prose-headings:font-bold prose-strong:text-foreground prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-li:text-foreground/80 prose-hr:border-primary/20">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-3xl font-bold mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-2xl font-bold mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 my-4 text-foreground/80">
                    {items.map((item, idx) => (
                      <li key={idx} className="text-foreground/80">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph === '') {
                return null;
              }
              return (
                <p key={index} className="text-foreground/80 leading-relaxed my-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Post Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-12 border-t border-primary/20">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.id}`}
                className="group bg-secondary/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-2 text-primary mb-3">
                  <ArrowLeft size={16} />
                  <span className="text-sm font-semibold">Previous Post</span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {prevPost.title}
                </h3>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.id}`}
                className="group bg-secondary/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-2 justify-end text-primary mb-3">
                  <span className="text-sm font-semibold">Next Post</span>
                  <ArrowRight size={16} />
                </div>
                <h3 className="text-lg font-bold text-right group-hover:text-primary transition-colors">
                  {nextPost.title}
                </h3>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-secondary/50 border border-primary/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Interested in Our Services?</h3>
            <p className="text-foreground/70 mb-6">
              Let us help you implement the security best practices discussed in this article.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-primary text-background rounded-lg font-bold hover:bg-accent transition-all hover:scale-105"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="bg-secondary py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allPosts
              .filter(p => p.category === post.category && p.id !== post.id)
              .slice(0, 3)
              .map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="group bg-background/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2">
                    <span>{relatedPost.category}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-3">{relatedPost.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-foreground/60">
                    <span>{relatedPost.readTime} min read</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
