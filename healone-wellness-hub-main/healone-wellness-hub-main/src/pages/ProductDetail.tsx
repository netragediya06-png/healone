import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, CheckCircle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { products } from '@/lib/products-data';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold">Product Not Found</h2>
          <Link to="/products"><Button className="mt-4">Back to Products</Button></Link>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.id !== product.id && (p.category === product.category || p.healthCategory === product.healthCategory)).slice(0, 4);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-secondary rounded-2xl overflow-hidden aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.badge && <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">{product.badge}</span>}
              <span className="text-sm text-muted-foreground">{product.category}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">{product.name}</h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mt-5">
              <span className="text-4xl font-display font-bold text-primary">₹{product.price}</span>
              <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="bg-accent/20 text-accent-foreground text-sm font-bold px-2 py-0.5 rounded">Save {discount}%</span>
            </div>

            <p className="text-foreground/80 mt-5 leading-relaxed">{product.description}</p>

            <Button size="lg" className="gap-2 mt-8 w-full sm:w-auto px-12" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </Button>

            {/* Benefits */}
            <div className="mt-8 p-5 bg-secondary rounded-xl">
              <h3 className="font-display font-semibold flex items-center gap-2"><Leaf className="h-5 w-5 text-primary" /> Key Benefits</h3>
              <ul className="mt-3 space-y-2">
                {product.benefits.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary shrink-0" />{b}</li>
                ))}
              </ul>
            </div>

            {/* Ingredients */}
            <div className="mt-5">
              <h3 className="font-display font-semibold mb-2">Ingredients</h3>
              <p className="text-sm text-muted-foreground">{product.ingredients.join(', ')}</p>
            </div>

            {/* Usage */}
            <div className="mt-5">
              <h3 className="font-display font-semibold mb-2">How to Use</h3>
              <p className="text-sm text-muted-foreground">{product.usage}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
