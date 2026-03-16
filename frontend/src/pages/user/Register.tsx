import { useState } from "react";
import { Camera } from "lucide-react";
import { registerUser } from "@/services/authService";

export default function Register() {

  const [step,setStep] = useState(1);
  const [preview,setPreview] = useState("");
  const [file,setFile] = useState<File | null>(null);

  const [form,setForm] = useState({
    fullName:"",
    email:"",
    password:"",
    phone:"",
    gender:"",
    dateOfBirth:"",
    state:"",
    city:"",
    area:""
  });

  const handleChange = (e:any)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleImage = (e:any)=>{
    const img = e.target.files[0];
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const nextStep = ()=> setStep(step+1);
  const prevStep = ()=> setStep(step-1);

const handleSubmit = async (e:any)=>{
  e.preventDefault();

  try{

    const data = new FormData();

    Object.entries(form).forEach(([k,v])=>{
      data.append(k,v as string);
    });

    if(file) data.append("profilePhoto",file);

    const res = await registerUser(data);

    alert(res.data.message);

    setStep(1);

    setForm({
      fullName:"",
      email:"",
      password:"",
      phone:"",
      gender:"",
      dateOfBirth:"",
      state:"",
      city:"",
      area:""
    });

  }catch(error:any){

    alert(error.response?.data?.message || "Registration failed");

  }

};      

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6 py-12">

      <div className="max-w-4xl w-full">

        {/* HEADING */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Join HealOne
          </h1>
          <p className="text-gray-500 mt-2">
            Start your personalized wellness journey today
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl rounded-3xl p-10">

          {/* STEP INDICATOR */}
          <div className="flex items-center justify-between mb-10">

            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${step>=1 ? "bg-green-600 text-white" : "bg-gray-200"}`}>1</div>
              <span className="text-sm font-medium">Basic Info</span>
            </div>

            <div className="flex-1 h-[2px] bg-gray-200 mx-4"></div>

            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${step>=2 ? "bg-green-600 text-white" : "bg-gray-200"}`}>2</div>
              <span className="text-sm font-medium">Location</span>
            </div>

            <div className="flex-1 h-[2px] bg-gray-200 mx-4"></div>

            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${step>=3 ? "bg-green-600 text-white" : "bg-gray-200"}`}>3</div>
              <span className="text-sm font-medium">Finish</span>
            </div>

          </div>

          {/* STEP 1 */}
          {step===1 && (
            <div className="space-y-6">

              {/* PROFILE PHOTO */}
              <div className="flex justify-center">

                <label className="relative cursor-pointer group">

                  <img
                    src={preview || "/avatar.png"}
                    className="h-28 w-28 rounded-full object-cover border-4 border-green-100 shadow-md"
                  />

                  <div className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full shadow-lg group-hover:scale-110 transition">
                    <Camera className="text-white h-4 w-4"/>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />

                </label>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="input-premium"
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  className="input-premium"
                />

                <input
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  className="input-premium col-span-2"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="input-premium"
                />

                <select
                  name="gender"
                  onChange={handleChange}
                  className="input-premium"
                >
                  <option value="">Gender</option>
                  <option>male</option>
                  <option>female</option>
                  <option>other</option>
                </select>

                <input
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                  className="input-premium"
                />

              </div>

              <button
                onClick={nextStep}
                className="btn-premium w-full"
              >
                Continue
              </button>

            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div className="space-y-6">

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="state"
                  placeholder="State"
                  onChange={handleChange}
                  className="input-premium"
                />

                <input
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  className="input-premium"
                />

                <input
                  name="area"
                  placeholder="Area / Locality"
                  onChange={handleChange}
                  className="input-premium col-span-2"
                />

              </div>

              <div className="flex justify-between">

                <button
                  onClick={prevStep}
                  className="text-gray-500"
                >
                  Back
                </button>

                <button
                  onClick={nextStep}
                  className="btn-premium"
                >
                  Continue
                </button>

              </div>

            </div>
          )}

          {/* STEP 3 */}
          {step===3 && (
  <div className="space-y-8">

    <div className="text-center">
      <h2 className="text-2xl font-semibold text-foreground">
        Review Your Details
      </h2>
      <p className="text-muted-foreground text-sm mt-1">
        Please confirm your information before creating your HealOne account
      </p>
    </div>

    <div className="bg-muted rounded-2xl p-6 shadow-card">

      <div className="flex items-center gap-4 mb-6">
        <img
          src={preview || "/avatar.png"}
          className="h-16 w-16 rounded-full object-cover border"
        />

        <div>
          <p className="font-semibold">{form.fullName || "Your Name"}</p>
          <p className="text-sm text-muted-foreground">{form.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 text-sm">

        <div>
          <p className="text-muted-foreground">Phone</p>
          <p className="font-medium">{form.phone}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Gender</p>
          <p className="font-medium">{form.gender || "-"}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Date of Birth</p>
          <p className="font-medium">{form.dateOfBirth || "-"}</p>
        </div>

        <div>
          <p className="text-muted-foreground">State</p>
          <p className="font-medium">{form.state}</p>
        </div>

        <div>
          <p className="text-muted-foreground">City</p>
          <p className="font-medium">{form.city}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Area</p>
          <p className="font-medium">{form.area}</p>
        </div>

      </div>

    </div>

    <div className="flex items-center justify-between">

      <button
        onClick={prevStep}
        className="text-muted-foreground hover:text-primary"
      >
        Edit Information
      </button>

      <button
        onClick={handleSubmit}
        className="btn-premium px-8"
      >
        Create Account
      </button>

    </div>

  </div>
)}

        </div>
      </div>
    </div>
  );
}