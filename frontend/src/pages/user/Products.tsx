import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import productsHero from "@/assets/products-hero.jpg";
import productService from "@/services/productService";
import categoryService from "@/services/categoryService";
import subCategoryService from "@/services/subCategoryService";

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const [selectedHealth, setSelectedHealth] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchFilters();
    fetchWishlist();
  }, [category, subcategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let query = "";

      if (category) query += `?category=${category}`;
      if (subcategory)
        query += `${query ? "&" : "?"}subCategory=${subcategory}`;

      const res = await productService.getProducts(query);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchWishlist = async () => {
    try {
      const res = await productService.getWishlistProducts();
      setWishlistIds(res.data.map((p: any) => p._id));
    } catch (err) {
      console.error(err);
    }
  };
  const handleWishlist = async (id: string) => {
    try {
      await productService.toggleWishlistProduct(id);

      setWishlistIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } catch (err) {
      console.error(err);
    }
  };
  const fetchFilters = async () => {
    try {
      const catRes = await categoryService.getAllCategories();
      const subRes = await subCategoryService.getAllSubCategories();

      setCategories(catRes.data);
      setSubCategories(subRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SAFE FILTER
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedHealth) {
        const catName =
          typeof p.category === "object" ? p.category?.name : p.category;

        if (catName !== selectedHealth) return false;
      }
      return true;
    });
  }, [products, selectedHealth]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img
          src={productsHero}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />

        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 px-4 py-1.5 rounded-full text-sm mb-6">
              <Leaf className="h-4 w-4" /> 100% Natural & Ayurvedic
            </span>

            <h1 className="text-4xl font-bold text-white">
              Our <span className="text-primary">Products</span>
            </h1>

            <div className="flex gap-4 mt-6">
              <Link to="/remedies">
                <Button>Browse Remedies</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Filters */}
        <div className={`w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-card p-5 rounded-xl">
            <h3 className="font-semibold mb-4">Categories</h3>

            {categories.map((c: any) => (
              <button
                key={c._id}
                onClick={() => navigate(`/products?category=${c._id}`)}
                className="block w-full text-left py-2"
              >
                {c.name}
              </button>
            ))}

            <h3 className="font-semibold mt-6 mb-4">SubCategories</h3>

            {subCategories.map((s: any) => (
              <button
                key={s._id}
                onClick={() => navigate(`/products?subcategory=${s._id}`)}
                className="block w-full text-left py-2"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          <p>{filtered.length} products found</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onToggleWishlist={handleWishlist}
                wishlistIds={wishlistIds}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
