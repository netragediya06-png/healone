// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../firebase";
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

// const handleLogin = async (e) => {
//   e.preventDefault();

//   try {
//     // 🔥 Firebase Login
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     const firebaseUser = userCredential.user;

//     // 🔥 Fetch MongoDB user by email
//     const res = await axios.get(
//       `http://localhost:5000/api/users/by-email/${firebaseUser.email}`
//     );

//     const dbUser = res.data;

//     // 🔥 Store in localStorage
//     localStorage.setItem("userId", dbUser._id);
//     localStorage.setItem("role", dbUser.role);

//     navigate("/admin");

//   } catch (error) {
//     console.log(error);
//     alert(error.response?.data?.message || error.message);
//   }
// };



//   return (
//   <div
//     className="d-flex justify-content-center align-items-center"
//     style={{
//       height: "100vh",
//       background: "linear-gradient(135deg, #0a2f1f, #0f5132)",
//     }}
//   >
//     <div
//       style={{
//         width: "380px",
//         padding: "38px",
//         borderRadius: "18px",
//         background: "#ffffff",
//         boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
//       }}
//     >
//       {/* Admin Badge */}
//       <div className="text-center mb-3">
//         <div
//           style={{
//             width: "50px",
//             height: "50px",
//             margin: "0 auto",
//             borderRadius: "50%",
//             background: "#145c32",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "white",
//             fontSize: "18px",
//             fontWeight: "bold",
//           }}
//         >
//           A
//         </div>

//         <h5 className="fw-semibold mt-3 mb-1">
//           HealOne Admin
//         </h5>
//         <small className="text-muted">
//           Secure access to admin dashboard
//         </small>
//       </div>

//       <form onSubmit={handleLogin}>
//         {/* Email */}
//         <div className="mb-3">
//           <input
//             type="email"
//             className="form-control"
//             placeholder="Admin Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{
//               borderRadius: "10px",
//               padding: "10px",
//               fontSize: "14px",
//             }}
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-3">
//           <input
//             type="password"
//             className="form-control"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{
//               borderRadius: "10px",
//               padding: "10px",
//               fontSize: "14px",
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn btn-success w-100"
//           style={{
//             borderRadius: "10px",
//             padding: "10px",
//             fontSize: "15px",
//             fontWeight: "500",
//           }}
//         >
//           Login to Dashboard
//         </button>

//         <div className="text-center mt-3">
//           <small className="text-muted">
//             Authorized personnel only
//           </small>
//         </div>
//       </form>
//     </div>
//   </div>
// );


// }
