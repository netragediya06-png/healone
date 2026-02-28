import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/productService";
import "./HealOneProduct.css";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [healthCategory, setHealthCategory] = useState("");

  const fetchProducts = async () => {
    const res = await productService.getAdminProducts({
      search,
      healthCategory,
    });
    setProducts(res.data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggle = async (id) => {
    if (window.confirm("Change product status?")) {
      await productService.deleteProduct(id);
      fetchProducts();
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

          <select
            value={healthCategory}
            onChange={(e) => setHealthCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Stress">Stress</option>
            <option value="Immunity">Immunity</option>
            <option value="Digestion">Digestion</option>
            <option value="Skin">Skin</option>
            <option value="Hair">Hair</option>
          </select>

          <button onClick={fetchProducts}>Filter</button>

          <Link to="/admin/products/add" className="add-btn">
            + Add
          </Link>
        </div>
      </div>

      {/* GRID */}
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>

            <div className="product-image">
              <img src={p.image} alt={p.name} />
            </div>

            <div className="product-content">
              <h6>{p.name}</h6>
              <small>{p.healthCategory}</small>

              <div className="price-stock">
                <span className="price">₹ {p.price}</span>
                <span className="stock">Stock: {p.stock}</span>
              </div>

              <div className="badges">
                <span className={`status ${p.status}`}>
                  {p.status}
                </span>

                {p.stock === 0 && (
                  <span className="warning">Out of Stock</span>
                )}

                {p.stock > 0 && p.stock < 5 && (
                  <span className="warning">Low Stock</span>
                )}
              </div>

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
                  {p.status === "active" ? "Deactivate" : "Activate"}
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
