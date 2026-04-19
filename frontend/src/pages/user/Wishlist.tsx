import { useEffect, useState } from "react";
import productService from "@/services/productService";
import { getWishlistYoga } from "@/services/yogaService";
import { getWishlistRemedies } from "@/services/remedyService";
import { Heart } from "lucide-react";
import { toggleWishlistYoga } from "@/services/yogaService";
import { toggleWishlistRemedy } from "@/services/remedyService";

const Wishlist = () => {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState<any[]>([]);
  const [yoga, setYoga] = useState<any[]>([]);
  const [remedies, setRemedies] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);
  const handleRemove = async (id: string) => {
    try {
      if (activeTab === "products") {
        await productService.toggleWishlistProduct(id);
        setProducts((prev) => prev.filter((item) => item._id !== id));
      }

      if (activeTab === "yoga") {
        await toggleWishlistYoga(id);
        setYoga((prev) => prev.filter((item) => item._id !== id));
      }

      if (activeTab === "remedies") {
        await toggleWishlistRemedy(id);
        setRemedies((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAll = async () => {
    try {
      const [p, y, r] = await Promise.all([
        productService.getWishlistProducts(),
        getWishlistYoga(),
        getWishlistRemedies(),
      ]);

      setProducts(p.data);
      setYoga(y);
      setRemedies(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItems = () => {
    let data: any[] = [];

    if (activeTab === "products") data = products;
    if (activeTab === "yoga") data = yoga;
    if (activeTab === "remedies") data = remedies;

    if (data.length === 0) {
      return <p className="text-center text-gray-500 mt-10">No items</p>;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow p-3 relative"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              className="w-full h-40 object-cover rounded-lg"
            />

            {/* ❤️ REMOVE BUTTON */}
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(item._id);
              }}
            >
              <Heart className="text-red-500 fill-red-500" size={18} />
            </button>

            {/* TITLE */}
            <p className="mt-2 font-medium text-sm">
              {item.title || item.name}
            </p>

            {/* PRICE (only product) */}
            {item.price && (
              <p className="text-primary font-semibold">₹{item.price}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">❤️ My Wishlist</h1>

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        {["products", "yoga", "remedies"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-3 py-1 ${
              activeTab === tab
                ? "border-b-2 border-black font-medium"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {renderItems()}
    </div>
  );
};

export default Wishlist;
