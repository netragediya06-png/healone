import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as cartService from "@/services/cartService";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import logo from "@/assets/logo.png";
import categoryService from "@/services/categoryService";
import subCategoryService from "@/services/subCategoryService";
import productService from "@/services/productService";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const activeRole = localStorage.getItem("activeRole");

  const { totalItems, setIsCartOpen, setItems } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // ✅ LOAD USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, []);
  useEffect(() => {
  const updateUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  window.addEventListener("userUpdated", updateUser);

  return () => {
    window.removeEventListener("userUpdated", updateUser);
  };
}, []);
  useEffect(() => {
  const handler = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  window.addEventListener("storage", handler);

  return () => window.removeEventListener("storage", handler);
}, []);

  const fetchMenuData = async () => {
    try {
      const catRes = await categoryService.getAllCategories();
      const subRes = await subCategoryService.getAllSubCategories();

      setCategories(catRes.data);
      setSubCategories(subRes.data);
    } catch (error) {
      console.error("Menu Fetch Error:", error);
    }
  };

  const loadCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await cartService.getCart();

      const formatted = res.data.items.map((item: any) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
        category: item.product.category?.name || "",
      }));

      setItems(formatted);
    } catch (err) {
      console.log("Cart load error", err);
    }
  };

  // ✅ REMOVE DUPLICATE SUBCATEGORIES (🔥 MAIN LOGIC)
  const uniqueSubCategories = useMemo(() => {
    const map = new Map();

    subCategories.forEach((item: any) => {
      const name = item.name.toLowerCase().trim();

      if (!map.has(name)) {
        map.set(name, item);
      }
    });

    return Array.from(map.values());
  }, [subCategories]);

  // CLOSE DROPDOWN
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // SEARCH
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      fetchSearchResults();
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      setSearchLoading(true);
      const res = await productService.getProducts(`?search=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogout = () => {
  localStorage.clear(); // ✅ removes EVERYTHING (roles, activeRole, etc)

  setUser(null);

  navigate("/");
  window.location.reload(); // ensures navbar refresh
};
  const handleSwitchRole = () => {
    if (roles.length < 2) return;

    const newRole = activeRole === "specialist" ? "user" : "specialist";

    localStorage.setItem("activeRole", newRole);

    // 🔁 redirect
    if (newRole === "specialist") {
      navigate("/specialist");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products", megaMenu: true },
    { label: "Remedies", path: "/remedies" },
    { label: "Yoga", path: "/yoga" },
    { label: "Programs", path: "/programs" },
    { label: "Specialists", path: "/specialists" },
    { label: "Dosha Quiz", path: "/dosha-quiz" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="HealOne" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-primary">
              HealOne
            </span>
          </Link>

          {/* NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  to={link.path}
                  className="flex items-center gap-1 px-3 py-2 text-sm"
                >
                  {link.label}
                  {link.megaMenu && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>

                {link.megaMenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card rounded-xl shadow-elevated border p-4 min-w-[500px] grid grid-cols-2 gap-4">
                      {/* SUBCATEGORY */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">
                          By Product Type
                        </h4>

                        <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-2">
                          {uniqueSubCategories.map((item: any) => (
                            <li key={item._id}>
                              <Link
                                to={`/products?subcategoryName=${item.name}`}
                                className="text-sm hover:text-primary"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CATEGORY */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">
                          By Health Concern
                        </h4>

                        <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-2">
                          {categories.map((item: any) => (
                            <li key={item._id}>
                              <Link
                                to={`/products?category=${item._id}`}
                                className="text-sm hover:text-primary"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="col-span-2 pt-3 border-t">
                        <Link
                          to="/products"
                          className="text-sm font-semibold text-primary"
                        >
                          View All Products →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT SIDE (UNCHANGED) */}
          {/* ... your existing code remains same ... */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <Search className="h-5 w-5 text-foreground/70" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card rounded-xl shadow-elevated border p-3 animate-fade-in-up z-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, remedies..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  </div>

                  {searchLoading && (
                    <p className="text-sm text-center py-3 text-muted-foreground">
                      Searching...
                    </p>
                  )}

                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                      {searchResults.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => {
                            navigate(`/products/${p._id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <img
                            src={p.image}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.category?.name} · ₹{p.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery &&
                    searchResults.length === 0 &&
                    !searchLoading && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No results found
                      </p>
                    )}
                </div>
              )}
            </div>
            {/* CART */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-secondary transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5 text-foreground/70" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA */}
            {/* ROLE BASED BUTTON */}

            {roles.includes("specialist") ? (
              activeRole === "user" && (
                <button
                  onClick={() => {
                    localStorage.setItem("activeRole", "specialist");
                    navigate("/specialist");
                    window.location.reload();
                  }}
                  className="px-4 py-1.5 rounded-full border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition"
                >
                  Switch to Specialist
                </button>
              )
            ) : (
              <Link
                to="/become-specialist"
                className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
              >
                Join Specialist
              </Link>
            )}
            <div className="h-5 w-px bg-border"></div>

            {/* PROFILE */}
            {/* PROFILE */}
            {user ? (
              <div className="flex items-center gap-3">

                {/* 🏷 ROLE BADGE */}
                <span className="text-[10px] uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold tracking-wide">
                  {activeRole}
                </span>

                {/* PROFILE DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={user.profilePhoto || "/default-avatar.png"}
                      className="w-9 h-9 rounded-full border object-cover"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-xl overflow-hidden">
                      <Link
                        to="/account/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 text-sm"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <div className="border-t my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-red-600 hover:bg-red-50 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex gap-3">
                <Link to="/login">Sign In</Link>
                <Link to="/register">Sign Up</Link>
              </div>
            )}

            {/* MOBILE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {/* MOBILE NAV */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t pt-4">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.path}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
