function Dashboard() {
  return (
   
      <div className="admin-wrapper">

        {/* ===== Top Section ===== */}
        <div className="dashboard-top">
          <div className="dashboard-header">
            <h3>Admin Control Panel</h3>
            <p>Monitor system performance and manage platform activity</p>
          </div>

          <div className="quick-summary">
            <div className="summary-box dark">
              <span>Active Users</span>
              <h4>124</h4>
            </div>
            <div className="summary-box green">
              <span>Revenue</span>
              <h4>₹24,500</h4>
            </div>
          </div>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="dashboard-cards">

          <div className="admin-card">
            <div className="card-top">
              <div className="card-icon blue">
                <i className="fa-solid fa-box"></i>
              </div>
              <span className="growth positive">+2 this week</span>
            </div>
            <h3>12</h3>
            <p>Total Products</p>
          </div>

          <div className="admin-card">
            <div className="card-top">
              <div className="card-icon purple">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <span className="growth positive">+1 new</span>
            </div>
            <h3>5</h3>
            <p>Total Categories</p>
          </div>

          <div className="admin-card">
            <div className="card-top">
              <div className="card-icon orange">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <span className="growth negative">-1 today</span>
            </div>
            <h3>8</h3>
            <p>Total Orders</p>
          </div>

        </div>

      
    </div>
  );
}

export default Dashboard;
