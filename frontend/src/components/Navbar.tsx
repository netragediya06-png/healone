import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState<any>(null); // ✅ NEW
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // ✅ LOAD USER FROM STORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
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

  // ✅ CLOSE DROPDOWN CLICK OUTSIDE
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
    }, 400); // debounce

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

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    window.location.reload();
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
    { label: "Blog", path: "/blog" },
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

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  to={link.path}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md"
                >
                  {link.label}
                  {link.megaMenu && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {link.megaMenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card rounded-xl shadow-elevated border p-4 min-w-[500px] grid grid-cols-2 gap-4">
                      {/* LEFT → SUBCATEGORIES */}
                      <div>
                        <h4 className="font-display font-semibold text-sm text-primary mb-3 uppercase tracking-wider">
                          By Product Type
                        </h4>

                        <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-2">
                          {subCategories.map((item: any) => (
                            <li key={item._id}>
                              <Link
                                to={`/products?subcategory=${item._id}`}
                                className="text-sm text-foreground/70 hover:text-primary hover:pl-1 transition-all block py-0.5"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* RIGHT → CATEGORIES */}
                      <div>
                        <h4 className="font-display font-semibold text-sm text-primary mb-3 uppercase tracking-wider">
                          By Health Concern
                        </h4>

                        <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-2">
                          {categories.map((item: any) => (
                            <li key={item._id}>
                              <Link
                                to={`/products?category=${item._id}`}
                                className="text-sm text-foreground/70 hover:text-primary hover:pl-1 transition-all block py-0.5"
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
                          className="text-sm font-semibold text-primary hover:underline"
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

          {/* RIGHT SIDE */}
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
            <Link
              to="/specialist/signup"
              className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              Join Specialist
            </Link>
            <div className="h-5 w-px bg-border"></div>

            {/* PROFILE */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={user.profilePhoto}
                    className="w-9 h-9 rounded-full border"
                  />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
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
