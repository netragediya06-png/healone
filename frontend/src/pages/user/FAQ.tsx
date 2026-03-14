import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'What is Ayurveda?', a: 'Ayurveda is a 5000-year-old natural healing system from India that focuses on balancing body, mind, and spirit through herbs, diet, yoga, and lifestyle practices.' },
  { q: 'Are your products safe?', a: 'Yes, all our products are 100% natural, lab-tested, and manufactured in GMP-certified facilities. They contain no harmful chemicals or synthetic ingredients.' },
  { q: 'How long before I see results?', a: 'Ayurvedic remedies work holistically. You may notice improvements within 2-4 weeks of consistent use, though some conditions may require longer treatment.' },
  { q: 'What is a Dosha?', a: 'In Ayurveda, Doshas are the three energies (Vata, Pitta, Kapha) that govern our body and mind. Understanding your Dosha type helps personalize your wellness plan.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship across India. International shipping will be available soon. Subscribe to our newsletter for updates.' },
  { q: 'Can I return products?', a: 'We offer a 30-day return policy for unopened products. If you have concerns about a product, contact our support team.' },
  { q: 'Are products suitable for pregnant women?', a: 'We recommend consulting your healthcare provider before starting any new supplement during pregnancy or breastfeeding.' },
  { q: 'How do wellness programs work?', a: 'Our programs include curated herbal products, daily routines, dietary guidelines, and expert consultations delivered over the program duration.' },
];

const FAQ = () => (
  <div className="min-h-screen">
    <div className="bg-nature py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold">Frequently Asked <span className="text-gradient-primary">Questions</span></h1>
        <p className="text-muted-foreground mt-4">Everything you need to know about HealOne and Ayurvedic wellness.</p>
      </div>
    </div>
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-card border rounded-xl px-5">
            <AccordionTrigger className="font-display font-semibold text-left hover:no-underline">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default FAQ;
