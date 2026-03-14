const Privacy = () => (
  <div className="min-h-screen">
    <div className="bg-nature py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold">Privacy <span className="text-gradient-primary">Policy</span></h1>
        <p className="text-muted-foreground mt-4">Last updated: March 2026</p>
      </div>
    </div>
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-green">
      {[
        { title: 'Information We Collect', content: 'We collect information you provide directly, including name, email, shipping address, and payment details when you make a purchase. We also collect browsing data to improve your experience.' },
        { title: 'How We Use Your Information', content: 'Your information is used to process orders, personalize your experience, send relevant wellness tips and offers, and improve our products and services.' },
        { title: 'Data Security', content: 'We implement industry-standard encryption and security measures to protect your personal data. Your payment information is processed securely through trusted payment gateways.' },
        { title: 'Cookies', content: 'We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie settings in your browser.' },
        { title: 'Third-Party Sharing', content: 'We do not sell your personal information. We may share data with trusted service providers for order fulfillment, payment processing, and analytics.' },
        { title: 'Your Rights', content: 'You can access, update, or delete your personal data at any time. Contact us at privacy@healone.com for any data-related requests.' },
        { title: 'Contact', content: 'For questions about this policy, please email privacy@healone.com or call +91 98765 43210.' },
      ].map(section => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xl font-display font-bold mb-3">{section.title}</h2>
          <p className="text-foreground/80 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Privacy;
