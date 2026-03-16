import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/productService";

function AdminProductList() {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page] = useState(1);

  const limit = 8;

  // ============================
  // FETCH PRODUCTS
  // ============================
  const fetchProducts = async () => {

    try {

      const res = await productService.getAdminProducts({
        search,
        page,
        limit
      });

      const data = res.data.products;

      setProducts(data);

    } catch (error) {

      console.error(error);

    }

  };

  // ============================
  // SEARCH + FILTER
  // ============================
  useEffect(() => {

    fetchProducts();

  }, [search, page]);

  useEffect(() => {

    let data = [...products];

    if (statusFilter !== "All") {
      data = data.filter((p) => p.status === statusFilter);
    }

    setFilteredProducts(data);

  }, [products, statusFilter]);

  // ============================
  // TOGGLE STATUS
  // ============================
  const handleToggle = async (id) => {

    await productService.toggleProductStatus(id);

    fetchProducts();

  };

  // ============================
  // DELETE PRODUCT
  // ============================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    await productService.deleteProduct(id);

    fetchProducts();

  };

  // ============================
  // STATS
  // ============================
  const stats = {

    total: products.length,

    active: products.filter((p) => p.status === "active").length,

    inactive: products.filter((p) => p.status === "inactive").length

  };

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          Product Management
        </h2>

        <p className="text-sm text-gray-500">
          Manage your store products
        </p>

      </div>


      {/* TOP STATS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {[
          { label: "Total Products", value: stats.total, key: "All", color: "bg-gray-100" },
          { label: "Active", value: stats.active, key: "active", color: "bg-green-100" },
          { label: "Inactive", value: stats.inactive, key: "inactive", color: "bg-red-100" }
        ].map((card) => (

          <div
            key={card.key}
            onClick={() => setStatusFilter(card.key)}
            className={`p-4 rounded-lg cursor-pointer text-center
            ${card.color}
            ${statusFilter === card.key ? "ring-2 ring-green-500" : ""}
            `}
          >

            <h4 className="text-xl font-bold">
              {card.value}
            </h4>

            <span className="text-sm text-gray-600">
              {card.label}
            </span>

          </div>

        ))}

      </div>


      {/* SEARCH + ADD */}

      <div className="flex flex-col md:flex-row md:justify-between gap-4">

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-2/3 focus:ring-2 focus:ring-green-500"
        />

        <Link
          to="/admin/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-center"
        >
          + Add Product
        </Link>

      </div>


      {/* PRODUCT GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredProducts.map((p) => (

          <div
            key={p._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl
            hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
          >

            {/* IMAGE */}

            <div className="bg-gray-50 flex items-center justify-center h-40">

              {p.image ? (

                <img
                  src={p.image}
                  alt={p.name}
                  className="h-32 object-contain hover:scale-110 transition"
                />

              ) : (

                <span className="text-gray-400 text-sm">
                  No Image
                </span>

              )}

            </div>


            {/* CONTENT */}

            <div className="p-4 flex flex-col justify-between flex-grow">

              <div>

                <h3 className="font-semibold text-gray-800 text-sm">
                  {p.name}
                </h3>

                <p className="text-xs text-gray-500 mb-3">
                  {p.category?.name} / {p.subCategory?.name}
                </p>

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-green-600 font-semibold">
                    ₹ {p.price}
                  </span>

                  <span className="text-gray-500">
                    Stock: {p.stock}
                  </span>

                </div>

                <span className={`text-xs px-2 py-1 rounded-full
                  ${p.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"}
                `}>
                  {p.status}
                </span>

              </div>


              {/* BUTTONS */}

              <div className="flex items-center justify-between mt-3">

                <Link
                  to={`/admin/products/edit/${p._id}`}
                  className="px-3 py-1 text-xs rounded-md bg-slate-600 text-white hover:bg-slate-700"
                >
                  Edit
                </Link>


                {/* TOGGLE */}

                <label className="relative inline-flex items-center cursor-pointer">

                  <input
                    type="checkbox"
                    checked={p.status === "active"}
                    onChange={() => handleToggle(p._id)}
                    className="sr-only peer"
                  />

                  <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:rounded-full after:h-4 after:w-4
                  after:transition-all peer-checked:after:translate-x-full"></div>

                </label>


                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* PAGINATION */}

      {/* <div className="flex justify-center gap-4 mt-8">

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

      </div> */}

    </div>

  );

}

export default AdminProductList;