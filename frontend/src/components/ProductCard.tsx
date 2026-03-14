import { useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/lib/products-data';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [saved, setSaved] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist!');
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">{product.badge}</span>
          )}
          <button onClick={handleToggleSave} className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all ${saved ? 'bg-destructive text-destructive-foreground' : 'bg-background/80 text-foreground/60 hover:bg-background hover:text-destructive'}`}>
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          {discount > 0 && (
            <span className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>

          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-border'}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-primary">₹{product.price}</span>
              <span className="text-sm text-muted-foreground line-through ml-1.5">₹{product.originalPrice}</span>
            </div>
            <Button size="sm" onClick={handleAddToCart} className="h-9 gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
