import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-10 w-[400px]">
        <h2 className="text-4xl font-bold text-cyan-400 text-center mb-8">
          Register
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-black border border-gray-700 text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-black border border-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl bg-black border border-gray-700 text-white"
        />

        <button
          onClick={async () => {
            try {
              const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name,
                    email,
                    password,
                  }),
                }
              );

              const data = await response.json();

              if (
                data.message ===
                "User registered successfully"
              ) {
                alert("Registration Successful");

                navigate("/login");
              } else {
                alert(data.message);
              }
            } catch (error) {
              console.log(error);
              alert("Registration failed");
            }
          }}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl"
        >
          Register
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Register;