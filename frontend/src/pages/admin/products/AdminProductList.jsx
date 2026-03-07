import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/productService";
import "./HealOneProduct.css";

function AdminProductList() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = async () => {

    try {

      const res = await productService.getAdminProducts({
        search
      });

      setProducts(res.data.products);

    } catch (error) {

      console.error("Fetch products error:", error);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);
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

    <div className="admin-products-container">

      {/* TOP BAR */}
      <div className="top-bar">

        <div className="left">

          <h4>Products</h4>

          <span>{products.length} products</span>

        </div>

        <div className="right">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={fetchProducts}>
            Filter
          </button>

          <Link
            to="/admin/products/add"
            className="add-btn"
          >
            + Add
          </Link>

        </div>

      </div>


      {/* GRID */}
      <div className="product-grid">

        {products.map((p) => (

          <div
            className="product-card"
            key={p._id}
          >

            {/* IMAGE */}
            <div className="product-image">

              {p.image ? (

                <img
                  src={p.image}
                  alt={p.name}
                />

              ) : (

                <div className="no-image">
                  No Image
                </div>

              )}

            </div>


            {/* CONTENT */}
            <div className="product-content">

              <h6>{p.name}</h6>

              <small>
                {p.category?.name} / {p.subCategory?.name}
              </small>


              <div className="price-stock">

                <span className="price">
                  ₹ {p.price}
                </span>

                <span className="stock">
                  Stock: {p.stock}
                </span>

              </div>


              {/* BADGES */}
              <div className="badges">

                <span className={`status ${p.status}`}>
                  {p.status}
                </span>

                {p.stock === 0 && (
                  <span className="warning">
                    Out of Stock
                  </span>
                )}

                {p.stock > 0 && p.stock < 5 && (
                  <span className="warning">
                    Low Stock
                  </span>
                )}

              </div>


              {/* ACTIONS */}
              <div className="actions">

  <Link
    to={`/admin/products/edit/${p._id}`}
    className="edit"
  >
    Edit
  </Link>

  <button
    className="toggle"
    onClick={() => handleToggle(p._id)}
  >
    {p.status === "active"
      ? "Deactivate"
      : "Activate"}
  </button>

  <button
    className="delete"
    onClick={() => handleDelete(p._id)}
  >
    Delete
  </button>

</div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default AdminProductList;