import { useEffect, useState } from "react";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const res = await userService.getMyProfile();
    setForm(res.data);
    setLoading(false);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [field]: value,
      },
    });
  };
  const languageOptions = ["English", "Hindi", "Gujarati"];

  const [docs, setDocs] = useState<any[]>([]);

  const handleSubmit = async () => {
    try {
      await userService.updateProfile(form);
      alert("Profile updated");
      navigate("/account/profile");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const isSpecialist = form.roles?.includes("specialist");

  const serviceOptions = ["Panchakarma", "Detox", "Skin Care", "Weight Loss"];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* BASIC */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Basic Info</h2>

        <input
          name="fullName"
          value={form.fullName || ""}
          onChange={handleChange}
          placeholder="Full Name"
          className="input"
        />

        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="input mt-2"
        />
      </div>

      {/* LOCATION */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Location</h2>

        <input
          value={form.location?.city || ""}
          onChange={(e) =>
            handleNestedChange("location", "city", e.target.value)
          }
          placeholder="City"
          className="input"
        />

        <input
          value={form.location?.state || ""}
          onChange={(e) =>
            handleNestedChange("location", "state", e.target.value)
          }
          placeholder="State"
          className="input mt-2"
        />
      </div>

      {/* SPECIALIST */}
      {isSpecialist && (
        <>
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Services</h2>

            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((service) => {
                const selected =
                  form.organizationDetails?.servicesOffered?.includes(service);

                return (
                  <button
                    key={service}
                    onClick={() => {
                      let updated =
                        form.organizationDetails?.servicesOffered || [];

                      if (selected) {
                        updated = updated.filter((s: string) => s !== service);
                      } else {
                        updated = [...updated, service];
                      }

                      handleNestedChange(
                        "organizationDetails",
                        "servicesOffered",
                        updated,
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selected ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Organization</h2>

            <select
              value={form.organizationDetails?.organizationType || ""}
              onChange={(e) =>
                handleNestedChange(
                  "organizationDetails",
                  "organizationType",
                  e.target.value,
                )
              }
              className="input mt-2"
            >
              <option value="">Select Type</option>
              <option value="clinic">Clinic</option>
              <option value="hospital">Hospital</option>
              <option value="academy">Academy</option>
            </select>
          </div>
        </>
      )}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Languages</h2>

        {languageOptions.map((lang) => {
          const selected = form.languagesSpoken?.includes(lang);

          return (
            <button
              key={lang}
              onClick={() => {
                let updated = form.languagesSpoken || [];

                if (selected) {
                  updated = updated.filter((l: string) => l !== lang);
                } else {
                  updated = [...updated, lang];
                }

                setForm({ ...form, languagesSpoken: updated });
              }}
              className={`px-3 py-1 m-1 rounded ${
                selected ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Upload Documents</h2>

        <input
          type="file"
          multiple
          onChange={(e: any) => {
            setDocs([...docs, ...e.target.files]);
          }}
        />

        {docs.map((file, i) => (
          <p key={i}>{file.name}</p>
        ))}
      </div>

      {/* EXTRA */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Extra Info</h2>

        <textarea
          value={form.bio || ""}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Bio"
          className="input"
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded-full"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
