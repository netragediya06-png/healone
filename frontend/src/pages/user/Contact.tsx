import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "admin",
    specialistId: "" // ✅ field for specialist feedback
  });

  const [specialists, setSpecialists] = useState([]);

  // Fetch all specialists from backend
  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/specialists");
        setSpecialists(res.data);
      } catch (err) {
        console.error("Error fetching specialists:", err);
      }
    };

    fetchSpecialists();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.type === "specialist" && !form.specialistId) {
      return alert("Please select a specialist before sending feedback.");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/feedback/add",
        form
      );

      console.log(res.data);
      alert("Feedback saved successfully ✅");

      // Reset form
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "admin",
        specialistId: ""
      });
    } catch (err) {
      console.error(err);
      alert("Error sending feedback ❌");
    }
  };

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
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                className="px-4 py-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                className="px-4 py-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              className="w-full px-4 py-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            <textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              className="w-full px-4 py-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            {/* TYPE SELECT */}
            <select
              value={form.type}
              className="w-full px-4 py-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="admin">Send to Admin</option>
              <option value="specialist">Send to Specialist</option>
            </select>

            {/* SHOW SPECIALIST DROPDOWN ONLY IF TYPE IS specialist */}
            {form.type === "specialist" && (
              <select
                value={form.specialistId}
                onChange={(e) =>
                  setForm({ ...form, specialistId: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">Select Specialist</option>
                {specialists.map((sp) => (
                  <option key={sp._id} value={sp._id}>
                    {sp.fullname}
                  </option>
                ))}
              </select>
            )}

            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </form>

          {/* CONTACT INFO */}
          <div className="space-y-6">
            {[ 
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: Mail, label: "Email", value: "hello@healone.com" },
              { icon: MapPin, label: "Address", value: "India" }
            ].map((item) => (
              <div key={item.label} className="flex gap-4 border p-4 rounded-xl">
                <item.icon />
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.value}</p>
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