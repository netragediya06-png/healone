import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { productTypes, healthCategories, products } from '@/lib/products-data';
import logo from '@/assets/logo.png';

const productMegaMenu = {
  'By Product Type': productTypes,
  'By Health Concern': healthCategories.slice(0, 8),
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.healthCategory.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products', megaMenu: true },
    { label: 'Remedies', path: '/remedies' },
    { label: 'Yoga', path: '/yoga' },
    { label: 'Programs', path: '/programs' },
    { label: 'Specialists', path: '/specialists' },
    { label: 'Dosha Quiz', path: '/dosha-quiz' },
    { label: 'Blog', path: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="HealOne" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-primary">HealOne</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div key={link.label} className="relative group">
                <Link
                  to={link.path}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md"
                >
                  {link.label}
                  {link.megaMenu && <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />}
                </Link>

                {link.megaMenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card rounded-xl shadow-elevated border p-6 min-w-[600px] grid grid-cols-2 gap-6">
                      {Object.entries(productMegaMenu).map(([title, items]) => (
                        <div key={title}>
                          <h4 className="font-display font-semibold text-sm text-primary mb-3 uppercase tracking-wider">{title}</h4>
                          <ul className="space-y-1.5">
                            {items.map(item => (
                              <li key={item}>
                                <Link
                                  to={`/products?category=${encodeURIComponent(item)}`}
                                  className="text-sm text-foreground/70 hover:text-primary hover:pl-1 transition-all block py-0.5"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="col-span-2 pt-3 border-t">
                        <Link to="/products" className="text-sm font-semibold text-primary hover:underline">
                          View All Products →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div ref={searchRef} className="relative">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <Search className="h-5 w-5 text-foreground/70" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card rounded-xl shadow-elevated border p-3 animate-fade-in-up z-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search products, remedies..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                      {searchResults.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { navigate(`/products/${p.id}`); setSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.category} · ₹{p.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery && searchResults.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No results found</p>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => setIsCartOpen(true)} className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <ShoppingCart className="h-5 w-5 text-foreground/70" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-full hover:bg-secondary transition-colors lg:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t pt-4 animate-fade-in-up">
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
