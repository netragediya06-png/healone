import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { products, productTypes, healthCategories } from '@/lib/products-data';
import productsHero from '@/assets/products-hero.jpg';

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const [selectedType, setSelectedType] = useState(initialCategory);
  const [selectedHealth, setSelectedHealth] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (selectedType && p.category !== selectedType && p.healthCategory !== selectedType) return false;
      if (selectedHealth && p.healthCategory !== selectedHealth) return false;
      return true;
    });
  }, [selectedType, selectedHealth]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img src={productsHero} alt="Ayurvedic products" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Leaf className="h-4 w-4" /> 100% Natural & Ayurvedic
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
              Our <span className="text-primary">Products</span>
            </h1>
            <p className="text-lg text-background/70 mt-4 max-w-lg leading-relaxed">
              100% natural Ayurvedic products for your wellness needs, crafted with ancient wisdom and modern science.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/remedies"><Button size="lg" className="gap-2">Browse Remedies <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/specialists"><Button size="lg" variant="outline" className="gap-2 border-background/30 text-background hover:bg-background/10">Consult Expert</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-xl border p-5 sticky top-24">
              <h3 className="font-display font-semibold mb-4">Product Type</h3>
              <div className="space-y-1.5">
                <button onClick={() => setSelectedType('')} className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${!selectedType ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                  All Products
                </button>
                {productTypes.map(type => (
                  <button key={type} onClick={() => setSelectedType(type)} className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${selectedType === type ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                    {type}
                  </button>
                ))}
              </div>

              <h3 className="font-display font-semibold mb-4 mt-6">Health Concern</h3>
              <div className="space-y-1.5">
                <button onClick={() => setSelectedHealth('')} className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${!selectedHealth ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                  All Concerns
                </button>
                {healthCategories.map(cat => (
                  <button key={cat} onClick={() => setSelectedHealth(cat)} className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${selectedHealth === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products grid - 4 columns */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
              <Button variant="outline" size="sm" className="lg:hidden gap-2" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p className="font-display text-lg">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
