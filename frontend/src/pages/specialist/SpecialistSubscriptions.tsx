import { useEffect, useState } from "react";
import { getSpecialistSubscriptions } from "../../services/subscriptionService";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const SpecialistSubscriptions = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await getSpecialistSubscriptions();
      setSubs(res.data.subscriptions);
      setFiltered(res.data.subscriptions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH FILTER
  useEffect(() => {
    const result = subs.filter((s) =>
      s.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.program?.title?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, subs]);

  // 💰 CALCULATIONS
  const totalRevenue = subs.reduce(
    (sum, s) => sum + (s.amountPaid || 0),
    0
  );

  const activeCount = subs.filter(s => s.status === "active").length;
  const expiredCount = subs.filter(s => s.status === "expired").length;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-gray-500 text-sm">
          Manage users enrolled in your wellness programs
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-xl font-bold">{subs.length}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-xl font-bold text-green-600">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Active</p>
          <h2 className="text-xl font-bold text-green-600">
            {activeCount}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Expired</p>
          <h2 className="text-xl font-bold text-red-500">
            {expiredCount}
          </h2>
        </div>

      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by user or program..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Program</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Dates</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No subscriptions found
                </td>
              </tr>
            )}

            {filtered.map((s, i) => (
              <motion.tr
                key={s._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b hover:bg-gray-50"
              >
                {/* USER */}
                <td className="p-3">
                  <p className="font-medium">
                    {s.user?.fullName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.user?.email}
                  </p>
                </td>

                {/* PROGRAM */}
                <td className="p-3">
                  {s.program?.title}
                </td>

                {/* PLAN */}
                <td className="p-3">
                  {s.plan?.name}
                </td>

                {/* AMOUNT */}
                <td className="p-3 font-semibold text-green-600">
                  ₹{s.amountPaid}
                </td>

                {/* PAYMENT */}
                <td className="p-3">
                  <Badge variant="secondary">
                    {s.paymentMethod}
                  </Badge>
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      s.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                {/* DATES */}
                <td className="p-3 text-xs">
                  <p>
                    {new Date(s.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400">
                    {new Date(s.endDate).toLocaleDateString()}
                  </p>
                </td>
              </motion.tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default SpecialistSubscriptions;