import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/productService";

function AdminProductList() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 8;

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = async () => {

    try {

      const res = await productService.getAdminProducts({
        search,
        page,
        limit
      });

      setProducts(res.data.products);

    } catch (error) {

      console.error("Fetch products error:", error);

    }

  };

  // ===============================
  // AUTO SEARCH
  // ===============================
  useEffect(() => {

    const delay = setTimeout(() => {

      fetchProducts();

    }, 400);

    return () => clearTimeout(delay);

  }, [search, page]);

  // ===============================
  // TOGGLE STATUS
  // ===============================
  const handleToggle = async (id) => {

    try {

      await productService.toggleProductStatus(id);

      fetchProducts();

    } catch (error) {

      console.error("Toggle error:", error);

    }

  };

  // ===============================
  // DELETE PRODUCT
  // ===============================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      await productService.deleteProduct(id);

      fetchProducts();

    } catch (error) {

      console.error("Delete error:", error);

    }

  };

  return (

    <div className="p-6">

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Products
          </h2>

          <p className="text-sm text-gray-500">
            {products.length} products
          </p>
        </div>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <Link
            to="/admin/products/add"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Add Product
          </Link>

        </div>

      </div>


      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((p) => (

          <div
            key={p._id}
            className={`bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col
            ${p.stock > 0 && p.stock < 5 ? "border border-red-200" : ""}
            `}
          >

            {/* IMAGE */}
            <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100 mb-3">

              {p.image ? (

                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />

              ) : (

                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>

              )}

            </div>


            {/* PRODUCT INFO */}
            <div className="flex-1">

              <h3 className="font-semibold text-gray-800">
                {p.name}
              </h3>

              <p className="text-xs text-gray-500 mb-2">
                {p.category?.name} / {p.subCategory?.name}
              </p>


              {/* PRICE + STOCK */}
              <div className="flex justify-between text-sm mb-2">

                <span className="font-semibold text-green-600">
                  ₹ {p.price}
                </span>

                <span className="text-gray-500">
                  Stock: {p.stock}
                </span>

              </div>


              {/* BADGES */}
              <div className="flex gap-2 mb-3">

                <span className={`px-2 py-0.5 text-xs rounded-full
                  ${p.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"}
                `}>
                  {p.status}
                </span>

                {p.stock === 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
                    Out of Stock
                  </span>
                )}

                {p.stock > 0 && p.stock < 5 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Low Stock
                  </span>
                )}

              </div>


              {/* ACTIONS */}
              <div className="flex items-center justify-between">

                <Link
                  to={`/admin/products/edit/${p._id}`}
                  className="text-xs border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50"
                >
                  Edit
                </Link>

                {/* STATUS SWITCH */}
                <label className="relative inline-flex items-center cursor-pointer">

                  <input
                    type="checkbox"
                    checked={p.status === "active"}
                    onChange={() => handleToggle(p._id)}
                    className="sr-only peer"
                  />

                  <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:border after:rounded-full after:h-4 after:w-4
                  after:transition-all peer-checked:after:translate-x-full"></div>

                </label>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-xs border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-50"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* PAGINATION */}
      <div className="flex justify-center mt-8 gap-4">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="px-4 py-2 text-sm">
          Page {page}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </button>

      </div>

    </div>

  );

}

export default AdminProductList;