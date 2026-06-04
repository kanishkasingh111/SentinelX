import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-cyan-400 mb-6">
        SentinelX
      </h1>
      <p className="text-gray-400 text-xl mb-10">
        AI Powered Cyber Security Platform
      </p>
      <div className="flex gap-6">
        <Link
          to="/login"
          className="bg-cyan-500 text-black px-8 py-3 rounded-xl font-semibold"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-gray-800 border border-cyan-500 px-8 py-3 rounded-xl"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
export default Home;