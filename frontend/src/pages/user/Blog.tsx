import { motion } from 'framer-motion';
import { Calendar, ArrowRight, User, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import blogHero from '@/assets/blog-hero.jpg';
import immunityImg from '@/assets/blog/immunity-herbs.jpg';
import doshaImg from '@/assets/blog/dosha-types.jpg';
import yogaImg from '@/assets/blog/morning-yoga.jpg';
import wheatgrassImg from '@/assets/blog/wheatgrass.jpg';
import skincareImg from '@/assets/blog/skincare.jpg';
import ashwagandhaImg from '@/assets/blog/ashwagandha.jpg';

const blogPosts = [
  { id: '1', title: '10 Ayurvedic Herbs for Immunity', excerpt: 'Discover the most powerful herbs that can naturally boost your immune system and protect against seasonal illnesses.', date: 'Mar 5, 2026', author: 'Dr. Priya Sharma', category: 'Herbs', readTime: '5 min', image: immunityImg },
  { id: '2', title: 'Understanding Your Dosha Type', excerpt: 'Learn about Vata, Pitta, and Kapha doshas and how knowing your type can transform your health and wellness journey.', date: 'Mar 2, 2026', author: 'Dr. Rajesh Gupta', category: 'Ayurveda', readTime: '7 min', image: doshaImg },
  { id: '3', title: 'Morning Yoga Routine for Beginners', excerpt: 'A simple 15-minute yoga routine to start your day with energy, flexibility, and mental clarity.', date: 'Feb 28, 2026', author: 'Dr. Anita Verma', category: 'Yoga', readTime: '4 min', image: yogaImg },
  { id: '4', title: 'Benefits of Wheatgrass Juice', excerpt: 'Why wheatgrass is called a superfood and how daily consumption can detoxify your body and boost hemoglobin levels.', date: 'Feb 25, 2026', author: 'HealOne Team', category: 'Nutrition', readTime: '6 min', image: wheatgrassImg },
  { id: '5', title: 'Ayurvedic Skincare Secrets', excerpt: 'Natural remedies and herbal formulations for glowing, healthy skin without harsh chemicals.', date: 'Feb 20, 2026', author: 'Dr. Priya Sharma', category: 'Skin Care', readTime: '5 min', image: skincareImg },
  { id: '6', title: 'Managing Stress with Ashwagandha', excerpt: 'How this ancient adaptogenic herb can help reduce cortisol levels and improve your mental well-being.', date: 'Feb 15, 2026', author: 'Dr. Sanjay Patel', category: 'Wellness', readTime: '6 min', image: ashwagandhaImg },
];

const Blog = () => (
  <div className="min-h-screen">
    {/* Hero - matching Yoga/Remedies style */}
    <section className="relative min-h-[50vh] flex items-center overflow-hidden">
      <img src={blogHero} alt="Wellness blog" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
      <div className="container mx-auto px-4 relative z-10 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
            <Leaf className="h-4 w-4" /> Expert Wellness Insights
          </span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
            Wellness <span className="text-primary">Blog</span>
          </h1>
          <p className="text-lg text-background/70 mt-4 max-w-lg leading-relaxed">
            Expert insights on Ayurveda, yoga, nutrition, and holistic health from our specialists.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link to="/remedies"><Button size="lg" className="gap-2">Browse Remedies <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/specialists"><Button size="lg" variant="outline" className="gap-2 border-background/30 text-background hover:bg-background/10">Our Experts</Button></Link>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, i) => (
          <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl border overflow-hidden hover:shadow-elevated transition-all group">
            <div className="h-48 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span>
              <h2 className="font-display text-lg font-bold mt-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {post.author}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
