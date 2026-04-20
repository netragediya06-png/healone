import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type Specialist = {
  _id: string;
  fullName: string;
};

type User = {
  fullName: string;
  email: string;
};

/* ================= COMPONENT ================= */

const Contact = () => {
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    subject: "",
    message: "",
    type: "admin",
    specialistId: "",
  });

  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<User>(
          "http://localhost:5000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setUser(res.data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  /* ================= FETCH SPECIALISTS ================= */

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await axios.get<Specialist[]>(
          "http://localhost:5000/api/specialists",
        );
        setSpecialists(res.data);
      } catch (err) {
        console.error("Error fetching specialists:", err);
      }
    };

    fetchSpecialists();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.type === "specialist" && !form.specialistId) {
      return alert("Please select a specialist");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/feedback/add",
        {
          subject: form.subject, // ✅ ADD THIS
          message: form.message, // ✅ CLEAN MESSAGE
          targetType: form.type,
          specialistId: form.specialistId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Feedback sent successfully ✅");

      setForm({
        subject: "",
        message: "",
        type: "admin",
        specialistId: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error sending feedback ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="bg-nature py-16 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-display font-bold mb-6">Get in Touch</h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* AUTO FILLED USER */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={user?.fullName || ""}
                disabled
                className="px-4 py-3 border rounded-lg bg-gray-100"
              />

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="px-4 py-3 border rounded-lg bg-gray-100"
              />
            </div>

            {/* SUBJECT */}
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              className="w-full px-4 py-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            {/* MESSAGE */}
            <textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              className="w-full px-4 py-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            {/* TYPE */}
            <select
              value={form.type}
              className="w-full px-4 py-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="admin">Send to Admin</option>
              <option value="specialist">Send to Specialist</option>
            </select>

            {/* SPECIALIST */}
            {form.type === "specialist" && (
              <select
                value={form.specialistId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    specialistId: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">Select Specialist</option>
                {specialists.map((sp) => (
                  <option key={sp._id} value={sp._id}>
                    {sp.fullName}
                  </option>
                ))}
              </select>
            )}

            {/* BUTTON */}
            <Button type="submit" disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {/* CONTACT INFO */}
          <div className="space-y-6">
            {[
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: Mail, label: "Email", value: "hello@healone.com" },
              { icon: MapPin, label: "Address", value: "India" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-4 border p-4 rounded-xl"
              >
                <item.icon />
                <div>
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
