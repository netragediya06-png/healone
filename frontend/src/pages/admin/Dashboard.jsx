    import React, { useEffect, useState } from "react";
    import API from "../../services/api";
    import { Pie, Bar, Line } from "react-chartjs-2";
    import { Package, ShoppingCart, Users, Leaf } from "lucide-react";

    import {
      Chart as ChartJS,
      ArcElement,
      BarElement,
      LineElement,
      CategoryScale,
      LinearScale,
      PointElement,
      Tooltip,
      Legend,
    } from "chart.js";

    ChartJS.register(
      ArcElement,
      BarElement,
      LineElement,
      CategoryScale,
      LinearScale,
      PointElement,
      Tooltip,
      Legend
    );

    function Dashboard() {

      const [data, setData] = useState(null);

      useEffect(() => {
        API.get("/dashboard/stats")
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => console.log(err));
      }, []);

      if (!data)
        return (
          <h2 className="p-6 text-lg font-semibold">
            Loading Dashboard...
          </h2>
        );

      const monthlyOrders = data.monthlyOrders || [];
      const remediesByCategory = data.remediesByCategory || [];

      const recentOrders = data.recentOrders || [];
      const recentUsers = data.recentUsers || [];

      // ===== PIE CHART =====

      const pieData = {
        labels: ["Products", "Orders", "Users", "Remedies"],
        datasets: [
          {
            data: [
              data.totalProducts || 0,
              data.totalOrders || 0,
              data.totalUsers || 0,
              data.totalRemedies || 0,
            ],
            backgroundColor: ["#6366f1", "#22c55e", "#0ea5e9", "#f59e0b"],
          },
        ],
      };

      // ===== ORDER STATUS =====

      const orderStatusData = {
        labels: ["Pending", "Completed", "Cancelled"],
        datasets: [
          {
            label: "Orders",
            data: [
              data.pendingOrders || 0,
              data.completedOrders || 0,
              data.cancelledOrders || 0,
            ],
            backgroundColor: ["#f59e0b", "#22c55e", "#ef4444"],
          },
        ],
      };

      // ===== MONTHLY ORDERS =====

      const monthlyData = {
        labels: monthlyOrders.map((m) => `Month ${m._id}`),
        datasets: [
          {
            label: "Monthly Orders",
            data: monthlyOrders.map((m) => m.count),
            borderColor: "#6366f1",
            tension: 0.4,
          },
        ],
      };

      // ===== REMEDIES CATEGORY =====

      const remediesData = {
        labels: remediesByCategory.map((r) => r._id),
        datasets: [
          {
            label: "Remedies",
            data: remediesByCategory.map((r) => r.count),
            backgroundColor: "#0ea5e9",
          },
        ],
      };

      // ===== REVENUE CHART (NEW) =====

      const revenueData = {
        labels: monthlyOrders.map((m) => `Month ${m._id}`),
        datasets: [
          {
            label: "Revenue",
            data: monthlyOrders.map((m) => m.count * 100),
            borderColor: "#10b981",
            tension: 0.4,
          },
        ],
      };

      return (

        <div className="p-6 space-y-10">

          {/* HEADER */}

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              HealOne Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Welcome back, Admin
            </p>
          </div>


          {/* ================= STAT CARDS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard
              title="Total Products"
              value={data.totalProducts}
              icon={<Package size={26} />}
              growth="+12%"
              color="bg-indigo-500"
            />

            <StatCard
              title="Total Orders"
              value={data.totalOrders}
              icon={<ShoppingCart size={26} />}
              growth="+8%"
              color="bg-green-500"
            />

            <StatCard
              title="Total Users"
              value={data.totalUsers}
              icon={<Users size={26} />}
              growth="+18%"
              color="bg-sky-500"
            />

            <StatCard
              title="Total Remedies"
              value={data.totalRemedies}
              icon={<Leaf size={26} />}
              growth="+6%"
              color="bg-amber-500"
            />

          </div>


          {/* ================= CHART ROW 1 ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <ChartCard title="Order Status">
              <Bar data={orderStatusData} />
            </ChartCard>

            <ChartCard title="Platform Distribution">
              <div className="flex justify-center">
                <div className="w-60">
                  <Pie data={pieData} />
                </div>
              </div>
            </ChartCard>

          </div>


          {/* ================= CHART ROW 2 ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <ChartCard title="Monthly Orders">
              <Line data={monthlyData} />
            </ChartCard>

            <ChartCard title="Remedies by Category">
              <Bar data={remediesData} />
            </ChartCard>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      <StatCard
        title="Revenue Today"
        value={`₹${data.todayRevenue || 0}`}
        icon={<ShoppingCart size={26}/>}
        growth="+4%"
        color="bg-green-500"
      />

      <StatCard
        title="Monthly Revenue"
        value={`₹${data.monthRevenue || 0}`}
        icon={<Package size={26}/>}
        growth="+9%"
        color="bg-indigo-500"
      />

      <StatCard
        title="Avg Order Value"
        value={`₹${data.avgOrder || 0}`}
        icon={<Users size={26}/>}
        growth="+2%"
        color="bg-blue-500"
      />

      <StatCard
        title="Conversion Rate"
        value={`${data.conversion || 0}%`}
        icon={<Leaf size={26}/>}
        growth="+1%"
        color="bg-purple-500"
      />

    </div>
          {/* ================= NEW REVENUE CHART ================= */}

          <ChartCard title="Revenue Overview">
            <Line data={revenueData} />
          </ChartCard>
          {/* ================= ANALYTICS WIDGETS ================= */}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* TOP SELLING PRODUCTS */}

      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="text-lg font-semibold mb-4">
          Top Selling Products
        </h3>

        <ul className="space-y-4">

          {(data.topProducts || []).slice(0,5).map((product,i)=>(
            <li key={i} className="flex justify-between items-center">

              <div>

                <p className="font-medium">
                  {product.title}
                </p>

                <p className="text-xs text-gray-500">
                  {product.sales} sales
                </p>

              </div>

              <span className="text-sm font-semibold text-indigo-600">
                ₹{product.revenue}
              </span>

            </li>
          ))}

        </ul>

      </div>


      {/* ACTIVITY TIMELINE */}

      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="text-lg font-semibold mb-4">
          Recent Activity
        </h3>

        <ul className="space-y-4">

          {(data.activities || []).slice(0,6).map((activity,i)=>(
            <li key={i} className="flex gap-3">

              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>

              <div>

                <p className="text-sm">
                  {activity.message}
                </p>

                <p className="text-xs text-gray-400">
                  {activity.time}
                </p>

              </div>

            </li>
          ))}

        </ul>

      </div>

    </div>

          {/* ================= TABLE SECTION ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* RECENT ORDERS */}

            <div className="bg-white rounded-xl shadow p-6">

              <h3 className="text-lg font-semibold mb-4">
                Recent Orders
              </h3>

              <table className="w-full text-sm">

                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">User</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>

                  {recentOrders.slice(0,5).map((order,i)=>(
                    <tr key={i} className="border-b">

                      <td className="py-2">
                        {order.userName}
                      </td>

                      <td>{order.status}</td>

                      <td>₹{order.amount}</td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>


            {/* LATEST USERS */}

            <div className="bg-white rounded-xl shadow p-6">

              <h3 className="text-lg font-semibold mb-4">
                Latest Users
              </h3>

              <ul className="space-y-3">

                {recentUsers.slice(0,5).map((user,i)=>(
                  <li
                    key={i}
                    className="flex justify-between border-b pb-2"
                  >

                    <span>{user.fullName}</span>

                    <span className="text-gray-500 text-sm">
                      {user.role}
                    </span>

                  </li>
                ))}

              </ul>

            </div>

          </div>

        </div>
      );
    }


    /* ================= STAT CARD ================= */

    function StatCard({ title, value, icon, growth, color }) {

      return (

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              {title}
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              {value}
            </h3>

            <p className="text-xs text-green-500 mt-1">
              {growth} this month
            </p>

          </div>

          <div className={`${color} p-3 rounded-lg text-white`}>
            {icon}
          </div>

        </div>

      );

    }


    /* ================= CHART CARD ================= */

    function ChartCard({ title, children }) {

      return (

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-sm font-medium text-gray-600 mb-4">
            {title}
          </h3>

          {children}

        </div>

      );

    }

    export default Dashboard;