import { useState } from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import * as cartService from "@/services/cartService";
import { useCart } from "@/lib/cart-context"; // ✅ IMPORTANT

type ProductType = {
  stock: number;
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category?: {
    name: string;
  };
  rating?: number;
  reviews?: number;
  badge?: string;
};

const ProductCard = ({ product }: { product: ProductType }) => {
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  const { setItems } = useCart(); // ✅ IMPORTANT

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  // ✅ ADD TO CART (BACKEND + NAVBAR SYNC)
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (added) return; // 🚫 prevent multiple clicks

    try {
      const res = await cartService.addToCart(product._id);

      // 🔥 SYNC WITH NAVBAR (VERY IMPORTANT)
      const formatted = res.data.items.map((item: any) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
        category: item.product.category?.name || "",
      }));

      setItems(formatted); // ✅ updates cart icon

      setAdded(true); // lock button

      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add");
    }
  };

  // ❤️ Wishlist
  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist!");
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
        {/* IMAGE */}
        <div className="relative aspect-[1/1] overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {product.badge && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}

          <button
            onClick={handleToggleSave}
            className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
              saved
                ? "bg-red-500 text-white"
                : "bg-background/80 text-foreground/60 hover:bg-background hover:text-destructive"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${saved ? "fill-red-500 text-white" : ""}`}
            />
          </button>

          {discount > 0 && (
            <span className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {product.category?.name}
          </p>

          <h3 className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating || 0)
                      ? "fill-accent text-accent"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews || 0})
            </span>
          </div>

          {/* PRICE + BUTTON */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-primary">
                ₹{product.price}
              </span>
              <span className="text-sm text-muted-foreground line-through ml-1.5">
                ₹{product.originalPrice}
              </span>
            </div>

            {Number(product.stock) === 0 ? (
              <Button disabled className="h-9 bg-gray-400 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={added}
                className="h-9 gap-1.5"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {added ? "Added" : "Add"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
