import { Leaf, Heart, Users, Award, Target, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }) };

const About = () => (
  <div className="min-h-screen">
    <div className="bg-nature py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold">About <span className="text-gradient-primary">HealOne</span></h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Bridging ancient Ayurvedic wisdom with modern wellness needs to help you live a healthier, more balanced life.</p>
      </div>
    </div>

    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-display font-bold mb-4">Our Story</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">HealOne was founded with a simple mission: to make authentic Ayurvedic wellness accessible to everyone. We believe that nature holds the key to true health and vitality.</p>
          <p className="text-foreground/80 leading-relaxed">Our team of experienced Ayurvedic practitioners and herbalists carefully select and formulate each product using traditional methods passed down through generations, ensuring the highest quality and efficacy.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '5000+', label: 'Happy Customers' },
            { num: '100+', label: 'Natural Products' },
            { num: '15+', label: 'Expert Specialists' },
            { num: '10+', label: 'Years Experience' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card p-6 rounded-xl border text-center">
              <p className="text-2xl font-display font-bold text-primary">{stat.num}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: 'Our Mission', desc: 'To provide pure, authentic Ayurvedic products that empower people to take control of their health naturally.' },
          { icon: Eye, title: 'Our Vision', desc: 'A world where natural wellness is the first choice, and every individual has access to holistic healthcare.' },
          { icon: Heart, title: 'Our Values', desc: 'Purity, authenticity, sustainability, and compassion guide everything we do at HealOne.' },
        ].map((item, i) => (
          <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            className="bg-card p-6 rounded-xl border text-center">
            <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
