import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, ShoppingCart, ArrowLeft, CheckCircle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';
import productService from '@/services/productService';
import { useNavigate } from 'react-router-dom';
const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await productService.getSingleProduct(id);
        const prod = res.data.product;
        setProduct(prod);

        const all = await productService.getProducts();

        const rel = all.data.filter((p: any) =>
          p._id !== id &&
          (
            p.category?._id === prod.category?._id ||
            p.subCategory?._id === prod.subCategory?._id
          )
        ).slice(0, 4);

        setRelated(rel);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleAddToCart = () => {
     addToCart({
    id: product._id,   // ✅ mapping here
    name: product.name,
    price: product.price,
    image: product.image,
    category:
      typeof product.category === "object"
        ? product.category?.name
        : product.category
  });

    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
  addToCart({
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    category:
      typeof product.category === "object"
        ? product.category?.name
        : product.category
  });

  navigate('/checkout'); // 🚀 redirect
};

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!product) return <div>Product Not Found</div>;

  return (
  <div className="container mx-auto px-4 py-10">
    
    {/* Back */}
    <Link to="/products" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black">
      <ArrowLeft size={18}/> Back
    </Link>

    <div className="grid lg:grid-cols-2 gap-12">
      
      {/* LEFT - IMAGE */}
      <div>
        <div className="bg-gray-100 rounded-2xl p-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-contain"
          />
        </div>

        {/* thumbnails (optional) */}
        <div className="flex gap-2 mt-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* RIGHT - DETAILS */}
      <div>

        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <Star className="text-green-600 fill-green-600 w-4 h-4"/>
          <span className="text-sm text-gray-600">4.9 (8908 reviews)</span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-3xl font-bold text-green-700">₹{product.price}</span>
          <span className="line-through text-gray-400">₹{product.price + 200}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
          <span className="flex items-center gap-1"><Leaf size={14}/> Natural</span>
          <span className="flex items-center gap-1"><CheckCircle size={14}/> Ayurvedic</span>
        </div>

        {/* Benefits */}
        {product.benefits && (
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {product.benefits.map((b: any) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle className="text-green-600 w-4 h-4"/>
                {b}
              </div>
            ))}
          </div>
        )}

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm">Quantity</span>
          <div className="flex border rounded-lg overflow-hidden">
            <button className="px-3">-</button>
            <span className="px-4">1</span>
            <button className="px-3">+</button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2"/> Add to Cart
          </Button>

          <Button
  className="flex-1 bg-green-700 hover:bg-green-800 text-white"
  onClick={handleBuyNow}
>
  Buy Now
</Button>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-2">Product Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>

      </div>
    </div>

    {/* RELATED */}
    {related.length > 0 && (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    )}

  </div>
);
};

export default ProductDetail;